// src/app/api/superadmin/sales/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const branch = url.searchParams.get('branch') || 'all';
    
    // ข้อมูลค่าใช้จ่ายค่าอาหาร (จากตาราง Bill หรือ Orders)
    let totalSales = 0;
    let totalCosts = 0;
    let totalProfit = 0;
    
    // ดึงข้อมูลจากตาราง Bill สำหรับยอดขายรวม
    const billsQuery = {
      where: {
        billStatus: 'PAID',
        ...(branch !== 'all' && {
          order: {
            // สามารถเพิ่มเงื่อนไขสาขาตรงนี้ เช่น ถ้ามีฟิลด์ branch ใน Orders
            // branch: branch
          }
        })
      },
      select: {
        totalAmount: true,
        netAmount: true,
        vat: true,
      },
    };
    
    const bills = await prisma.bill.findMany(billsQuery);
    
    // คำนวณยอดขายรวม
    totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    
    // คำนวณต้นทุน (ในกรณีที่มีข้อมูลต้นทุนในระบบ)
    // ในกรณีที่ไม่มีข้อมูลจริง เราจะสมมติว่าต้นทุนประมาณ 35% ของยอดขาย
    totalCosts = totalSales * 0.36;
    
    // คำนวณกำไร
    totalProfit = totalSales - totalCosts;
    
    return NextResponse.json({
      totalSales,
      totalCosts,
      totalProfit
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}