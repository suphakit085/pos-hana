import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Tables_tabID, Employee_empID, BuffetTypes_buffetTypeID, totalCustomerCount, items } = body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!Tables_tabID || !items || !items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // ตรวจสอบว่ามีออเดอร์ที่ยังไม่ปิดของโต๊ะนี้อยู่แล้วหรือไม่
    const existingOrder = await prisma.orders.findFirst({
      where: {
        Tables_tabID: Tables_tabID,
        orderStatus: {
          notIn: ['CLOSED', 'CANCELED']
        }
      }
    });
    
    let result;
    
    if (existingOrder) {
      console.log(`พบออเดอร์ที่ยังไม่ปิดของโต๊ะ ${Tables_tabID} (OrderID: ${existingOrder.orderID})`);
      
      // ดึงรายการ orderItem ที่มีอยู่แล้ว
      const existingOrderItems = await prisma.orderItem.findMany({
        where: {
          Orders_orderID: existingOrder.orderID
        }
      });
      
      // สร้างรายการ orderItem ใหม่ที่จะเพิ่มเข้าไป
      const newOrderItems = await Promise.all(items.map(async (item: any) => {
        // ตรวจสอบว่ามีรายการนี้ในออเดอร์เดิมหรือไม่
        const existingItem = existingOrderItems.find(
          (orderItem: any) => 
            orderItem.MenuItems_menuItemsID === item.MenuItems_menuItemsID && 
            orderItem.menuStatus === 'PENDING' // เฉพาะรายการที่ยังรอดำเนินการเท่านั้น
        );
        
        if (existingItem) {
          // ถ้ามีรายการนี้อยู่แล้วและยังรอดำเนินการ ให้อัพเดทจำนวน
          return prisma.orderItem.update({
            where: {
              id: existingItem.id
            },
            data: {
              Quantity: existingItem.Quantity + item.Quantity
            }
          });
        } else {
          // ถ้ายังไม่มีรายการนี้หรือรายการเดิมได้เสิร์ฟหรือยกเลิกไปแล้ว ให้สร้างรายการใหม่
          return prisma.orderItem.create({
            data: {
              Orders_orderID: existingOrder.orderID,
              MenuItems_menuItemsID: item.MenuItems_menuItemsID,
              Quantity: item.Quantity,
              menuStatus: 'PENDING'
            }
          });
        }
      }));
      
      // ดึงรายการ orderItem ทั้งหมดหลังจากอัพเดท
      const updatedOrderItems = await prisma.orderItem.findMany({
        where: {
          Orders_orderID: existingOrder.orderID
        }
      });
      
      result = {
        message: "Order updated successfully",
        orderID: existingOrder.orderID,
        orderItemId: existingOrder.orderItemId,
        items: updatedOrderItems,
        isNewOrder: false
      };
    } else {
      // สร้าง UUID สำหรับออเดอร์
      const orderItemId = uuidv4();
      
      // สร้างออเดอร์ใหม่
      const newOrder = await prisma.orders.create({
        data: {
          orderItemId: orderItemId,
          orderStatus: 'PENDING',
          Tables_tabID: Tables_tabID,
          Employee_empID: Employee_empID || 1,
          BuffetTypes_buffetTypeID: BuffetTypes_buffetTypeID || 1,
          totalCustomerCount: totalCustomerCount || 1
        }
      });
      
      // สร้างรายการ orderItem
      const orderItems = await Promise.all(items.map((item: any) => 
        prisma.orderItem.create({
          data: {
            Orders_orderID: newOrder.orderID,
            MenuItems_menuItemsID: item.MenuItems_menuItemsID,
            Quantity: item.Quantity,
            menuStatus: 'PENDING'
          }
        })
      ));
      
      // อัพเดตสถานะโต๊ะเป็น "มีลูกค้า"
      await prisma.tables.update({
        where: {
          tabID: Tables_tabID
        },
        data: {
          tabStatus: "มีลูกค้า"
        }
      });
      
      result = {
        message: "Order created successfully",
        orderID: newOrder.orderID,
        orderItemId: newOrder.orderItemId,
        items: orderItems,
        isNewOrder: true
      };
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error processing order:", error);
    return NextResponse.json({ 
      error: "Failed to process order", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
} 