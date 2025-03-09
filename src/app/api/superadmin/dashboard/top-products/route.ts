// src/app/api/superadmin/dashboard/top-products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

/**
 * API Route สำหรับดึงข้อมูลสินค้าขายดีสำหรับ Dashboard
 * ใช้แสดงสถิติและรายการสินค้าขายดี
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '30days';
    const branch = url.searchParams.get('branch') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
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
    
    // 1. ข้อมูลสินค้าขายดีตามจำนวนที่ขายได้
    const topProducts = await prisma.orderItem.groupBy({
      by: ['MenuItems_menuItemsID'],
      _sum: {
        Quantity: true,
      },
      where: {
        order: {
          orderCreatedAt: {
            gte: startDate,
            lte: today
          },
          orderStatus: {
            notIn: ['CANCELLED']
          },
          ...branchCondition
        },
        menuStatus: 'SERVED' // เฉพาะรายการที่เสิร์ฟแล้ว ไม่รวมที่ถูกยกเลิก
      },
      orderBy: {
        _sum: {
          Quantity: 'desc',
        },
      },
      take: limit,
    });
    
    // ดึงข้อมูลเมนูและคำนวณยอดขาย
    const enrichedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const menuItem = await prisma.menuItems.findUnique({
          where: { menuItemsID: item.MenuItems_menuItemsID },
          include: {
            buffetType: true // รวมข้อมูลประเภทบุฟเฟต์ด้วย
          }
        });
        
        // คำนวณยอดขายเป็นมูลค่า
        const salesValue = (menuItem?.menuItemsPrice || 0) * (item._sum.Quantity || 0);
        
        return {
          id: item.MenuItems_menuItemsID,
          name: menuItem?.menuItemNameTHA || `รายการ #${item.MenuItems_menuItemsID}`,
          nameEng: menuItem?.menuItemNameENG || '',
          category: menuItem?.category || '',
          buffetType: menuItem?.buffetType?.buffetTypesName || '',
          quantity: item._sum.Quantity || 0,
          price: menuItem?.menuItemsPrice || 0,
          totalSales: salesValue,
          imageUrl: menuItem?.itemImage || null
        };
      })
    );
    
    // 2. ข้อมูลสินค้าขายดีตามยอดขาย (มูลค่า)
    const sortedByRevenue = [...enrichedTopProducts].sort((a, b) => b.totalSales - a.totalSales);
    
    // 3. สรุปข้อมูลตามหมวดหมู่
    const categorySummary: Record<string, { category: string, quantity: number, totalSales: number }> = {};
    
    enrichedTopProducts.forEach(product => {
      const category = product.category || 'ไม่ระบุหมวดหมู่';
      
      if (!categorySummary[category]) {
        categorySummary[category] = {
          category,
          quantity: 0,
          totalSales: 0
        };
      }
      
      categorySummary[category].quantity += product.quantity;
      categorySummary[category].totalSales += product.totalSales;
    });
    
    // คำนวณสัดส่วนของแต่ละหมวดหมู่
    const categoriesStats = Object.values(categorySummary);
    
    // คำนวณจำนวนรวมและยอดขายรวมทั้งหมด
    const totalQuantity = categoriesStats.reduce((sum, cat) => sum + cat.quantity, 0);
    const totalSales = categoriesStats.reduce((sum, cat) => sum + cat.totalSales, 0);
    
    // เพิ่มสัดส่วนเป็นเปอร์เซ็นต์
    const enrichedCategoriesStats = categoriesStats.map(cat => ({
      ...cat,
      percentageByQuantity: totalQuantity > 0 ? (cat.quantity / totalQuantity) * 100 : 0,
      percentageBySales: totalSales > 0 ? (cat.totalSales / totalSales) * 100 : 0
    }));
    
    // เรียงลำดับตามยอดขาย
    const sortedCategories = [...enrichedCategoriesStats].sort((a, b) => b.totalSales - a.totalSales);
    
    // 4. ดึงข้อมูลรายการสินค้าทั้งหมด
    const totalMenuItems = await prisma.menuItems.count();
    
    // 5. จำนวนรายการที่มีการขาย
    const itemsWithSales = topProducts.length;
    
    // สร้างข้อมูลสรุปที่จะส่งกลับ
    const topProductsData = {
      stats: {
        totalMenuItems,
        itemsWithSales,
        totalQuantitySold: totalQuantity,
        totalSalesValue: totalSales,
        period: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        }
      },
      topByQuantity: enrichedTopProducts,
      topByRevenue: sortedByRevenue,
      categoriesStats: sortedCategories,
      // ข้อมูลสินค้าขายดีที่สุด (อันดับ 1)
      bestSeller: enrichedTopProducts.length > 0 ? enrichedTopProducts[0] : null,
      // ข้อมูลหมวดหมู่ที่ขายดีที่สุด
      bestCategory: sortedCategories.length > 0 ? sortedCategories[0] : null
    };
    
    return NextResponse.json(topProductsData);
  } catch (error) {
    console.error('Error fetching top products data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}