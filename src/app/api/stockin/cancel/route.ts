import { NextRequest, NextResponse } from "next/server";
import { cancelStockIn } from "@/actions/actions";

export async function POST(request: NextRequest) {
  try {
    // แยก try-catch ในการอ่าน request body
    let stockInID, canceledByEmpID, cancelNote;
    
    try {
      const body = await request.json();
      stockInID = body.stockInID;
      canceledByEmpID = body.canceledByEmpID;
      cancelNote = body.cancelNote;
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ไม่สามารถอ่านข้อมูลคำขอได้" 
        }, 
        { status: 400 }
      );
    }
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!stockInID || !canceledByEmpID || !cancelNote) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ข้อมูลไม่ครบถ้วน กรุณาระบุ stockInID, canceledByEmpID และ cancelNote" 
        }, 
        { status: 400 }
      );
    }

    try {
      // เรียกใช้ function ที่มีอยู่ใน actions.ts
      const result = await cancelStockIn(
        parseInt(stockInID), 
        parseInt(canceledByEmpID), 
        cancelNote
      );
      
      return NextResponse.json({ 
        success: true, 
        message: "ยกเลิกการนำเข้าสินค้าเรียบร้อยแล้ว",
        data: result 
      });
    } catch (actionError) {
      // ถ้ามีข้อผิดพลาดจาก cancelStockIn
      console.error("Error in cancelStockIn function:", 
        actionError instanceof Error ? actionError.message : "Unknown error");
      
      return NextResponse.json(
        { 
          success: false, 
          message: actionError instanceof Error 
            ? actionError.message 
            : "เกิดข้อผิดพลาดในการยกเลิกการนำเข้า" 
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    // จัดการกับข้อผิดพลาดทั่วไป
    console.error("General error in API route:", 
      error instanceof Error ? error.message : "Unknown error");
      
    return NextResponse.json(
      { 
        success: false, 
        message: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" 
      }, 
      { status: 500 }
    );
  }
}