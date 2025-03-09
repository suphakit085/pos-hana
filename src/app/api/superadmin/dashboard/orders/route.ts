// src/app/api/superadmin/dashboard/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

/**
 * API Route สำหรับดึงข้อมูลออเดอร์และสถานะสำหรับ Dashboard
 * ใช้ในการแสดงข้อมูลสรุปสถานะออเดอร์และยอดขาย
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
    
    // 1. ดึงข้อมูลออเดอร์ทั้งหมดในช่วงเวลาที่เลือก
    const orders = await prisma.orders.findMany({
      where: {
        orderCreatedAt: {
          gte: startDate,
          lte: today
        },
        ...branchCondition
      },
      include: {
        employee: true,
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        },
        bill: true
      },
      orderBy: {
        orderCreatedAt: 'desc'
      }
    });
    
    // 2. สรุปจำนวนออเดอร์ตามสถานะ
    const orderStatusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0,
      other: 0
    };
    
    // 3. สรุปยอดขายตามสถานะ
    const orderStatusSales = {
      completed: 0,
      pending: 0,
      cancelled: 0,
      other: 0
    };
    
    // 4. ข้อมูลเวลาเฉลี่ยในการเสิร์ฟอาหาร
    let totalServingTime = 0;
    let ordersWithServingTime = 0;
    
    // 5. จำนวนรายการในออเดอร์เฉลี่ย
    let totalItems = 0;
    
    // 6. จำนวนลูกค้าทั้งหมด
    let totalCustomers = 0;
    
    // 7. ข้อมูลแยกตามหมวดหมู่อาหาร
    const categoryData: Record<string, { count: number, totalSales: number }> = {};
    
    // วนลูปทุกออเดอร์เพื่อสรุปข้อมูล
    orders.forEach(order => {
      // จำแนกตามสถานะ
      if (order.orderStatus === 'COMPLETED' || order.orderStatus === 'CLOSED') {
        orderStatusCount.completed++;
      } else if (order.orderStatus === 'CANCELLED') {
        orderStatusCount.cancelled++;
      } else if (order.orderStatus === 'PENDING') {
        orderStatusCount.pending++;
      } else {
        orderStatusCount.other++;
      }
      
      // สรุปยอดขายตามสถานะ
      let orderValue = 0;
      if (order.bill && order.bill.length > 0) {
        orderValue = order.bill.reduce((sum, bill) => sum + bill.totalAmount, 0);
      } else {
        // ถ้าไม่มีบิล ให้ประมาณการจากรายการในออเดอร์
        orderValue = order.orderItems.reduce((sum, item) => {
          const price = item.menuItem?.menuItemsPrice || 0;
          return sum + (price * item.Quantity);
        }, 0);
      }
      
      if (order.orderStatus === 'COMPLETED' || order.orderStatus === 'CLOSED') {
        orderStatusSales.completed += orderValue;
      } else if (order.orderStatus === 'CANCELLED') {
        orderStatusSales.cancelled += orderValue;
      } else if (order.orderStatus === 'PENDING') {
        orderStatusSales.pending += orderValue;
      } else {
        orderStatusSales.other += orderValue;
      }
      
      // นับจำนวนรายการทั้งหมด
      totalItems += order.orderItems.length;
      
      // นับจำนวนลูกค้าทั้งหมด
      totalCustomers += order.totalCustomerCount || 0;
      
      // จัดกลุ่มตามหมวดหมู่อาหาร
      order.orderItems.forEach(item => {
        const category = item.menuItem?.category || 'ไม่ระบุหมวดหมู่';
        
        if (!categoryData[category]) {
          categoryData[category] = {
            count: 0,
            totalSales: 0
          };
        }
        
        categoryData[category].count += item.Quantity || 0;
        categoryData[category].totalSales += (item.menuItem?.menuItemsPrice || 0) * item.Quantity;
      });
    });
    
    // 8. ข้อมูลการใช้โต๊ะ
    // สร้างแม็ปเพื่อนับจำนวนออเดอร์ต่อโต๊ะ
    const tablesUsage = new Map<number, { count: number, customers: number, orders: number }>();
    
    orders.forEach(order => {
      const tableId = order.Tables_tabID;
      
      if (!tablesUsage.has(tableId)) {
        tablesUsage.set(tableId, {
          count: 0,
          customers: 0,
          orders: 0
        });
      }
      
      const tableData = tablesUsage.get(tableId);
      if (tableData) {
        tableData.count++;
        tableData.customers += order.totalCustomerCount || 0;
        tableData.orders += order.orderItems.length;
      }
    });
    
    // คำนวณสถิติการใช้โต๊ะ
    const tablesCount = tablesUsage.size;
    let totalTableUsage = 0;
    let totalTableCustomers = 0;
    let totalTableOrders = 0;
    
    tablesUsage.forEach(table => {
      totalTableUsage += table.count;
      totalTableCustomers += table.customers;
      totalTableOrders += table.orders;
    });
    
    const avgOrdersPerTable = tablesCount > 0 ? totalTableOrders / tablesCount : 0;
    const avgCustomersPerTable = tablesCount > 0 ? totalTableCustomers / tablesCount : 0;
    
    // 9. แปลงข้อมูลหมวดหมู่เป็นอาร์เรย์
    const categoryStats = Object.entries(categoryData).map(([category, data]) => ({
      category,
      count: data.count,
      totalSales: data.totalSales
    })).sort((a, b) => b.totalSales - a.totalSales); // เรียงตามยอดขาย
    
    // สร้างข้อมูลสรุปที่จะส่งกลับ
    const ordersData = {
      summary: {
        totalOrders: orders.length,
        completedOrders: orderStatusCount.completed,
        pendingOrders: orderStatusCount.pending,
        cancelledOrders: orderStatusCount.cancelled,
        otherOrders: orderStatusCount.other,
        completedSales: orderStatusSales.completed,
        pendingSales: orderStatusSales.pending,
        cancelledSales: orderStatusSales.cancelled,
        otherSales: orderStatusSales.other,
        totalSales: Object.values(orderStatusSales).reduce((sum, val) => sum + val, 0),
        avgItemsPerOrder: orders.length > 0 ? totalItems / orders.length : 0,
        totalCustomers,
        avgCustomersPerOrder: orders.length > 0 ? totalCustomers / orders.length : 0,
        period: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        }
      },
      tables: {
        totalTablesUsed: tablesCount,
        avgOrdersPerTable,
        avgCustomersPerTable,
        totalTableUsage
      },
      categories: categoryStats,
      recentOrders: orders.slice(0, 10).map(order => ({
        orderID: order.orderID,
        orderItemId: order.orderItemId,
        status: order.orderStatus,
        createdAt: order.orderCreatedAt,
        tableId: order.Tables_tabID,
        tableName: order.table ? `${order.table.tabTypes || 'T'}${order.Tables_tabID}` : `T${order.Tables_tabID}`,
        customerCount: order.totalCustomerCount,
        itemCount: order.orderItems.length,
        total: order.bill && order.bill.length > 0 
          ? order.bill[0].totalAmount 
          : order.orderItems.reduce((sum, item) => sum + ((item.menuItem?.menuItemsPrice || 0) * item.Quantity), 0)
      }))
    };
    
    return NextResponse.json(ordersData);
  } catch (error) {
    console.error('Error fetching orders data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}