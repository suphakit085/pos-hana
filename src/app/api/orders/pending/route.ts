import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
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
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        orderCreatedAt: 'desc'
      }
    });

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const formattedOrders = pendingOrders.map(order => {
      return {
        orderID: order.orderID,
        orderItemId: order.orderItemId,
        orderStatus: order.orderStatus,
        orderCreatedAt: order.orderCreatedAt,
        Tables_tabID: order.Tables_tabID,
        tabName: order.table ? `${order.table.tabTypes || 'T'}${order.Tables_tabID}` : `T${order.Tables_tabID}`,
        items: order.orderItems.map(item => ({
          menuItemID: item.MenuItems_menuItemsID,
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
    console.error("Error fetching pending orders:", error);
    return NextResponse.json({ error: "Failed to fetch pending orders" }, { status: 500 });
  }
} 