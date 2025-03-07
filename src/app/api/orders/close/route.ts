import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { tableId } = body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!tableId) {
      return NextResponse.json({ error: "Table ID is required" }, { status: 400 });
    }
    
    // ค้นหาออเดอร์ที่ยังไม่ปิดของโต๊ะนี้
    const activeOrders = await prisma.orders.findMany({
      where: {
        Tables_tabID: tableId,
        orderStatus: {
          notIn: ['CLOSED', 'CANCELLED']
        }
      }
    });
    
    if (activeOrders.length === 0) {
      return NextResponse.json({ error: "No active orders found for this table" }, { status: 404 });
    }
    
    // อัพเดตสถานะของทุกออเดอร์ที่ยังไม่ปิดเป็น CLOSED
    const updatePromises = activeOrders.map(order => 
      prisma.orders.update({
        where: { orderID: order.orderID },
        data: { orderStatus: 'CLOSED' }
      })
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ 
      message: "Orders closed successfully",
      closedOrders: activeOrders.length
    });
  } catch (error) {
    console.error("Error closing orders:", error);
    return NextResponse.json({ error: "Failed to close orders" }, { status: 500 });
  }
} 