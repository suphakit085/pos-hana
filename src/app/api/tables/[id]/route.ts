// src/app/api/tables/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET: ดึงข้อมูลโต๊ะตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ await เพื่อรอให้ params ถูกแกะค่าออกมา (ในกรณีที่เป็น Promise)
    const { id } = params;
    
    // ลองแปลงเป็นตัวเลขและค้นหาด้วย tabID
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    
    // ดึงข้อมูลโต๊ะตาม tabID
    const table = await prisma.tables.findUnique({
      where: {
        tabID: numericId
      },
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

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // แปลงข้อมูลและปรับสถานะโต๊ะตามเงื่อนไขออเดอร์
    const hasActiveOrder = table.orders && table.orders.length > 0;
    const tableStatus = !hasActiveOrder ? "ว่าง" : (table.tabStatus || "มีลูกค้า");
    const customerCount = hasActiveOrder && table.orders[0].totalCustomerCount ? table.orders[0].totalCustomerCount : 0;
    
    const formattedTable = {
      tabID: table.tabID,
      tabName: `T${table.tabID.toString().padStart(2, '0')}`,
      tabTypes: table.tabTypes,
      tabStatus: tableStatus,
      customerCount: customerCount
    };
    
    return NextResponse.json(formattedTable);
  } catch (error) {
    console.error("Error fetching table:", error);
    return NextResponse.json({ error: "Failed to fetch table", details: (error as Error).message }, { status: 500 });
  }
}

// PUT: อัพเดตสถานะโต๊ะ
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }
    
    // ตรวจสอบว่ามีโต๊ะนี้หรือไม่
    const existingTable = await prisma.tables.findUnique({
      where: { tabID: numericId },
      include: {
        reservations: {
          where: {
            resStatus: 'CONFIRMED',
            // ตรวจสอบการจองที่ยังไม่หมดอายุ (วันที่ปัจจุบันหรืออนาคต)
            resDate: {
              gte: new Date()
            },
            deletedAt: null
          }
        }
      }
    });
    
    if (!existingTable) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    
    // ตรวจสอบว่าโต๊ะถูกจองไว้หรือไม่
    if (existingTable.reservations.length > 0 && status === 'ว่าง') {
      return NextResponse.json({ 
        error: "Table is already reserved", 
        reservations: existingTable.reservations 
      }, { status: 400 });
    }
    
    // อัพเดตสถานะโต๊ะ
    const updatedTable = await prisma.tables.update({
      where: { tabID: numericId },
      data: { tabStatus: status }
    });
    
    return NextResponse.json({
      message: "Table status updated successfully",
      table: {
        tabID: updatedTable.tabID,
        tabStatus: updatedTable.tabStatus
      }
    });
  } catch (error) {
    console.error("Error updating table status:", error);
    return NextResponse.json({ 
      error: "Failed to update table status", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}