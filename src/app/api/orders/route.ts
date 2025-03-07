import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tableId = url.searchParams.get('tableId');
    const status = url.searchParams.get('status');
    
    // สร้างเงื่อนไขสำหรับการค้นหา
    const whereCondition: any = {};
    
    // ถ้ามีการระบุ tableId ให้กรองตาม tableId
    if (tableId) {
      whereCondition.Tables_tabID = parseInt(tableId);
    }
    
    // ถ้ามีการระบุ status ให้กรองตาม status
    if (status === 'active') {
      whereCondition.orderStatus = {
        notIn: ['CLOSED', 'CANCELLED']
      };
    } else if (status) {
      whereCondition.orderStatus = status;
    }
    
    // ดึงข้อมูลจาก database
    const orders = await prisma.orders.findMany({
      where: whereCondition,
      include: {
        table: true,
        buffetType: true,
        employee: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        orderCreatedAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
} 