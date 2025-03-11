import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reservations/today - ดึงข้อมูลการจองของวันนี้
export async function GET() {
  try {
    // กำหนดขอบเขตของวันนี้ (ตั้งแต่เริ่มต้นวันจนถึงสิ้นสุดวัน)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    
    console.log('กำลังดึงข้อมูลการจองสำหรับวันนี้:', {
      เริ่มต้น: today.toISOString(),
      สิ้นสุด: tomorrow.toISOString()
    });
    
    // ค้นหาเฉพาะการจองที่ยืนยันแล้วสำหรับวันนี้
    const reservations = await prisma.reservations.findMany({
      where: {
        resDate: {
          gte: today,
          
        },
        deletedAt: null,
        resStatus: 'confirmed'
      },
      orderBy: {
        resTime: 'asc'
      }
    });
    
    console.log(`พบการจอง ${reservations.length} รายการสำหรับวันนี้`);
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจองของวันนี้:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลการจองของวันนี้ได้' },
      { status: 500 }
    );
  }
}