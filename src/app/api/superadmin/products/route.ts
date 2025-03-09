// src/app/api/superadmin/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. ดึงข้อมูลสินค้าทั้งหมด
    const totalProducts = await prisma.menuItems.count();
    
    // 2. ดึงข้อมูลสินค้าที่มีพร้อมขาย (พิจารณาจากสินค้าที่มีรูปภาพ)
    const availableProducts = await prisma.menuItems.count({
      where: {
        itemImage: {
          not: ""
        }
      }
    });
    
    // 3. ดึงข้อมูลสินค้าขายดี
    const topProducts = await prisma.orderItem.groupBy({
      by: ['MenuItems_menuItemsID'],
      _sum: {
        Quantity: true,
      },
      orderBy: {
        _sum: {
          Quantity: 'desc',
        },
      },
      take: 10,
    });
    
    // 4. ดึงรายละเอียดสินค้าขายดี
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const menuItem = await prisma.menuItems.findUnique({
          where: { menuItemsID: product.MenuItems_menuItemsID },
        });
        
        return {
          id: product.MenuItems_menuItemsID,
          name: menuItem?.menuItemNameTHA || `สินค้า #${product.MenuItems_menuItemsID}`,
          quantity: product._sum.Quantity || 0,
          amount: (menuItem?.menuItemsPrice || 0) * (product._sum.Quantity || 0),
        };
      })
    );
    
    // 5. ดึงข้อมูลหมวดหมู่ขายดี
    const categories = await prisma.menuItems.groupBy({
      by: ['category'],
      _count: true,
    });

    // หาหมวดหมู่ที่มีสินค้ามากที่สุด
    let bestCategory = { name: 'ไม่ระบุหมวดหมู่', count: 0, percent: 0 };
    
    if (categories.length > 0) {
      // เรียงลำดับและหาหมวดหมู่ที่มีสินค้ามากที่สุด
      const sortedCategories = categories.sort((a, b) => b._count - a._count);
      const topCategory = sortedCategories[0];
      
      bestCategory = {
        name: topCategory.category || 'ไม่ระบุหมวดหมู่',
        count: topCategory._count,
        percent: totalProducts > 0 ? (topCategory._count / totalProducts) * 100 : 0
      };
    }
    
    // 6. ข้อมูลสินค้าขายดีที่สุด
    const bestSellingProduct = topProductsWithDetails.length > 0 
      ? {
          name: topProductsWithDetails[0].name,
          quantity: topProductsWithDetails[0].quantity,
          percent: topProductsWithDetails.reduce((sum, p) => sum + p.quantity, 0) > 0 
            ? (topProductsWithDetails[0].quantity / topProductsWithDetails.reduce((sum, p) => sum + p.quantity, 0)) * 100 
            : 0
        }
      : { name: 'ไม่มีข้อมูล', quantity: 0, percent: 0 };
    
    // 7. คำนวณเปอร์เซ็นต์สินค้าพร้อมขาย
    const percentAvailable = totalProducts > 0 
      ? (availableProducts / totalProducts) * 100 
      : 0;
    
    return NextResponse.json({
      totalProducts,
      availableProducts,
      percentAvailable,
      bestSellingProduct,
      bestCategory,
      topProducts: topProductsWithDetails
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
    return NextResponse.json(
      { error: "Failed to fetch product data" },
      { status: 500 }
    );
  }
}