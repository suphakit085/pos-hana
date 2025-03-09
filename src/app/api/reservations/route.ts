//src\app\api\reservations\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reservations
export async function GET() {
  try {
    const reservations = await prisma.reservations.findMany({
      where: {
        deletedAt: null, // Only get non-deleted reservations
        resStatus: 'pending' // Only get pending reservations
      },
      orderBy: [
        {
          resDate: 'asc'
        },
        {
          resTime: 'asc'
        }
      ]
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// PATCH /api/reservations/:id
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { resStatus } = await request.json();
    
    // Validate status
    if (!['confirmed', 'cancelled', 'pending'].includes(resStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservations.update({
      where: {
        resID: parseInt(params.id), // Convert string ID to number
        deletedAt: null // Only update if not deleted
      },
      data: {
        resStatus,
      },
    });
    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
} 