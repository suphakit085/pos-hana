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
        totalCustomerCount: totalCustomerCount || 1,
        orderItems: {
          create: items.map((item: any) => ({
            MenuItems_menuItemsID: item.MenuItems_menuItemsID,
            Quantity: item.Quantity,
            menuStatus: 'PENDING'
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
    
    // อัพเดตสถานะโต๊ะเป็น "มีลูกค้า"
    await prisma.tables.update({
      where: {
        tabID: Tables_tabID
      },
      data: {
        tabStatus: "มีลูกค้า"
      }
    });
    
    return NextResponse.json({
      message: "Order created successfully",
      orderID: newOrder.orderID,
      orderItemId: newOrder.orderItemId,
      items: newOrder.orderItems
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ 
      error: "Failed to create order", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
} 