"use client";
import React, { useState, useRef, useEffect } from "react";
import TableClick from "@/components/TableClick";

interface CardTableProps {
  tableId?: string;
  tableStatus?: string;
  customerCount?: number; // เพิ่มพารามิเตอร์จำนวนลูกค้า
}

function CardTable({ 
  tableId = "T01", 
  tableStatus = "ว่าง", 
  customerCount = 0 // กำหนดค่าเริ่มต้นเป็น 0
}: CardTableProps) {
    const [showTableClick, setShowTableClick] = useState<boolean>(false);
    const cardTableRef = useRef<HTMLDivElement | null>(null);
  
    // ตรวจสอบการคลิกภายนอก
    const handleClickOutside = (event: MouseEvent) => {
      if (cardTableRef.current && !cardTableRef.current.contains(event.target as Node)) {
        setShowTableClick(false);
      }
    };
  
    // เพิ่ม event listener เมื่อ component ถูก mount
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
    // กำหนดสีของแถบด้านซ้ายตามสถานะโต๊ะ
    const getStatusColor = (): string => {
      switch (tableStatus) {
        case "จอง":
          return "bg-[#F8E71D]"; // สีเหลือง
        case "มีลูกค้า":
          return "bg-[#4990E2]"; // สีฟ้า
        default:
          return "bg-[#B9E986]"; // สีเดิม (เขียว)
      }
    };
    
    // ปรับปรุงฟังก์ชัน getChairColor เพื่อพิจารณาทั้งสถานะโต๊ะและจำนวนลูกค้า
    const getChairColor = (chairNumber: number): string => {
      // ถ้าโต๊ะสถานะจอง และมีการจองที่นั่งนี้
      if (tableStatus === "จอง" && chairNumber <= customerCount) {
        return "bg-[#F8E71D]"; // สีเหลืองสำหรับเก้าอี้ที่จอง
      }
      // ถ้าโต๊ะสถานะมีลูกค้า และมีลูกค้านั่งที่นี่
      else if (tableStatus === "มีลูกค้า" && chairNumber <= customerCount) {
        return "bg-[#4990E2]"; // สีฟ้าสำหรับเก้าอี้ที่มีลูกค้านั่ง
      }
      // ถ้าไม่เข้าเงื่อนไขข้างต้น ใช้สีเก้าอี้ว่าง
      return "bg-[#DAE7F8]";
    };
  
    const shouldShowCustomerCount = (): boolean => {
      // แสดงเมื่อมีลูกค้า (customerCount > 0) หรือ เมื่อโต๊ะไม่ว่าง (จอง/มีลูกค้า)
      return customerCount > 0 || tableStatus === "มีลูกค้า" || tableStatus === "จอง";
    };

  return (
    <>
        <div ref={cardTableRef} className="relative">
        <div className="cursor-pointer" onClick={() => setShowTableClick(!showTableClick)}>
            <div className="mb-2 flex justify-between w-[150px] px-5">
                <div id="chair1" className={`w-[40px] h-[20px] ${getChairColor(1)} rounded-t-[100px] rounded-b-xl`}></div>
                <div id="chair2" className={`w-[40px] h-[20px] ${getChairColor(2)} rounded-t-[100px] rounded-b-xl`}></div>
            </div>

            <div className="w-[150px] h-[100px] rounded-xl flex drop-shadow-[1px_1px_2px_rgba(0,0,0,0.35)] bg-white">
                {/* เปลี่ยนสีของแถบด้านซ้ายตามสถานะโต๊ะ */}
                <div className={`w-[9px] h-full ${getStatusColor()} rounded-l-xl`}></div>
                <div className="flex-1 pl-3 py-1 flex flex-col justify-between">
                <p className="text-[#C8C8C8]">{tableId}</p>
                <div className="flex justify-between items-end pr-3">
                  <p>{tableStatus}</p>
                  {shouldShowCustomerCount() && (<p className="text-sm text-gray-500">{customerCount} คน</p>)}
                  </div>
                </div>
            </div>

            <div className="mt-2 flex justify-between w-[150px] px-5">
                <div id="chair3" className={`w-[40px] h-[20px] ${getChairColor(3)} rounded-t-xl rounded-b-[100px]`}></div>
                <div id="chair4" className={`w-[40px] h-[20px] ${getChairColor(4)} rounded-t-xl rounded-b-[100px]`}></div>
            </div>
            </div>
      {showTableClick && <TableClick 
        tableId={tableId} 
        tableStatus={tableStatus} 
        customerCount={customerCount}
        onClose={() => setShowTableClick(false)} 
      />}
    </div>
    </>
  )
}

export default CardTable