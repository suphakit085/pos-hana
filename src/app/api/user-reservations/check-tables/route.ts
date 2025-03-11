import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');

    if (!dateString) {
      return NextResponse.json({ message: 'กรุณาระบุวันที่' }, { status: 400 });
    }

    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);

    // Get all booked tables for the specified date
    const bookedReservations = await prisma.reservations.findMany({
      where: {
        resDate: {
          equals: date
        },
        resStatus: { 
          not: 'cancelled' 
        }
      },
      select: {
        Tables_tabID: true
      }
    });

    const bookedTables = bookedReservations.map(res => res.Tables_tabID);
    
    // Get all table IDs
    const allTables = await prisma.tables.findMany({
      select: {
        tabID: true
      }
    });
    
    const allTableIds = allTables.map(table => table.tabID);
    
    // Calculate available tables
    const availableTables = allTableIds.filter(id => !bookedTables.includes(id));

    return NextResponse.json({ 
      bookedTables,
      availableTables,
      date: dateString
    });
    
  } catch (error) {
    console.error('Error checking available tables:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบโต๊ะว่าง' }, { status: 500 });
  }
}