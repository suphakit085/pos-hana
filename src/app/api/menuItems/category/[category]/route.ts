import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: ดึงข้อมูล MenuItem ตามประเภท (category)
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // ดึงข้อมูลจาก database ตาม category
    const menuItems = await prisma.menuItems.findMany({
      where: { category },
      include: { buffetType: true }
    });

    if (menuItems.length === 0) {
      return NextResponse.json({ message: "No menu items found for this category" }, { status: 404 });
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
} 