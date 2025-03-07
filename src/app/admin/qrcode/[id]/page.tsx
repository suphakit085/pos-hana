"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode } from 'lucide-react';
import { use } from 'react';

interface OrderData {
  orderID: number;
  orderItemId: string;
  Tables_tabID: number;
  tabName?: string;
}

export default function QRCodePage({ params }: { params: { id: string } }) {
  // ใช้ React.use สำหรับรุ่นใหม่ของ Next.js ที่ params เป็น Promise
  const id = use(params).id;
  
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        console.log("Fetching order data for ID:", id);
        const response = await fetch(`/api/orders/get?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Order data received:", data);
        setOrderData(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrderData();
    } else {
      setError("ไม่พบรหัสออเดอร์");
      setLoading(false);
    }
  }, [id]);

  // ฟังก์ชันสำหรับการพิมพ์
  const handlePrint = () => {
    window.print();
  };

  // ฟังก์ชันสำหรับการกลับไปหน้าโต๊ะ
  const handleGoBack = () => {
    router.push('/admin/tables'); // หรือเปลี่ยนตาม URL ที่ต้องการ
  };

  // แสดงสถานะกำลังโหลด
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB8DA] mx-auto"></div>
          <p className="mt-4 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // แสดงข้อผิดพลาด
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-[#FFB8DA] text-white rounded-md hover:bg-[#fcc6e0]"
          >
            กลับไปหน้าโต๊ะ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">QR Code สำหรับสั่งอาหาร</h1>
          <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900"
          >
            กลับไปหน้าโต๊ะ
          </button>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
            {orderData ? (
              <>
                <div className="flex justify-center mb-6">
                  <QrCode 
                    values={`http://localhost:3000/user/menu/${orderData.orderItemId}`} 
                    size={300} 
                  />
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700">โต๊ะ {orderData.tabName || `T${orderData.Tables_tabID}`}</h2>
                  <p className="text-gray-600 mt-1">รหัสออเดอร์: {orderData.orderID}</p>
                </div>
                <p className="text-gray-500 text-sm">สแกน QR Code เพื่อสั่งอาหาร</p>
              </>
            ) : (
              <p className="py-10 text-gray-500">ไม่พบข้อมูล QR Code</p>
            )}
          </div>
          
          {orderData && (
            <button
              onClick={handlePrint}
              className="w-full mt-6 bg-[#FFB8DA] text-white py-3 rounded-md hover:bg-[#fcc6e0] font-medium"
            >
              พิมพ์ QR Code
            </button>
          )}

          <div className="print:hidden mt-6">
            <p className="text-sm text-gray-500 text-center">
              คำแนะนำ: วาง QR Code นี้บนโต๊ะเพื่อให้ลูกค้าสแกนและสั่งอาหารได้สะดวก
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}