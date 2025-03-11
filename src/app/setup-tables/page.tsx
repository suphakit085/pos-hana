"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupTables() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('กำลังโหลด...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const setupTables = async () => {
      try {
        setStatus('กำลังตั้งค่าโต๊ะ...');
        const response = await fetch('/api/tables/setup');
        
        if (!response.ok) {
          throw new Error('เกิดข้อผิดพลาดในการตั้งค่าโต๊ะ');
        }
        
        const data = await response.json();
        setStatus(`${data.message} (จำนวนโต๊ะทั้งหมด: ${data.tableCount} โต๊ะ)`);
        setSuccess(true);
      } catch (error) {
        console.error('Error setting up tables:', error);
        setError('เกิดข้อผิดพลาดในการตั้งค่าโต๊ะ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    
    setupTables();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ตั้งค่าโต๊ะอัตโนมัติ</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-[#FFB8DA] border-r-[#FFB8DA] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">{status}</p>
          </div>
        ) : error ? (
          <div className="text-red-500 mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600">{status}</p>
          </div>
        )}
        
        <button
          onClick={() => router.push('/landing')}
          className="w-full py-3 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium transition-colors"
          disabled={isLoading}
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
} 