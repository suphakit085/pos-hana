//src\app\api\reservations\[id]\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// DELETE /api/reservations/:id (Soft Delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedReservation = await prisma.reservations.update({
      where: {
        resID: parseInt(params.id), // Convert string ID to number
        deletedAt: null // Only delete if not already deleted
      },
      data: {
        deletedAt: new Date(), // Set current timestamp
      },
    });
    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error soft deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}

// GET: ดึงข้อมูลการจองตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    
    // ค้นหาข้อมูลการจองตาม ID
    const reservation = await prisma.reservations.findUnique({
      where: {
        resID: parseInt(id), // Convert string ID to number
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error retrieving reservation:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reservation' },
      { status: 500 }
    );
  }
}

// PUT: อัพเดตสถานะการจอง
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ใช้ destructuring เพื่อแกะค่า id จาก params
    const { id } = params;
    const body = await request.json();
    
    // อัพเดตสถานะการจอง
    const updatedReservation = await prisma.reservations.update({
      where: {
        resID: parseInt(id), // Convert string ID to number
      },
      data: {
        resStatus: body.resStatus, // Use resStatus from the request body
      },
    });
    console.log('Updated reservation:', updatedReservation);
    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation status' },
      { status: 500 }
    );
  }
}