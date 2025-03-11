import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// กำหนดรายชื่อเส้นทางที่ต้องการป้องกัน
const SUPERADMIN_ROUTES = ['/superadmin', '/superadmin/dashboard', '/superadmin/sales'];
const ADMIN_ROUTES = ['/admin', '/admin/tables', '/admin/stock'];
const RESERVATION_ROUTES = ['/reservations', '/reshistory'];

// สิทธิ์การเข้าถึง
type UserRole = 'superadmin' | 'admin' | 'user';

// ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึง
function hasAccess(userRole: UserRole | undefined, path: string): boolean {
  // ถ้าไม่มี role ไม่มีสิทธิ์เข้าถึงเลย
  if (!userRole) return false;
  
  // superadmin สามารถเข้าถึงได้ทั้ง admin และ superadmin routes
  if (userRole === 'superadmin') return true;
  
  // admin สามารถเข้าถึงได้เฉพาะ admin routes
  if (userRole === 'admin'){
    return !SUPERADMIN_ROUTES.some(route => path.startsWith(route));
  }
  
  // user สามารถเข้าถึงเฉพาะ reservation routes
  if (userRole === 'user') {
    return RESERVATION_ROUTES.some(route => path.startsWith(route));
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ตรวจสอบว่า path ปัจจุบันเป็น protected route หรือไม่
  const isProtectedRoute = 
    SUPERADMIN_ROUTES.some(route => pathname.startsWith(route)) || 
    ADMIN_ROUTES.some(route => pathname.startsWith(route)) ||
    RESERVATION_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // ดึงค่า role และ userId จาก cookies
    const userRole = request.cookies.get('userRole')?.value as UserRole | undefined;
    const userId = request.cookies.get('userId')?.value;
    
    // ตรวจสอบว่ามีสิทธิ์เข้าถึงเส้นทางนี้หรือไม่
    if (!hasAccess(userRole, pathname) || !userId) {
      // ถ้าเป็น reservation routes และไม่ได้ล็อกอิน ให้ redirect ไปหน้าล็อกอิน
      if (RESERVATION_ROUTES.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/user-login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // สำหรับ admin และ superadmin routes ให้ redirect ไปหน้า access-denied
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }
  
  return NextResponse.next();
}

// ระบุเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  matcher: [
    '/superadmin/:path*', 
    '/admin/:path*',
    '/reservations/:path*',
    '/reshistory/:path*'
  ]
};