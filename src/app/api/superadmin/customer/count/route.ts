// src/app/api/superadmin/customer/count/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // ดึงข้อมูลจำนวนลูกค้าจาก totalCustomerCount ในตาราง Orders รวมทั้งที่ปิดบิลไปแล้ว
    const customerCountData = await prisma.orders.aggregate({
      _sum: {
        totalCustomerCount: true,
      },
      where: {
        orderStatus: {
          notIn: ['CANCELLED'] // ไม่นับเฉพาะออเดอร์ที่ถูกยกเลิก
        },
        isDeleted: false,
      },
    });
    
    let customerCount = customerCountData._sum.totalCustomerCount || 0;
    console.log("Customer count from totalCustomerCount (including closed orders):", customerCount);
    
    // ถ้าไม่พบข้อมูล ให้ลองวิธีอื่น
    if (customerCount === 0) {
      // ลองนับจากจำนวนบิลที่ชำระเงินแล้ว
      try {
        const paidBills = await prisma.bill.findMany({
          where: {
            billStatus: 'PAID'
          },
          select: {
            order: {
              select: {
                totalCustomerCount: true
              }
            }
          }