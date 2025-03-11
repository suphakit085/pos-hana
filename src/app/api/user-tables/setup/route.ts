import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function GET(request: Request) {
  try {
    // ตรวจสอบว่ามีโต๊ะอยู่แล้วหรือไม่
    const existingTables = await prisma.tables.findMany();
    
    if (existingTables.length > 0) {
      // ถ้ามีโต๊ะอยู่แล้ว ให้ตรวจสอบว่ามีโต๊ะ VIP หรือไม่
      const vipTable = existingTables.find(table => table.tabTypes === 'VIP');
      
      if (!vipTable) {
        // ถ้ายังไม่มีโต๊ะ VIP ให้สร้างใหม่
        await prisma.tables.create({
          data: {
            tabID: 17,
            tabTypes: 'VIP',
            tabStatus: 'available'
          }
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'โต๊ะทั้งหมดพร้อมใช้งานแล้ว', 
        tableCount: existingTables.length 
      });
    } else {
      // ถ้ายังไม่มีโต๊ะเลย ให้สร้างโต๊ะทั้งหมด
      const tables = [];
      
      // สร้างโต๊ะปกติ 1-16
      for (let i = 1; i <= 16; i++) {
        tables.push({
          tabID: i,
          tabTypes: 'normal',
          tabStatus: 'available'
        });
      }
      
      // สร้างโต๊ะ VIP
      tables.push({
        tabID: 17,
        tabTypes: 'VIP',
        tabStatus: 'available'
      });
      
      // สร้างโต๊ะทั้งหมดในฐานข้อมูล
      await prisma.tables.createMany({
        data: tables
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'สร้างโต๊ะทั้งหมดเรียบร้อยแล้ว', 
        tableCount: tables.length 
      });
    }
  } catch (error) {
    console.error('Error setting up tables:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการตั้งค่าโต๊ะ' }, { status: 500 });
  }
} 