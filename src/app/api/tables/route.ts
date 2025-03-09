// src/app/api/tables/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

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
    return NextResponse.json({ 
      error: "Failed to fetch tables", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}

// POST: สร้างโต๊ะใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tabTypes, tabStatus } = body;
    
    if (!tabTypes) {
      return NextResponse.json({ error: "Table type is required" }, { status: 400 });
    }
    
    const newTable = await prisma.tables.create({
      data: {
        tabTypes,
        tabStatus: tabStatus || "ว่าง"
      }
    });
    
    return NextResponse.json({
      message: "Table created successfully",
      table: newTable
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json({ 
      error: "Failed to create table", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}

// ลบ PUT endpoint ระดับ collection ที่นี่ เพื่อป้องกันความสับสน
// ให้ใช้ PUT endpoint ที่อยู่ใน [id]/route.ts แทน