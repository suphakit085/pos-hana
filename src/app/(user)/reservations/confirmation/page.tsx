"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";

export default function ReservationConfirmation() {
  const router = useRouter();
  
  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-10">
        <UserDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <UserMobileNavbar />
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">จองโต๊ะเรียบร้อยแล้ว!</h1>
          <p className="text-gray-600 mb-6">
            ขอบคุณที่ใช้บริการจองโต๊ะกับเรา เราจะส่งข้อความยืนยันการจองไปที่เบอร์โทรศัพท์ของท่าน
          </p>
          
          <button
            onClick={() => router.push('/landing')}
            className="w-full py-3 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium transition-colors mb-3"
          >
            กลับสู่หน้าหลัก
          </button>

          <button
            onClick={() => router.push('/reshistory')}
            className="w-full py-3 bg-white border-2 border-[#FFB8DA] hover:bg-pink-50 text-[#FFB8DA] rounded-lg font-medium transition-colors"
          >
            ดูประวัติการจอง
          </button>
        </div>
      </div>
    </>
  );
}