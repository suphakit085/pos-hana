import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: ดึงข้อมูล MenuItem ตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const menuItem = await prisma.menuItems.findUnique({
      where: { menuItemsID: numericId },
      include: { buffetType: true }
    });

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

// PUT: อัพเดตข้อมูล MenuItem ตาม ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();

    // ตรวจสอบว่ามีข้อมูลที่จะอัพเดตหรือไม่
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // ตรวจสอบว่ามี MenuItem ที่ต้องการอัพเดตหรือไม่
    const existingMenuItem = await prisma.menuItems.findUnique({
      where: { menuItemsID: numericId }
    });

    if (!existingMenuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // อัพเดตข้อมูล
    const updatedMenuItem = await prisma.menuItems.update({
      where: { menuItemsID: numericId },
      data: {
        menuItemNameTHA: body.menuItemNameTHA !== undefined ? body.menuItemNameTHA : undefined,
        menuItemNameENG: body.menuItemNameENG !== undefined ? body.menuItemNameENG : undefined,
        menuItemsPrice: body.menuItemsPrice !== undefined ? body.menuItemsPrice : undefined,
        itemImage: body.itemImage !== undefined ? body.itemImage : undefined,
        description: body.description !== undefined ? body.description : undefined,
        category: body.category !== undefined ? body.category : undefined,
        BuffetTypes_buffetTypeID: body.BuffetTypes_buffetTypeID !== undefined ? body.BuffetTypes_buffetTypeID : undefined
      }
    });

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

// DELETE: ลบข้อมูล MenuItem ตาม ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // ตรวจสอบว่ามี MenuItem ที่ต้องการลบหรือไม่
    const existingMenuItem = await prisma.menuItems.findUnique({
      where: { menuItemsID: numericId }
    });

    if (!existingMenuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // ลบข้อมูล
    await prisma.menuItems.delete({
      where: { menuItemsID: numericId }
    });

    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
} 