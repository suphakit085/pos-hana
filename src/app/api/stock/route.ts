import { NextRequest, NextResponse } from "next/server";
import { fetchStock } from "../../../actions/actions";

export async function GET(request: NextRequest) {
  // รับพารามิเตอร์การค้นหาจาก URL
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get('search') || '';

  // ส่งค่าการค้นหาไปยังฟังก์ชัน fetchStock
  const stock = await fetchStock(searchTerm);

  return NextResponse.json(stock);
}