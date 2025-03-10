// src/app/access-denied/page.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-gray-700 mb-6">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เฉพาะเจ้าของร้านเท่านั้นที่สามารถเข้าถึงได้
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/admin/tables">
            <Button variant="outline">กลับสู่หน้า Admin</Button>
          </Link>
          <Link href="/">
            <Button className="bg-[#FFB8DA] hover:bg-[#fcc6e0]">เข้าสู่ระบบใหม่</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}