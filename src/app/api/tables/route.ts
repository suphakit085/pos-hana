// api/tables/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงข้อมูลโต๊ะทั้งหมด
    const tables = await prisma.tables.findMany({
      include: {
        // ดึงข้อมูลออเดอร์ล่าสุดที่ยังไม่ปิด (ไม่ใช่สถานะ CLOSED หรือ CANCELLED)
        orders: {
          where: {
            orderStatus: {
              notIn: ['CLOSED', 'CANCELLED']
            }
          },
          orderBy: {
            orderID: 'desc'
          },
          take: 1,
        }
      }
    });

    // แปลงข้อมูลและปรับสถานะโต๊ะตามเงื่อนไขออเดอร์
    const formattedTables = tables.map(table => {
      // ตรวจสอบว่ามีออเดอร์ที่ยังไม่ปิดหรือไม่
      const hasActiveOrder = table.orders && table.orders.length > 0;
      
      // ถ้าไม่มีออเดอร์ที่ยังไม่ปิด ให้สถานะเป็น "ว่าง"
      // ถ้ามีออเดอร์ที่ยังไม่ปิด ให้ใช้สถานะ "มีลูกค้า" หรือสถานะปัจจุบัน
      const tableStatus = !hasActiveOrder ? "ว่าง" : (table.tabStatus || "มีลูกค้า");
      
      // หาจำนวนลูกค้าจากออเดอร์ล่าสุด (ถ้ามี)
      const customerCount = hasActiveOrder ? table.orders[0].totalCustomerCount : 0;
      
      return {
        tabID: table.tabID,
        tabName: `T${table.tabID.toString().padStart(2, '0')}`,
        tabTypes: table.tabTypes || 'normal',
        tabStatus: tableStatus,
        customerCount: customerCount
      };
    });
    
    return NextResponse.json(formattedTables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { tableId, status } = await request.json();
    
    // อัปเดตสถานะโต๊ะ
    const updatedTable = await prisma.tables.update({
      where: { tabID: tableId }, 
      data: { 
        tabStatus: status,
      }
    });
    
    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json({ error: "Failed to update table" }, { status: 500 });
  }
}