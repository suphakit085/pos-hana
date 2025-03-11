import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';

export async function POST(request: Request) {
  const data = await request.json();
  const reservation = await prisma.reservations.create({
    data: {
      data: {
        resName: data.resName,
        resDate: new Date(data.resDate),
        resTime: data.resTime,
        numberOfPeople: parseInt(data.numberOfPeople),
        resStatus: 'pending',
        resPhone: data.resPhone,
        Customer_customerID: data.customerID,
        Tables_tabID: parseInt(data.tableId)
      // ... your reservation data
    }
}});

  return NextResponse.json(
    { 
      message: 'จองโต๊ะสำเร็จ',
      redirectUrl: `/reservations/summary${reservation.resStatus === 'confirmed' ? 'confirmed' : 
        reservation.resStatus === 'cancelled' ? 'cancelled' : ''}?resID=${reservation.resID}`
    },
    { status: 201 }
  );
}