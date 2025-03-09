// src/app/api/superadmin/salesbytime/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { startOfDay, endOfDay, format, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const branch = url.searchParams.get('branch') || 'all';
    
    // ดึงข้อมูลจำนวนออเดอร์ในแต่ละสถานะ
    const completedOrders = await prisma.orders.count({
      where: {
        isDeleted: false,
        orderStatus: 'CLOSED',
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    const pendingOrders = await prisma.orders.count({
      where: {
        isDeleted: false,
        orderStatus: 'PENDING',
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    const cancelledOrders = await prisma.orders.count({
      where: {
        isDeleted: false,
        orderStatus: 'CANCELLED',
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    // ดึงข้อมูลมูลค่าออเดอร์ในแต่ละสถานะ
    const completedSales = await prisma.bill.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        paymentStatus: 'COMPLETED',
        billStatus: 'PAID',
        order: {
          orderStatus: 'CLOSED'
        },
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    const pendingSales = await prisma.bill.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        paymentStatus: {
          not: 'COMPLETED'
        },
        order: {
          orderStatus: 'PENDING'
        },
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    const cancelledSales = await prisma.bill.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        order: {
          orderStatus: 'CANCELLED'
        },
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      }
    });
    
    // ดึงข้อมูลออเดอร์ 7 วันล่าสุด
    const last7Days = subDays(new Date(), 7);
    
    const recentOrders = await prisma.orders.findMany({
      where: {
        isDeleted: false,
        orderCreatedAt: {
          gte: startOfDay(last7Days)
        },
        ...(branch !== 'all' && {
          // เพิ่มเงื่อนไขสาขาถ้าไม่ใช่ 'all'
        })
      },
      include: {
        employee: true,
        table: true,
        buffetType: true,
        bill: true
      },
      orderBy: {
        orderCreatedAt: 'desc'
      },
      take: 50
    });
    
    // แปลงข้อมูลให้เรียบง่ายสำหรับการส่งผ่าน API
    const formattedOrders = recentOrders.map(order => ({
      orderID: order.orderID,
      orderItemId: order.orderItemId,
      orderStatus: order.orderStatus,
      orderCreatedAt: format(new Date(order.orderCreatedAt), 'yyyy-MM-dd HH:mm:ss'),
      tableID: order.Tables_tabID,
      tableName: order.table ? order.table.tabTypes : `โต๊ะ ${order.Tables_tabID}`,
      employeeName: order.employee ? `${order.employee.empFname} ${order.employee.empLname}` : 'ไม่ระบุ',
      buffetType: order.buffetType ? order.buffetType.buffetTypesName : 'ไม่ระบุ',
      totalCustomerCount: order.totalCustomerCount,
      totalAmount: order.bill ? order.bill.totalAmount : 0,
      isPaid: order.bill ? (order.bill.paymentStatus === 'COMPLETED') : false
    }));
    
    return NextResponse.json({
      completedOrders: completedOrders || 0,
      pendingOrders: pendingOrders || 0,
      cancelledOrders: cancelledOrders || 0,
      completedSales: completedSales._sum.totalAmount || 0,
      pendingSales: pendingSales._sum.totalAmount || 0,
      cancelledSales: cancelledSales._sum.totalAmount || 0,
      recentOrders: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching orders data:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders data" },
      { status: 500 }
    );
  }
}