import { NextResponse } from 'next/server';
import {prisma} from '../../../../lib/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      resName, 
      phoneNumber, 
      numberOfPeople, 
      tableNumber, 
      reservationDate, 
      reservationTime,
      status,
      customerID
    } = body;

    // Validate required fields
    if (!resName || !phoneNumber || !numberOfPeople || !tableNumber || !reservationDate || !reservationTime) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // แปลง reservationDate เป็น Date object (เฉพาะวันที่)
    const parsedDate = new Date(reservationDate);
    // ตั้งเวลาเป็น 00:00:00 และปรับ timezone ให้ถูกต้อง
    parsedDate.setUTCHours(0, 0, 0, 0);

    // แปลง reservationTime เป็น Date object (เฉพาะเวลา)
    const [hours, minutes] = reservationTime.split(':');
    const timeString = new Date();
    timeString.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if the table is already booked for the selected date and time
    const existingReservation = await prisma.reservations.findFirst({
      where: {
        AND: [
          { Tables_tabID: Number(tableNumber) },
          { resDate: parsedDate },
          { resTime: timeString },
          { resStatus: { not: 'cancelled' } }
        ]
      }
    });

    if (existingReservation) {
      return NextResponse.json({ 
        message: 'โต๊ะนี้ถูกจองแล้วสำหรับเวลาที่เลือก กรุณาเลือกโต๊ะอื่นหรือเวลาอื่น' 
      }, { status: 409 });
    }

    // If customerID is provided (user is logged in), use that
    // Otherwise, check if customer exists or create a new one
    let customerId = customerID;
    
    if (!customerId) {
      const customer = await prisma.customer.create({
        data: {
          firstName: resName,
          lastName: '',
          CustomerEmail: '',
          password: '',
          cusCreatedAt: new Date()
        }
      });
      
      customerId = customer.customerID;
    }

    // Create the reservation with parsed date and time
    const newReservation = await prisma.reservations.create({
      data: {
        resName: resName,
        resDate: parsedDate,
        resTime: timeString,
        numberOfPeople: parseInt(numberOfPeople.toString()),
        resStatus: status || 'pending',
        resCreatedAt: new Date(),
        Customer_customerID: customerId,
        Tables_tabID: parseInt(tableNumber.toString()),
        resPhone: phoneNumber.toString(),
      }
    });

    // ดึงข้อมูลโต๊ะเพื่อตรวจสอบประเภท
    const tableInfo = await prisma.tables.findUnique({
      where: {
        tabID: parseInt(tableNumber.toString())
      }
    });

    // สร้างชื่อโต๊ะที่เหมาะสม
    let tableName = `โต๊ะ ${tableNumber}`;
    if (tableInfo && tableInfo.tabTypes === 'VIP') {
      tableName = 'ห้อง VIP';
    }

    return NextResponse.json({ 
      success: true, 
      message: 'จองโต๊ะเรียบร้อยแล้ว', 
      reservationId: newReservation.resID,
      tableName: tableName
    });
    
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการสร้างการจอง' }, { status: 500 });
  }
}