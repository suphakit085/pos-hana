// src/app/api/superadmin/sales-by-time-of-day/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { NextRequest } from 'next/server';

const TIME_RANGES = [
  { 
    id: 'morning',
    label: 'ช่วงเช้า',
    startHour: 6,
    endHour: 9,
    display: 'ช่วงเช้า' 
  },
  { 
    id: 'late_morning',
    label: 'ช่วงสาย',
    startHour: 10,
    endHour: 12,
    display: 'ช่วงสาย' 
  },
  { 
    id: 'afternoon', 
    label: 'ช่วงบ่าย',
    startHour: 13,
    endHour: 15,
    display: 'ช่วงบ่าย' 
  },
  { 
    id: 'evening',
    label: 'ช่วงเย็น',
    startHour: 16,
    endHour: 18,
    display: 'ช่วงเย็น' 
  },
  { 
    id: 'night',
    label: 'ช่วงค่ำ',
    startHour: 19,
    endHour: 21,
    display: 'ช่วงค่ำ' 
  },
  { 
    id: 'late_night',
    label: 'ช่วงดึก',
    startHour: 22,
    endHour: 23,
    display: 'ช่วงดึก' 
  }
];

const DAYS_OF_WEEK = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
];

export async function GET(request: NextRequest) {
  try {
    // รับพารามิเตอร์จาก URL
    const url = new URL(request.url);
    const timeRangeParam = url.searchParams.get('timeRange') || '30days';
    
    // กำหนดช่วงเวลา
    let start: Date;
    const end = endOfDay(new Date());
    
    // ตั้งค่าช่วงเวลาตามค่าที่รับมา
    switch (timeRangeParam) {
      case '7days':
        start = startOfDay(subDays(end, 7));
        break;
      case '30days':
        start = startOfDay(subDays(end, 30));
        break;
      case '90days':
        start = startOfDay(subDays(end, 90));
        break;
      case 'year':
        start = startOfDay(subDays(end, 365));
        break;
      default:
        start = startOfDay(subDays(end, 30));
    }
    
    // ดึงข้อมูลบิลจากฐานข้อมูล
    const bills = await prisma.bill.findMany({
      where: {
        billCreateAt: {
          gte: start,
          lte: end
        },
        billStatus: 'PAID',
      },
      include: {
        payment: true
      },
      orderBy: {
        billCreateAt: 'asc'
      }
    });
    
    // สร้างข้อมูลยอดขายแยกตามช่วงเวลา
    // 1. ข้อมูลรวมทุกวัน
    const timeRangeData = {};
    
    // เตรียมข้อมูลสำหรับแต่ละช่วงเวลา
    TIME_RANGES.forEach(range => {
      timeRangeData[range.id] = {
        timeRange: `${range.startHour.toString().padStart(2, '0')}:00-${range.endHour.toString().padStart(2, '0')}:59`,
        revenue: 0,
        orders: 0,
        customers: 0,
        display: range.display
      };
    });
    
    // 2. ข้อมูลแยกตามวันและช่วงเวลา
    const dayAndTimeData = {};
    
    // เตรียมข้อมูลสำหรับแต่ละวันในสัปดาห์และช่วงเวลา
    DAYS_OF_WEEK.forEach(day => {
      dayAndTimeData[day] = {};
      
      TIME_RANGES.forEach(range => {
        dayAndTimeData[day][range.id] = {
          day,
          timeRange: `${range.startHour.toString().padStart(2, '0')}:00-${range.endHour.toString().padStart(2, '0')}:59`,
          revenue: 0,
          orders: 0,
          customers: 0,
          display: range.display
        };
      });
    });
    
    // วนลูปข้อมูลบิลเพื่อจัดกลุ่มตามช่วงเวลาและวัน
    bills.forEach(bill => {
      const billDate = new Date(bill.billCreateAt);
      const hour = billDate.getHours();
      const dayOfWeek = DAYS_OF_WEEK[billDate.getDay()];
      
      // หาช่วงเวลาที่ตรงกับเวลาในบิล
      const timeRange = TIME_RANGES.find(
        range => hour >= range.startHour && hour <= range.endHour
      );
      
      if (timeRange) {
        // เพิ่มข้อมูลลงในข้อมูลรวมทุกวัน
        timeRangeData[timeRange.id].revenue += bill.totalAmount;
        timeRangeData[timeRange.id].orders += 1;
        timeRangeData[timeRange.id].customers += bill.order?.totalCustomerCount || 1;
        
        // เพิ่มข้อมูลลงในข้อมูลแยกตามวันและช่วงเวลา
        if (dayAndTimeData[dayOfWeek] && dayAndTimeData[dayOfWeek][timeRange.id]) {
          dayAndTimeData[dayOfWeek][timeRange.id].revenue += bill.totalAmount;
          dayAndTimeData[dayOfWeek][timeRange.id].orders += 1;
          dayAndTimeData[dayOfWeek][timeRange.id].customers += bill.order?.totalCustomerCount || 1;
        }
      }
    });
    
    // แปลงข้อมูลให้อยู่ในรูปแบบอาร์เรย์
    const dailyData = Object.values(timeRangeData);
    
    // แปลงข้อมูลแยกตามวันและช่วงเวลาให้อยู่ในรูปแบบอาร์เรย์
    const weeklyData = [];
    
    Object.entries(dayAndTimeData).forEach(([day, timeRanges]) => {
      Object.values(timeRanges).forEach(data => {
        weeklyData.push(data);
      });
    });
    
    // ส่งข้อมูลกลับไป
    return NextResponse.json({
      dailyData,
      weeklyData,
      period: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
      }
    });
    
  } catch (error) {
    console.error('Error fetching sales by time of day:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales by time of day', details: error.message },
      { status: 500 }
    );
  }
}