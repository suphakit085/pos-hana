import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function POST(request: Request) {
    try {
        const { reservationId } = await request.json();

        const updatedReservation = await prisma.reservations.update({
            where: {
                resID: reservationId
            },
            data: {
                resStatus: 'cancelled'
            }
        });

        return NextResponse.json(updatedReservation);
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดในการยกเลิกการจอง' },
            { status: 500 }
        );
    }
}