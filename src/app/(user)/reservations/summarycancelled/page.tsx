"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";

export default function ReservationSummaryCancelled() {
  const router = useRouter();
  
  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-10">
        <UserDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <UserMobileNavbar />
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-red-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">รายละเอียดการจองที่ยกเลิก</h1>
          
          <div className="text-left mb-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลการจอง</h2>
              <p className="text-gray-600">รหัสการจอง: <span className="font-medium">#123456</span></p>
              <p className="text-gray-600">วันที่จอง: <span className="font-medium">12/03/2024</span></p>
              <p className="text-gray-600">เวลา: <span className="font-medium">18:00</span></p>
              <p className="text-red-600">สถานะ: <span className="font-medium">ยกเลิกแล้ว</span></p>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลโต๊ะ</h2>
              <p className="text-gray-600">โต๊ะ: <span className="font-medium">โต๊ะ 1</span></p>
              <p className="text-gray-600">จำนวนที่นั่ง: <span className="font-medium">4</span></p>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลผู้จอง</h2>
              <p className="text-gray-600">ชื่อ: <span className="font-medium">สมชาย ใจดี</span></p>
              <p className="text-gray-600">เบอร์โทร: <span className="font-medium">0812345678</span></p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/landing')}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              กลับสู่หน้าหลัก
            </button>
            <button
              onClick={() => {/* Add save as image functionality */}}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              บันทึกเป็นรูปภาพ
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 