import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // รับ ID จาก query parameter
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    console.log("Fetching order with ID:", id);
    
    let order;
    
    // ตรวจสอบว่าเป็น UUID หรือตัวเลข
    if (id.includes("-")) {
      // ค้นหาด้วย orderItemId (UUID)
      order = await prisma.orders.findFirst({
        where: { orderItemId: id },
        include: {
          table: true,
          employee: true,
          buffetType: true
        }
      });
    } else {
      // ค้นหาด้วย orderID (ตัวเลข)
      const orderID = parseInt(id);
      if (isNaN(orderID)) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }
      
      order = await prisma.orders.findUnique({
        where: { orderID: orderID },
        include: {
          table: true,
          employee: true,
          buffetType: true
        }
      });
    }
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    // ตรวจสอบสถานะออเดอร์ว่าเป็น "CLOSED" หรือไม่
    if (order.orderStatus === "CLOSED") {
      return NextResponse.json({ 
        error: "Order is closed", 
        message: "ออเดอร์นี้ถูกปิดแล้ว ไม่สามารถสั่งอาหารได้",
        orderStatus: "CLOSED"
      }, { status: 403 });
    }
    
    // ปรับรูปแบบข้อมูลที่จะส่งกลับ
    const formattedOrder = {
      orderID: order.orderID,
      orderItemId: order.orderItemId,
      orderStatus: order.orderStatus,
      totalCustomerCount: order.totalCustomerCount,
      Tables_tabID: order.Tables_tabID,
      tabName: order.table ? `${order.table.tabTypes || 'T'}${order.Tables_tabID}` : `T${order.Tables_tabID}`,
      buffetType: order.buffetType ? {
        id: order.buffetType.buffetTypeID,
        name: order.buffetType.buffetTypesName,
        price: order.buffetType.buffetTypePrice
      } : null,
      employee: order.employee ? {
        id: order.employee.empID,
        name: `${order.employee.empFname} ${order.employee.empLname}`,
        position: order.employee.position
      } : null,
      createdAt: order.orderCreatedAt
    };
    
    return NextResponse.json(formattedOrder);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}