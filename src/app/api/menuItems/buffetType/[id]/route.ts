import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: ดึงข้อมูล MenuItems ตามประเภทบุฟเฟต์
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const buffetTypeID = parseInt(id);
    
    if (isNaN(buffetTypeID)) {
      return NextResponse.json({ error: "Invalid buffet type ID" }, { status: 400 });
    }

    // ตรวจสอบว่ามีประเภทบุฟเฟต์นี้หรือไม่
    const buffetType = await prisma.buffetTypes.findUnique({
      where: { buffetTypeID }
    });

    if (!buffetType) {
      return NextResponse.json({ error: "Buffet type not found" }, { status: 404 });
    }

    // ดึงข้อมูลจาก database ตาม buffetTypeID
    const menuItems = await prisma.menuItems.findMany({
      where: { BuffetTypes_buffetTypeID: buffetTypeID },
      include: { buffetType: true }
    });

    if (menuItems.length === 0) {
      return NextResponse.json({ message: "No menu items found for this buffet type" }, { status: 404 });
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by buffet type:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
} 