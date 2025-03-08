import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendNotification } from '../notifications/route';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderID, menuItemID, status, orderItemID } = body;
    
    console.log("Received update request:", { orderID, menuItemID, status, orderItemID });
    
    // ถ้ามี orderItemID ให้อัพเดตเฉพาะรายการนั้น
    if (orderItemID) {
      console.log("Updating specific order item by ID:", orderItemID);
      
      const updatedItem = await prisma.orderItem.update({
        where: {
          id: orderItemID
        },
        data: {
          menuStatus: status
        },
        include: {
          order: {
            select: {
              Tables_tabID: true
            }
          },
          menuItem: {
            select: {
              menuItemNameTHA: true,
              menuItemNameENG: true
            }
          }
        }
      });
      
      console.log("Updated specific order item:", updatedItem);
      
      // ถ้าสถานะเป็น 'CANCELLED' ให้ส่งการแจ้งเตือนไปยังลูกค้า
      if (status === 'CANCELLED' && updatedItem.order?.Tables_tabID) {
        const tableId = updatedItem.order.Tables_tabID.toString();
        const menuName = updatedItem.menuItem?.menuItemNameTHA || 'รายการอาหาร';
        
        // ส่งการแจ้งเตือนไปยังลูกค้า
        sendNotification(tableId, {
          type: 'order_cancelled',
          message: `รายการ ${menuName} ถูกยกเลิกโดยพนักงาน`,
          orderItemID: orderItemID,
          menuItemID: menuItemID,
          orderID: orderID,
          menuName: menuName
        });
        
        console.log(`Sent cancellation notification to table ${tableId}`);
      }
      
      // ตรวจสอบว่ายังมีรายการที่รอดำเนินการอยู่หรือไม่
      if (status === 'SERVED' || status === 'CANCELLED') {
        const pendingItems = await prisma.orderItem.findMany({
          where: {
            Orders_orderID: orderID,
            menuStatus: 'PENDING'
          }
        });
        
        console.log("Pending items count:", pendingItems.length);
        
        // ถ้าไม่มีรายการที่รอดำเนินการ ให้อัพเดตสถานะของออเดอร์เป็น 'COMPLETED'
        if (pendingItems.length === 0) {
          await prisma.orders.update({
            where: {
              orderID: orderID
            },
            data: {
              orderStatus: 'COMPLETED'
            }
          });
          console.log("Updated order status to COMPLETED");
        }
      }
      
      return NextResponse.json({
        message: "Order item status updated successfully",
        data: updatedItem
      });
    }
    
    // ตรวจสอบข้อมูลที่จำเป็น (กรณีไม่มี orderItemID)
    if (!orderID || !menuItemID || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // ค้นหารายการล่าสุดที่ตรงกับเงื่อนไข (เรียงตาม ID จากมากไปน้อย)
    const latestOrderItem = await prisma.orderItem.findFirst({
      where: {
        Orders_orderID: orderID,
        MenuItems_menuItemsID: menuItemID,
        menuStatus: 'PENDING' // อัพเดตเฉพาะรายการที่ยังรอดำเนินการ
      },
      orderBy: {
        id: 'desc' // เรียงจากรายการล่าสุด
      },
      include: {
        order: {
          select: {
            Tables_tabID: true
          }
        },
        menuItem: {
          select: {
            menuItemNameTHA: true,
            menuItemNameENG: true
          }
        }
      }
    });
    
    if (!latestOrderItem) {
      console.log("Pending order item not found:", { orderID, menuItemID });
      return NextResponse.json({ error: "Pending order item not found" }, { status: 404 });
    }
    
    console.log("Found latest order item:", latestOrderItem);
    
    // อัพเดตเฉพาะรายการล่าสุด
    const updatedItem = await prisma.orderItem.update({
      where: {
        id: latestOrderItem.id
      },
      data: {
        menuStatus: status
      }
    });
    
    console.log("Updated latest order item:", updatedItem);
    
    // ถ้าสถานะเป็น 'CANCELLED' ให้ส่งการแจ้งเตือนไปยังลูกค้า
    if (status === 'CANCELLED' && latestOrderItem.order?.Tables_tabID) {
      const tableId = latestOrderItem.order.Tables_tabID.toString();
      const menuName = latestOrderItem.menuItem?.menuItemNameTHA || 'รายการอาหาร';
      
      // ส่งการแจ้งเตือนไปยังลูกค้า
      sendNotification(tableId, {
        type: 'order_cancelled',
        message: `รายการ ${menuName} ถูกยกเลิกโดยพนักงาน`,
        orderItemID: latestOrderItem.id,
        menuItemID: menuItemID,
        orderID: orderID,
        menuName: menuName
      });
      
      console.log(`Sent cancellation notification to table ${tableId}`);
    }
    
    // ถ้าสถานะเป็น 'SERVED' หรือ 'CANCELLED' ให้ตรวจสอบว่าทุกรายการในออเดอร์นี้เสร็จสิ้นหรือไม่
    if (status === 'SERVED' || status === 'CANCELLED') {
      // ตรวจสอบว่ายังมีรายการที่รอดำเนินการอยู่หรือไม่
      const pendingItems = await prisma.orderItem.findMany({
        where: {
          Orders_orderID: orderID,
          menuStatus: 'PENDING'
        }
      });
      
      console.log("Pending items count:", pendingItems.length);
      
      // ถ้าไม่มีรายการที่รอดำเนินการ ให้อัพเดตสถานะของออเดอร์เป็น 'COMPLETED'
      if (pendingItems.length === 0) {
        await prisma.orders.update({
          where: {
            orderID: orderID
          },
          data: {
            orderStatus: 'COMPLETED'
          }
        });
        console.log("Updated order status to COMPLETED");
      }
    }
    
    return NextResponse.json({
      message: "Order item status updated successfully",
      data: updatedItem
    });
  } catch (error) {
    console.error("Error updating order item status:", error);
    return NextResponse.json({ 
      error: "Failed to update order item status",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}