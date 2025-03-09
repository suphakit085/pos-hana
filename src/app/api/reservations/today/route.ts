//src\app\api\reservations\today\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reservations/today
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = await prisma.reservations.findMany({
      where: {
        resDate: {
          gte: today,
          lt: tomorrow,
        },
        deletedAt: null,
        resStatus: 'confirmed'
      },
      orderBy: {
        resTime: 'asc'
      }
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching today\'s reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today\'s reservations' },
      { status: 500 }
    );
  }
} 
