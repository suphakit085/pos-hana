import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function POST(request: Request) {
  try {
    // ตรวจสอบว่ามีโต๊ะ ID 17 อยู่แล้วหรือไม่
    const existingTable = await prisma.tables.findUnique({
      where: {
        tabID: 17
      }
    });

    if (existingTable) {
      // ถ้ามีอยู่แล้ว ให้อัปเดตเป็น VIP
      const updatedTable = await prisma.tables.update({
        where: {
          tabID: 17
        },
        data: {
          tabTypes: 'VIP',
          tabStatus: 'available'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'อัปเดตโต๊ะ VIP เรียบร้อยแล้ว', 
        table: updatedTable 
      });
    } else {
      // ถ้ายังไม่มี ให้สร้างใหม่
      const newTable = await prisma.tables.create({
        data: {
          tabID: 17,
          tabTypes: 'VIP',
          tabStatus: 'available'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'เพิ่มโต๊ะ VIP เรียบร้อยแล้ว', 
        table: newTable 
      });
    }
  } catch (error) {
    console.error('Error adding VIP table:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการเพิ่มโต๊ะ VIP' }, { status: 500 });
  }
} 