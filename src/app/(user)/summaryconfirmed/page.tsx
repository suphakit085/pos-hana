"use client";
import UserDesktopNavbar from "@/components/UserDesktopNavbar"
import UserMobileNavbar from "@/components/UserMobileNavbar";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BookingInfo {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  peopleCount: number;
  table: number | string;
}

function SummaryPage() {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get reservation data from URL query parameters
    const reservationDataParam = searchParams.get('reservationData');
    
    if (reservationDataParam) {
      try {
        const parsedData = JSON.parse(reservationDataParam);
        setBookingInfo({
          id: parsedData.id,
          name: parsedData.name,
          phone: parsedData.phone,
          date: parsedData.date,
          time: parsedData.time,
          peopleCount: parsedData.peopleCount,
          table: parsedData.table
        });
      } catch (error) {
        console.error('Error parsing reservation data:', error);
        // Use default data if parsing fails
        setBookingInfo({
          id: 1,
          name: "ลูกค้า",
          phone: "0812345678",
          date: "2025-03-05",
          time: "18:00",
          peopleCount: 2,
          table: "14"
        });
      }
    } else {
      // Use default data if no query parameter is provided
      setBookingInfo({
        id: 1,
        name: "ลูกค้า",
        phone: "0812345678",
        date: "2025-03-05",
        time: "18:00",
        peopleCount: 2,
        table: "14"
      });
    }
  }, [searchParams]);

  if (!bookingInfo) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
  }

  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0">
        <UserDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <UserMobileNavbar />
      </div>

      <div className=" min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center justify-center "  >
        <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
          <div className="p-6 bg-white rounded-t-lg">
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mb-4">
                <FaCheck className="w-8 h-8 text-green-900" />
              </div>
              <h2 className="text-2xl font-bold text-[#4D4D4D] mb-2">การจองนี้ได้รับการยืนยันแล้ว</h2>
              <p className="text-gray-500 max-w-xs">
                การจองนี้ได้รับการยืนยันจากทางร้านแล้ว
              </p>
              <p className="text-gray-500 max-w-xs">
                กรุณาแสดงรายละเอียดนี้เมื่อมาถึงร้าน ขอบคุณที่ใช้บริการ
              </p>
            </div>

            <Separator className="my-6 bg-gray-100" />

            <div className="grid grid-cols-2 gap-y-4 mb-6">
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">ชื่อ :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.name}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">วันที่ :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.date}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">โต๊ะที่ :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.table}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">เบอร์โทร :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.phone}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">เวลา :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.time}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-500 text-sm">จำนวนคน :</p>
                <p className="font-medium text-[#4D4D4D]">{bookingInfo.peopleCount} คน</p>
              </div>
            </div>
          </div>

          <div className="flex border-t border-gray-100">
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-6 text-[#4D4D4D] hover:bg-gray-50 hover:text-[#4D4D4D] font-medium"
              onClick={() => router.push('/reservation')}
            >
              กลับไปหน้าจอง
            </Button>
            <Separator orientation="vertical" className="bg-gray-100" />
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-6 text-[#4D4D4D] hover:bg-[#FFB8DA]/5 hover:text-[#FFB8DA] font-medium"
              onClick={() => router.push('/reshistory')}
            >
              ประวัติการจอง
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
export default SummaryPage
