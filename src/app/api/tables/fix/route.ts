// src/app/api/tables/fix/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. แก้ไขประเภทโต๊ะ 17 เป็น VIP
    await prisma.tables.update({
      where: { tabID: 17 },
      data: { tabTypes: 'VIP' }
    });
    console.log("Updated table 17 to VIP type");

    // 2. ตรวจสอบและแก้ไขสถานะโต๊ะ 4
    // ค้นหาออเดอร์ที่ยังไม่ปิดของโต๊ะ 4
    const activeOrders = await prisma.orders.findMany({
      where: {
        Tables_tabID: 4,
        orderStatus: {
          notIn: ['CLOSED', 'CANCELLED']
        }
      }
    });

    if (activeOrders.length > 0) {
      // ถ้ามีออเดอร์ที่ยังไม่ปิด ให้ปิดออเดอร์ทั้งหมด
      const updatePromises = activeOrders.map(order => 
        prisma.orders.update({
          where: { orderID: order.orderID },
          data: { orderStatus: 'CLOSED' }
        })
      );
      
      await Promise.all(updatePromises);
      console.log(`Closed ${updatePromises.length} active orders for table 4`);
    }

    // อัพเดตสถานะโต๊ะ 4 เป็น "ว่าง"
    await prisma.tables.update({
      where: { tabID: 4 },
      data: { tabStatus: 'ว่าง' }
    });
    console.log("Updated table 4 status to 'ว่าง'");

    return NextResponse.json({ 
      success: true, 
      message: "Fixed table 17 (set to VIP) and table 4 (cleared active orders and set status to 'ว่าง')" 
    });
  } catch (error) {
    console.error("Error fixing tables:", error);
    return NextResponse.json({ 
      error: "Failed to fix tables", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}