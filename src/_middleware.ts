// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// กำหนดรายชื่อเส้นทางที่ต้องการป้องกัน
const PROTECTED_ROUTES = ['/superadmin', '/superadmin/dashboard', '/superadmin/sales'];

// กำหนดรหัสเจ้าของร้าน (ในระบบจริงควรใช้ระบบ auth ที่มีความปลอดภัยมากกว่านี้)
const OWNER_ID = '1'; // รหัส ID ของเจ้าของร้าน

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ตรวจสอบว่า path ปัจจุบันอยู่ในรายการที่ต้องการป้องกันหรือไม่
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // ตรวจสอบว่ามี cookie หรือ session ที่เป็นของเจ้าของร้านหรือไม่
    const userRole = request.cookies.get('userRole')?.value;
    const userId = request.cookies.get('userId')?.value;
    
    // ถ้าไม่ใช่เจ้าของร้าน ให้ redirect ไปหน้า login หรือหน้า access denied
    if (userRole !== 'superadmin' || userId !== OWNER_ID) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }
  
  return NextResponse.next();
}

// ระบุเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  matcher: ['/superadmin/:path*']
};