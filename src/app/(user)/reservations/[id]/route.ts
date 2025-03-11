import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prismadb';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'ไม่พบรหัสการจอง' }, { status: 400 });
    }

    const reservationId = parseInt(id);

    if (isNaN(reservationId)) {
      return NextResponse.json({ message: 'รหัสการจองไม่ถูกต้อง' }, { status: 400 });
    }

    const reservation = await prisma.reservations.findUnique({
      where: {
        resID: reservationId
      },
      include: {
        customer: true
      }
    });

    if (!reservation) {
      return NextResponse.json({ message: 'ไม่พบข้อมูลการจอง' }, { status: 404 });
    }

    const formattedReservation = {
      id: reservation.resID,
      customerName: reservation.customer.firstName,
      resPhone: reservation.resPhone, // Use phone from reservations table instead of customer table
      numberOfPeople: reservation.numberOfPeople,
      tableNumber: reservation.Tables_tabID,
      reservationDate: reservation.resDate,
      formattedDate: format(new Date(reservation.resDate), 'EEEE dd MMMM yyyy', { locale: th }),
      reservationTime: reservation.resTime,
      status: reservation.resStatus
    };

    return NextResponse.json({ 
      reservation: formattedReservation 
    });

  } catch (error) {
    console.error('Error fetching reservation details:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' }, { status: 500 });
  }
}