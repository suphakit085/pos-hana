// src/app/api/superadmin/top-products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // รับพารามิเตอร์จาก URL
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '30days';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // กำหนดช่วงเวลาตามพารามิเตอร์
    let startDate: Date;
    const endDate = endOfDay(new Date());

    switch (timeRange) {
      case '7days':
        startDate = startOfDay(subDays(new Date(), 7));
        break;
      case '30days':
        startDate = startOfDay(subDays(new Date(), 30));
        break;
      case '90days':
        startDate = startOfDay(subDays(new Date(), 90));
        break;
      case 'year':
        startDate = startOfDay(subDays(new Date(), 365));
        break;
      default:
        startDate = startOfDay(subDays(new Date(), 30));
    }

    // ดึงข้อมูลสินค้าขายดีในช่วงเวลาที่กำหนด
    const topProducts = await prisma.orderItem.groupBy({
      by: ['MenuItems_menuItemsID'],
      _sum: {
        Quantity: true,
      },
      where: {
        order: {
          orderCreatedAt: {
            gte: startDate,
            lte: endDate,
          },
          // กรองเฉพาะออเดอร์ที่ปิดการขายแล้ว และไม่ถูกยกเลิก
          orderStatus: 'CLOSED',
        },
        // กรองเฉพาะรายการที่ถูกเสิร์ฟแล้ว ไม่ถูกยกเลิก
        menuStatus: 'SERVED',
      },
      orderBy: {
        _sum: {
          Quantity: 'desc',
        },
      },
      take: limit,
    });

    // ดึงรายละเอียดข้อมูลสินค้า
    const productDetails = await Promise.all(
      topProducts.map(async (product) => {
        const menuItem = await prisma.menuItems.findUnique({
          where: {
            menuItemsID: product.MenuItems_menuItemsID,
          },
          include: {
            buffetType: true,
          },
        });

        // ดึงจำนวนยอดขายเป็นมูลค่า
        const salesValue = await prisma.orderItem.aggregate({
          _sum: {
            Quantity: true,
          },
          where: {
            MenuItems_menuItemsID: product.MenuItems_menuItemsID,
            order: {
              orderCreatedAt: {
                gte: startDate,
                lte: endDate,
              },
              orderStatus: 'CLOSED',
            },
            menuStatus: 'SERVED',
          },
        });

        return {
          menuItemID: menuItem?.menuItemsID || product.MenuItems_menuItemsID,
          nameTH: menuItem?.menuItemNameTHA || 'ไม่ระบุชื่อ',
          nameEN: menuItem?.menuItemNameENG || '',
          category: menuItem?.category || '',
          buffetType: menuItem?.buffetType?.buffetTypesName || '',
          quantitySold: product._sum.Quantity || 0,
          price: menuItem?.menuItemsPrice || 0,
          totalSales: (menuItem?.menuItemsPrice || 0) * (product._sum.Quantity || 0),
          imageUrl: menuItem?.itemImage || null,
        };
      })
    );

    // ข้อมูลสรุป
    const totalQuantitySold = productDetails.reduce((sum, product) => sum + product.quantitySold, 0);
    const totalSalesValue = productDetails.reduce((sum, product) => sum + product.totalSales, 0);

    // จัดกลุ่มตามหมวดหมู่
    const categorySummary = {};
    productDetails.forEach((product) => {
      const category = product.category || 'ไม่ระบุหมวดหมู่';
      if (!categorySummary[category]) {
        categorySummary[category] = {
          category,
          quantitySold: 0,
          totalSales: 0,
        };
      }
      categorySummary[category].quantitySold += product.quantitySold;
      categorySummary[category].totalSales += product.totalSales;
    });

    return NextResponse.json({
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
      },
      summary: {
        totalQuantitySold,
        totalSalesValue,
      },
      topProducts: productDetails,
      categorySummary: Object.values(categorySummary),
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products', details: error.message },
      { status: 500 }
    );
  }
}