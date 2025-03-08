import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tableId = url.searchParams.get('tableId');
    
    if (!tableId) {
      return NextResponse.json({ error: 'Missing tableId parameter' }, { status: 400 });
    }
    
    // แปลง tableId เป็นตัวเลข
    const numericTableId = parseInt(tableId);
    
    if (isNaN(numericTableId)) {
      return NextResponse.json({ error: 'Invalid tableId format' }, { status: 400 });
    }
    
    // ดึงข้อมูลออเดอร์ของโต๊ะนี้ที่ยังไม่ปิด
    const orders = await prisma.orders.findMany({
      where: {
        Tables_tabID: numericTableId,
        orderStatus: {
          notIn: ['CLOSED', 'CANCELLED']
        }
      },
      include: {
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
    const formattedOrders = orders.map(order => {
      return {
        orderID: order.orderID,
        orderStatus: order.orderStatus,
        orderCreatedAt: order.orderCreatedAt,
        tabID: order.Tables_tabID,
        empID: order.Employee_empID,
        items: order.orderItems.map(item => ({
          orderID: order.orderID,
          menuItemID: item.MenuItems_menuItemsID,
          quantity: item.Quantity,
          status: item.menuStatus,
          menuItem: {
            menuItemID: item.menuItem.menuItemsID,
            NameTHA: item.menuItem.menuItemNameTHA,
            NameENG: item.menuItem.menuItemNameENG,
            menuItemsPrice: item.menuItem.menuItemsPrice,
            itemImage: item.menuItem.itemImage,
            description: item.menuItem.description || '',
            category: item.menuItem.category
          }
        }))
      };
    });
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json({ error: "Failed to fetch order history" }, { status: 500 });
  }
} 