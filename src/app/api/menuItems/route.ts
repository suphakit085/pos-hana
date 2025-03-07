import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: ดึงข้อมูล MenuItems ทั้งหมด หรือกรองตามเงื่อนไข
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const buffetTypeID = searchParams.get('buffetTypeID');

    // สร้างเงื่อนไขสำหรับการค้นหา
    const whereCondition: any = {};
    
    // ถ้ามีการระบุ category ให้กรองตาม category
    if (category) {
      whereCondition.category = category;
    }
    
    // ถ้ามีการระบุ buffetTypeID ให้กรองตาม buffetTypeID
    if (buffetTypeID) {
      whereCondition.BuffetTypes_buffetTypeID = parseInt(buffetTypeID);
    }

    // ดึงข้อมูลจาก database
    const menuItems = await prisma.menuItems.findMany({
      where: whereCondition,
      include: {
        buffetType: true // รวมข้อมูลของ buffetType ด้วย
      }
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

// POST: เพิ่มข้อมูล MenuItem ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.menuItemNameTHA || !body.menuItemNameENG || !body.menuItemsPrice || 
        !body.category || !body.BuffetTypes_buffetTypeID) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // สร้างข้อมูลใหม่
    const newMenuItem = await prisma.menuItems.create({
      data: {
        menuItemNameTHA: body.menuItemNameTHA,
        menuItemNameENG: body.menuItemNameENG,
        menuItemsPrice: body.menuItemsPrice,
        itemImage: body.itemImage || "",
        description: body.description || "",
        category: body.category,
        BuffetTypes_buffetTypeID: body.BuffetTypes_buffetTypeID
      }
    });

    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
} 