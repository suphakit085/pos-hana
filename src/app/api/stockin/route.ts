// src/app/api/stockin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createStockInWithDetails } from "@/actions/actions";
import { fetchStockIn } from "@/actions/actions";

// ใน src/app/api/stockin/route.ts ให้เพิ่ม log เพื่อตรวจสอบข้อมูลที่รับเข้ามา
export async function POST(request: NextRequest) {
    try {
      const formData = await request.formData();
      
      // log formData entries เพื่อตรวจสอบ
      console.log("API route received form data:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value.toString().substring(0, 100)}${value.toString().length > 100 ? '...' : ''}`);
      }
      
      // เรียกใช้ server action เพื่อสร้างการนำเข้าสินค้าพร้อมรายละเอียด
      const result = await createStockInWithDetails(formData);
      
      return NextResponse.json({ 
        success: true, 
        message: "บันทึกการนำเข้าสินค้าเรียบร้อยแล้ว",
        data: result 
      });
    } catch (error) {
      console.error("Error creating stock in:", error);
      
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล" 
      }, { status: 500 });
    }
  }




export async function GET() {
  try {
    // ฟังก์ชันนี้ควรนำเข้าจากไฟล์ actions ของคุณ
    const result = await fetchStockIn();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching stock in:", error);
    return NextResponse.json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล" 
    }, { status: 500 });
  }
}