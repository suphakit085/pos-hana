import { NextRequest, NextResponse } from 'next/server';

/**
 * API route สำหรับสร้างรูปภาพ placeholder ตามขนาดที่กำหนด
 * ใช้สำหรับแสดงรูปภาพชั่วคราวในกรณีที่ยังไม่มีรูปภาพจริง
 * 
 * @param req - NextRequest object
 * @param params - พารามิเตอร์ width และ height จาก URL
 * @returns NextResponse object ที่มี Content-Type เป็น image/svg+xml
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const width = parseInt(params.width, 10) || 300;
  const height = parseInt(params.height, 10) || 200;
  
  // สร้าง SVG placeholder ง่ายๆ
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#888">
        ${width} x ${height}
      </text>
      <text x="50%" y="65%" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#888">
        Placeholder Image
      </text>
    </svg>
  `;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 