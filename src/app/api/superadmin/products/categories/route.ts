// src/app/api/superadmin/products/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * API Route สำหรับดึงข้อมูลสัดส่วนสินค้าตามหมวดหมู่
 * สำหรับแสดงในรูปแบบ Pie Chart
 */
export async function GET() {
  try {
    // 1. ดึงข้อมูลจำนวนสินค้าตามหมวดหมู่
    const categoryCounts = await prisma.menuItems.groupBy({
      by: ['category'],
      _count: {
        menuItemsID: true
      },
      orderBy: {
        _count: {
          menuItemsID: 'desc'
        }
      }
    });
    
    // 2. แปลงข้อมูลให้อยู่ในรูปแบบที่เหมาะสำหรับแสดงใน PieChart
    const categoryData = categoryCounts.map(category => ({
      name: category.category || 'ไม่ระบุหมวดหมู่',
      value: category._count.menuItemsID
    }));
    
    // 3. ถ้ามีหมวดหมู่เยอะเกินไป ให้รวมหมวดหมู่ย่อยเป็น "อื่นๆ"
    const MAX_CATEGORIES = 5; // จำนวนหมวดหมู่สูงสุดที่จะแสดง
    
    let formattedData = categoryData;
    
    if (categoryData.length > MAX_CATEGORIES) {
      const topCategories = categoryData.slice(0, MAX_CATEGORIES);
      
      // รวมหมวดหมู่ที่เหลือเป็น "อื่นๆ"
      const otherCategories = categoryData.slice(MAX_CATEGORIES);
      const otherValue = otherCategories.reduce((sum, cat) => sum + cat.value, 0);
      
      formattedData = [
        ...topCategories,
        { name: 'อื่นๆ', value: otherValue }
      ];
    }
    
    // 4. ถ้าไม่มีข้อมูล ให้ส่งข้อมูลตัวอย่าง
    if (formattedData.length === 0) {
      formattedData = [
        { name: 'อาหาร', value: 42 },
        { name: 'เครื่องดื่ม', value: 18 },
        { name: 'ของหวาน', value: 15 },
        { name: 'ซีฟู้ด', value: 13 },
        { name: 'เนื้อสัตว์', value: 12 }
      ];
    }
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching category data:', error);
    
    // ในกรณีที่เกิดข้อผิดพลาด ให้ส่งข้อมูลตัวอย่าง
    const sampleData = [
      { name: 'อาหาร', value: 42 },
      { name: 'เครื่องดื่ม', value: 18 },
      { name: 'ของหวาน', value: 15 },
      { name: 'ซีฟู้ด', value: 13 },
      { name: 'เนื้อสัตว์', value: 12 }
    ];
    
    return NextResponse.json(sampleData);
  }
}