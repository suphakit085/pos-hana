// src/app/api/superadmin/dashboard/customers/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

/**
 * API Route สำหรับดึงข้อมูลลูกค้าสำหรับ Dashboard
 * ใช้ในส่วนแสดงจำนวนลูกค้าและการวิเคราะห์ข้อมูลลูกค้า
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
      // เช่น { branch: branch }
    } : {};
    
    // 1. ดึงข้อมูลจำนวนลูกค้าทั้งหมดในช่วงเวลาที่เลือก
    const ordersWithCustomers = await prisma.orders.findMany({
      where: {
        orderCreatedAt: {
          gte: startDate,
          lte: today
        },
        orderStatus: {
          notIn: ['CANCELLED']
        },
        isDeleted: false,
        ...branchCondition
      },
      select: {
        orderID: true,
        totalCustomerCount: true,
        orderCreatedAt: true,
        Tables_tabID: true
      }
    });
    
    // รวมจำนวนลูกค้าทั้งหมด
    const totalCustomers = ordersWithCustomers.reduce(
      (sum, order) => sum + (order.totalCustomerCount || 0), 
      0
    );
    
    // 2. ดึงข้อมูลบิลชำระเงินทั้งหมดในช่วงเวลาเดียวกัน
    const bills = await prisma.bill.findMany({
      where: {
        billCreateAt: {
          gte: startDate,
          lte: today
        },
        billStatus: 'PAID',
        ...branchCondition
      },
      select: {
        billID: true,
        totalAmount: true,
        billCreateAt: true,
        orderID: true
      }
    });
    
    // 3. คำนวณค่าเฉลี่ยต่อลูกค้าและต่อบิล
    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const averagePerCustomer = totalCustomers > 0 ? totalSales / totalCustomers : 0;
    const averagePerBill = bills.length > 0 ? totalSales / bills.length : 0;
    
    // 4. จำนวนลูกค้าเฉลี่ยต่อวัน
    // สร้างแม็ปของวันที่และจำนวนลูกค้า
    const customersByDay = new Map();
    
    ordersWithCustomers.forEach(order => {
      const date = format(new Date(order.orderCreatedAt), 'yyyy-MM-dd');
      const currentCount = customersByDay.get(date) || 0;
      customersByDay.set(date, currentCount + (order.totalCustomerCount || 0));
    });
    
    // คำนวณค่าเฉลี่ยต่อวัน
    let averageCustomersPerDay = 0;
    if (customersByDay.size > 0) {
      const totalDailyCustomers = Array.from(customersByDay.values()).reduce((sum, count) => sum + count, 0);
      averageCustomersPerDay = totalDailyCustomers / customersByDay.size;
    }
    
    // 5. แนวโน้มการเติบโตของลูกค้า
    // ดึงข้อมูลลูกค้าในช่วงเวลาก่อนหน้า
    const previousStartDate = subDays(startDate, 
      timeRange === '7days' ? 7 : 
      timeRange === '30days' ? 30 : 
      timeRange === '90days' ? 90 : 365
    );
    
    const previousOrdersWithCustomers = await prisma.orders.findMany({
      where: {
        orderCreatedAt: {
          gte: previousStartDate,
          lt: startDate
        },
        orderStatus: {
          notIn: ['CANCELLED']
        },
        isDeleted: false,
        ...branchCondition
      },
      select: {
        totalCustomerCount: true
      }
    });
    
    // รวมจำนวนลูกค้าในช่วงก่อนหน้า
    const previousTotalCustomers = previousOrdersWithCustomers.reduce(
      (sum, order) => sum + (order.totalCustomerCount || 0), 
      0
    );
    
    // คำนวณการเติบโตของจำนวนลูกค้า (เป็นเปอร์เซ็นต์)
    let customerGrowth = 0;
    if (previousTotalCustomers > 0) {
      customerGrowth = ((totalCustomers - previousTotalCustomers) / previousTotalCustomers) * 100;
    } else if (totalCustomers > 0) {
      customerGrowth = 100; // ถ้าช่วงก่อนหน้าไม่มีลูกค้า แต่ช่วงปัจจุบันมี ถือว่าเติบโต 100%
    }
    
    // 6. ข้อมูลการใช้งานโต๊ะ
    const uniqueTables = new Set(ordersWithCustomers.map(o => o.Tables_tabID)).size;
    const customerPerTable = uniqueTables > 0 ? totalCustomers / uniqueTables : 0;
    
    // ดึงข้อมูลการจองโต๊ะ (ถ้ามี)
    const reservations = await prisma.reservations.count({
      where: {
        resDate: {
          gte: startDate,
          lte: today
        },
        resStatus: 'confirmed',
        deletedAt: null,
        ...branchCondition
      }
    });
    
    // สร้างข้อมูลที่จะส่งกลับ
    const customerData = {
      stats: {
        totalCustomers,
        averagePerCustomer,
        averagePerBill,
        averageCustomersPerDay,
        customerGrowth,
        totalReservations: reservations,
        uniqueTables,
        customerPerTable
      },
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      }
    };
    
    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}