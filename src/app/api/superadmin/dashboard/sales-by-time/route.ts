// src/app/api/superadmin/dashboard/sales-by-time/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

// ช่วงเวลาที่ต้องการแบ่ง
const TIME_RANGES = [
  { id: 'morning', label: 'ช่วงเช้า', startHour: 6, endHour: 9 },
  { id: 'late_morning', label: 'ช่วงสาย', startHour: 10, endHour: 12 },
  { id: 'afternoon', label: 'ช่วงบ่าย', startHour: 13, endHour: 15 },
  { id: 'evening', label: 'ช่วงเย็น', startHour: 16, endHour: 18 },
  { id: 'night', label: 'ช่วงค่ำ', startHour: 19, endHour: 21 },
  { id: 'late_night', label: 'ช่วงดึก', startHour: 22, endHour: 23 }
];

// วันในสัปดาห์
const DAYS_OF_WEEK = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

/**
 * API Route สำหรับดึงข้อมูลยอดขายแยกตามช่วงเวลาของวัน
 * ใช้สำหรับการวิเคราะห์ช่วงเวลาที่มียอดขายสูงสุด
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '30days';
    const branch = url.searchParams.get('branch') || 'all';
    
    // กำหนดช่วงเวลา
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7days':
        startDate = subDays(today, 7);
        break;
      case '30days':
        startDate = subDays(today, 30);
        break;
      case '90days':
        startDate = subDays(today, 90);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 30);
    }

    // สร้าง query conditions สำหรับการกรองตามสาขา
    const branchCondition = branch !== 'all' ? {
      // ใส่เงื่อนไขการกรองตามสาขาตามโครงสร้างฐานข้อมูลจริง
    } : {};

    // 1. ดึงข้อมูลบิลทั้งหมดในช่วงเวลาที่เลือก พร้อมชั่วโมงที่ชำระเงิน
    const salesByHourRaw = await prisma.$queryRaw`
      SELECT 
        HOUR(billCreateAt) as hour,
        SUM(totalAmount) as revenue,
        COUNT(*) as orders,
        SUM(grandTotal) as grandTotal
      FROM Bill
      WHERE 
        billStatus = 'PAID'
        AND billCreateAt >= ${startDate}
        AND billCreateAt <= ${today}
      GROUP BY HOUR(billCreateAt)
      ORDER BY hour
    `;
    
    // 2. จัดกลุ่มข้อมูลตามช่วงเวลาที่กำหนด
    const timeRangeData: Record<string, { revenue: number, orders: number, customers: number }> = {};
    
    // สร้างข้อมูลเริ่มต้นสำหรับแต่ละช่วงเวลา
    TIME_RANGES.forEach(range => {
      timeRangeData[range.id] = {
        revenue: 0,
        orders: 0,
        customers: 0
      };
    });
    
    // เพิ่มข้อมูลจากผลลัพธ์การ query
    if (Array.isArray(salesByHourRaw)) {
      salesByHourRaw.forEach((hourData: any) => {
        const hour = Number(hourData.hour) || 0;
        
        // หาช่วงเวลาที่ชั่วโมงนี้อยู่
        const timeRange = TIME_RANGES.find(
          range => hour >= range.startHour && hour <= range.endHour
        );
        
        if (timeRange) {
          timeRangeData[timeRange.id].revenue += Number(hourData.revenue) || 0;
          timeRangeData[timeRange.id].orders += Number(hourData.orders) || 0;
          
          // สมมติว่าแต่ละบิลมีลูกค้าเฉลี่ย 3 คน หรือดึงจากข้อมูลจริงถ้ามี
          timeRangeData[timeRange.id].customers += (Number(hourData.orders) || 0) * 3;
        }
      });
    }
    
    // 3. ดึงข้อมูลแยกตามวันในสัปดาห์และช่วงเวลา
    const salesByDayAndHourRaw = await prisma.$queryRaw`
      SELECT 
        DAYOFWEEK(billCreateAt) as dayOfWeek,
        HOUR(billCreateAt) as hour,
        SUM(totalAmount) as revenue,
        COUNT(*) as orders
      FROM Bill
      WHERE 
        billStatus = 'PAID'
        AND billCreateAt >= ${startDate}
        AND billCreateAt <= ${today}
      GROUP BY DAYOFWEEK(billCreateAt), HOUR(billCreateAt)
      ORDER BY dayOfWeek, hour
    `;
    
    // 4. สร้างข้อมูลแยกตามวันและช่วงเวลา
    const dayAndTimeData: Record<string, Record<string, { revenue: number, orders: number, customers: number }>> = {};
    
    // สร้างโครงสร้างข้อมูลเริ่มต้น
    DAYS_OF_WEEK.forEach(day => {
      dayAndTimeData[day] = {};
      
      TIME_RANGES.forEach(range => {
        dayAndTimeData[day][range.id] = {
          revenue: 0,
          orders: 0,
          customers: 0
        };
      });
    });
    
    // เพิ่มข้อมูลจากผลลัพธ์การ query
    if (Array.isArray(salesByDayAndHourRaw)) {
      salesByDayAndHourRaw.forEach((item: any) => {
        const dayIndex = Number(item.dayOfWeek) - 1; // DAYOFWEEK เริ่มจาก 1 (อาทิตย์)
        const hour = Number(item.hour) || 0;
        const day = DAYS_OF_WEEK[dayIndex];
        
        // หาช่วงเวลาที่ชั่วโมงนี้อยู่
        const timeRange = TIME_RANGES.find(
          range => hour >= range.startHour && hour <= range.endHour
        );
        
        if (timeRange && dayAndTimeData[day] && dayAndTimeData[day][timeRange.id]) {
          dayAndTimeData[day][timeRange.id].revenue += Number(item.revenue) || 0;
          dayAndTimeData[day][timeRange.id].orders += Number(item.orders) || 0;
          dayAndTimeData[day][timeRange.id].customers += (Number(item.orders) || 0) * 3;
        }
      });
    }
    
    // 5. แปลงข้อมูลให้อยู่ในรูปแบบที่เหมาะสมกับการนำไปใช้
    // ข้อมูลรวมทุกวัน
    const dailyData = Object.entries(timeRangeData).map(([id, data]) => {
      const range = TIME_RANGES.find(r => r.id === id);
      return {
        id,
        label: range?.label || id,
        timeRange: `${range?.startHour.toString().padStart(2, '0')}:00-${range?.endHour.toString().padStart(2, '0')}:59`,
        revenue: data.revenue,
        orders: data.orders,
        customers: data.customers
      };
    }).sort((a, b) => b.revenue - a.revenue); // เรียงตามยอดขาย
    
    // ข้อมูลแยกตามวันและช่วงเวลา
    const weeklyData = [];
    
    Object.entries(dayAndTimeData).forEach(([day, timeRanges]) => {
      Object.entries(timeRanges).forEach(([id, data]) => {
        const range = TIME_RANGES.find(r => r.id === id);
        
        weeklyData.push({
          day,
          id,
          label: range?.label || id,
          timeRange: `${range?.startHour.toString().padStart(2, '0')}:00-${range?.endHour.toString().padStart(2, '0')}:59`,
          revenue: data.revenue,
          orders: data.orders,
          customers: data.customers
        });
      });
    });
    
    // เรียงตามยอดขาย (จากมากไปน้อย)
    weeklyData.sort((a, b) => b.revenue - a.revenue);
    
    // 6. หาช่วงเวลาที่มียอดขายสูงสุด
    const bestTimeSlot = dailyData.length > 0 ? dailyData[0] : null;
    
    // 7. หาวันและช่วงเวลาที่มียอดขายสูงสุด
    const bestDayAndTime = weeklyData.length > 0 ? weeklyData[0] : null;
    
    // สร้างข้อมูลที่จะส่งกลับ
    const salesByTimeData = {
      dailyData,
      weeklyData,
      bestTimeSlot,
      bestDayAndTime,
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      }
    };
    
    return NextResponse.json(salesByTimeData);
  } catch (error) {
    console.error('Error fetching sales by time data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales by time data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}