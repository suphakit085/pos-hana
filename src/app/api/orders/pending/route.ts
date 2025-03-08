import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // ดึง query parameter status จาก URL
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    // กำหนดเงื่อนไขสำหรับการค้นหา orderItems
    let orderItemsWhere: any = {};
    
    // ถ้ามีการระบุสถานะ ให้กรองตามสถานะนั้น
    if (status) {
      orderItemsWhere.menuStatus = status;
    } else {
      // ถ้าไม่ระบุสถานะ ให้ดึงเฉพาะรายการที่รอดำเนินการ (default)
      orderItemsWhere.menuStatus = 'PENDING';
    }
    
    // ดึงข้อมูลออเดอร์ที่ยังไม่เสร็จสิ้น (ไม่ใช่สถานะ CLOSED หรือ CANCELLED)
    const pendingOrders = await prisma.orders.findMany({
      where: {
        orderStatus: {
          notIn: ['CLOSED', 'CANCELLED']
        }
      },
      include: {
        table: true,
        orderItems: {
          where: orderItemsWhere,
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        orderCreatedAt: 'desc'
      }
    });

    // กรองออเดอร์ที่ไม่มีรายการอาหารตามเงื่อนไขออก
    const ordersWithItems = pendingOrders.filter(order => order.orderItems.length > 0);

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const formattedOrders = ordersWithItems.map(order => {
      return {
        orderID: order.orderID,
        orderItemId: order.orderItemId,
        orderStatus: order.orderStatus,
        orderCreatedAt: order.orderCreatedAt,
        Tables_tabID: order.Tables_tabID,
        tabName: order.table ? `${order.table.tabTypes || 'T'}${order.Tables_tabID}` : `T${order.Tables_tabID}`,
        items: order.orderItems.map(item => ({
          menuItemID: item.MenuItems_menuItemsID,
          orderItemID: item.id,
          menuItem: {
            menuItemsID: item.menuItem.menuItemsID,
            menuItemNameTHA: item.menuItem.menuItemNameTHA,
            menuItemNameENG: item.menuItem.menuItemNameENG,
            menuItemsPrice: item.menuItem.menuItemsPrice,
            itemImage: item.menuItem.itemImage,
            category: item.menuItem.category
          },
          quantity: item.Quantity,
          status: item.menuStatus
        }))
      };
    });
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
} 