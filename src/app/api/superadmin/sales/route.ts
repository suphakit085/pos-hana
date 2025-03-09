// src/app/api/superadmin/sales/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, subMonths, format } from 'date-fns';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // รับพารามิเตอร์จาก URL
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '30days';
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';

    // กำหนดช่วงเวลาตามพารามิเตอร์
    let start: Date;
    let end = endOfDay(new Date());

    if (startDate && endDate) {
      // ถ้ามีการระบุวันที่เริ่มต้นและสิ้นสุด
      start = startOfDay(new Date(startDate));
      end = endOfDay(new Date(endDate));
    } else {
      // ถ้าไม่ระบุ ใช้ timeRange แทน
      switch (timeRange) {
        case '7days':
          start = startOfDay(subDays(new Date(), 7));
          break;
        case '30days':
          start = startOfDay(subDays(new Date(), 30));
          break;
        case '90days':
          start = startOfDay(subDays(new Date(), 90));
          break;
        case 'year':
          start = startOfDay(subMonths(new Date(), 12));
          break;
        default:
          start = startOfDay(subDays(new Date(), 30));
      }
    }

    // ดึงข้อมูลบิลในช่วงวันที่ที่กำหนด
    const bills = await prisma.bill.findMany({
      where: {
        billCreateAt: {
          gte: start,
          lte: end,
        },
        billStatus: 'PAID',
      },
      include: {
        order: {
          include: {
            employee: true,
          },
        },
        payment: true,
      },
      orderBy: {
        billCreateAt: 'asc',
      },
    });

    // คำนวณสรุปข้อมูล
    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalOrders = bills.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // จัดกลุ่มข้อมูลตามวัน
    const salesByDate = {};
    
    bills.forEach((bill) => {
      const dateKey = format(bill.billCreateAt, 'yyyy-MM-dd');
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = {
          date: dateKey,
          revenue: 0,
          orders: 0,
          avgOrderValue: 0,
        };
      }
      
      salesByDate[dateKey].revenue += bill.totalAmount;
      salesByDate[dateKey].orders += 1;
    });
    
    // คำนวณค่าเฉลี่ยต่อออเดอร์สำหรับแต่ละวัน
    Object.values(salesByDate).forEach((day: any) => {
      day.avgOrderValue = day.orders > 0 ? day.revenue / day.orders : 0;
    });
    
    // แปลงข้อมูลเป็นอาร์เรย์
    const salesData = Object.values(salesByDate);

    // คำนวณการเติบโต (เปรียบเทียบครึ่งแรกกับครึ่งหลังของช่วงเวลา)
    const middleIndex = Math.floor(salesData.length / 2);
    const firstHalf = salesData.slice(0, middleIndex);
    const secondHalf = salesData.slice(middleIndex);
    
    const firstHalfTotal = firstHalf.reduce((sum, day: any) => sum + day.revenue, 0);
    const secondHalfTotal = secondHalf.reduce((sum, day: any) => sum + day.revenue, 0);
    
    const salesGrowth = firstHalfTotal > 0 
      ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
      : 0;

    return NextResponse.json({
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
        salesGrowth,
        period: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
      },
      salesData,
      bills: bills.map(bill => ({
        billID: bill.billID,
        date: format(bill.billCreateAt, 'yyyy-MM-dd'),
        time: format(bill.billCreateAt, 'HH:mm:ss'),
        amount: bill.totalAmount,
        paymentMethod: bill.payment?.paymentTypes || 'ไม่ระบุ',
        employee: bill.order?.employee 
          ? `${bill.order.employee.empFname} ${bill.order.employee.empLname}`
          : 'ไม่ระบุ',
      })),
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales report', details: error.message },
      { status: 500 }
    );
  }
}