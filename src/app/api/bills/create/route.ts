import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, customerCount, totalAmount, paymentMethod, paymentStatus } = body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!tableId || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // เก็บเวลาปัจจุบันเป็นเวลาที่ชำระเงิน
    const paymentDateTime = new Date();
    
    // สร้างบิลใหม่
    const newBill = await prisma.bill.create({
      data: {
        totalAmount: totalAmount,
        vat: Math.round(totalAmount * 0.07), // คำนวณ VAT 7%
        netAmount: totalAmount * 0.93, // คำนวณยอดก่อน VAT
        grandTotal: totalAmount,
        billStatus: 'PAID',
        paymentStatus: paymentStatus || 'COMPLETED',
        order: {
          connect: {
            orderID: await findActiveOrderIdForTable(tableId)
          }
        },
        payment: {
          create: {
            paymentTypes: paymentMethod || 'cash',
            totalAmount: totalAmount,
            // ไม่ต้องระบุ paymentDatetime เพราะมีค่าเริ่มต้นเป็น @default(now()) ในโมเดล
          }
        }
      }
    });
    
    return NextResponse.json({
      message: "Bill created successfully",
      billId: newBill.billID,
      paymentDateTime: paymentDateTime // ส่งเวลาที่ชำระเงินกลับไปด้วย
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bill:", error);
    
    // ถ้าเกิดข้อผิดพลาดเกี่ยวกับการเชื่อมต่อกับออเดอร์
    if (error.message && error.message.includes('connect')) {
      return NextResponse.json({ 
        error: "Failed to connect bill with order. Make sure the table has an active order." 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create bill", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}

// ฟังก์ชันสำหรับค้นหา orderID ที่เกี่ยวข้องกับโต๊ะ
async function findActiveOrderIdForTable(tableId: number) {
  const order = await prisma.orders.findFirst({
    where: {
      Tables_tabID: tableId,
      orderStatus: { not: 'CLOSED' }
    },
    orderBy: {
      orderCreatedAt: 'desc'  // ใช้ orderCreatedAt ตาม schema
    }
  });
  
  if (!order) {
    throw new Error(`No active order found for table ${tableId}`);
  }
  
  return order.orderID;
} 