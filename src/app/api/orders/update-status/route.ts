import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderID, menuItemID, status } = body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!orderID || !menuItemID || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // ตรวจสอบว่ามีรายการสั่งอาหารนี้หรือไม่
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        Orders_orderID: orderID,
        MenuItems_menuItemsID: menuItemID
      }
    });
    
    if (!orderItem) {
      return NextResponse.json({ error: "Order item not found" }, { status: 404 });
    }
    
    // อัพเดตสถานะของรายการสั่งอาหาร
    const updatedOrderItem = await prisma.orderItem.update({
      where: {
        id: orderItem.id
      },
      data: {
        menuStatus: status
      }
    });
    
    // ถ้าสถานะเป็น 'SERVED' หรือ 'CANCELLED' ให้ตรวจสอบว่าทุกรายการในออเดอร์นี้เสร็จสิ้นหรือไม่
    if (status === 'SERVED' || status === 'CANCELLED') {
      const remainingItems = await prisma.orderItem.findMany({
        where: {
          Orders_orderID: orderID,
          menuStatus: {
            not: 'PENDING'
          }
        }
      });
      
      // ถ้าไม่มีรายการที่รอดำเนินการ ให้อัพเดตสถานะของออเดอร์เป็น 'COMPLETED'
      if (remainingItems.length === 0) {
        await prisma.orders.update({
          where: {
            orderID: orderID
          },
          data: {
            orderStatus: 'COMPLETED'
          }
        });
      }
    }
    
    return NextResponse.json({
      message: "Order item status updated successfully",
      data: updatedOrderItem
    });
  } catch (error) {
    console.error("Error updating order item status:", error);
    return NextResponse.json({ error: "Failed to update order item status" }, { status: 500 });
  }
} 