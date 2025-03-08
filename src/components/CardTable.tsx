"use client";
import React, { useState, useRef, useEffect } from "react";
import TableClick from "@/components/TableClick";

interface CardTableProps {
  tableId?: string;
  tableStatus?: string;
  customerCount?: number;
  tableType?: string;
  onTableStatusChange: (tableId: string, newStatus: string, newCustomerCount?: number) => void;
}

function CardTable({ 
  tableId = "T01", 
  tableStatus = "ว่าง", 
  customerCount = 0,
  tableType = "normal",
  onTableStatusChange
}: CardTableProps) {
    const [localTableStatus, setLocalTableStatus] = useState(tableStatus);
    const [localCustomerCount, setLocalCustomerCount] = useState(customerCount);
    const [showTableClick, setShowTableClick] = useState<boolean>(false);
    const cardTableRef = useRef<HTMLDivElement | null>(null);
  
    // อัปเดตสถานะจาก props
    useEffect(() => {
      setLocalTableStatus(tableStatus);
      setLocalCustomerCount(customerCount);
    }, [tableStatus, customerCount]);
  
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
      switch (localTableStatus) {
        case "จอง":
          return "bg-[#F8E71D]"; // สีเหลือง
        case "มีลูกค้า":
          return "bg-[#4990E2]"; // สีฟ้า
        case "ว่าง":
        default:
          return "bg-[#7ED321]"; // สีเขียว
      }
    };
    
    // กำหนดสีพื้นหลังของโต๊ะตามประเภทโต๊ะ
    const getTableBackground = (): string => {
      if (tableType.toUpperCase() === "VIP") {
        return "bg-gradient-to-r from-purple-100 to-white"; // สีพิเศษสำหรับโต๊ะ VIP
      }
      return "bg-white"; // สีปกติสำหรับโต๊ะทั่วไป
    };
    
    // ปรับปรุงฟังก์ชัน getChairColor เพื่อพิจารณาทั้งสถานะโต๊ะและจำนวนลูกค้า
    const getChairColor = (chairNumber: number): string => {
      // ถ้าโต๊ะสถานะจอง และมีการจองที่นั่งนี้
      if (localTableStatus === "จอง" && chairNumber <= localCustomerCount) {
        return "bg-[#F8E71D]"; // สีเหลืองสำหรับเก้าอี้ที่จอง
      }
      // ถ้าโต๊ะสถานะมีลูกค้า และมีลูกค้านั่งที่นี่
      else if (localTableStatus === "มีลูกค้า" && chairNumber <= localCustomerCount) {
        return "bg-[#4990E2]"; // สีฟ้าสำหรับเก้าอี้ที่มีลูกค้านั่ง
      }
      // ถ้าไม่เข้าเงื่อนไขข้างต้น ใช้สีเก้าอี้ว่าง
      return "bg-[#DAE7F8]";
    };
  
    const shouldShowCustomerCount = (): boolean => {
      // แสดงเมื่อมีลูกค้า (localCustomerCount > 0) หรือ เมื่อโต๊ะไม่ว่าง (จอง/มีลูกค้า)
      return localCustomerCount > 0 || localTableStatus === "มีลูกค้า" || localTableStatus === "จอง";
    };

    // เพิ่มฟังก์ชันอัพเดทสถานะโต๊ะ
    const updateTableStatus = (newStatus: string, newCustomerCount: number) => {
      setLocalTableStatus(newStatus);
      setLocalCustomerCount(newCustomerCount);
      onTableStatusChange(tableId, newStatus, newCustomerCount);
      setShowTableClick(false);
    };
  

  return (
    <>
      <div ref={cardTableRef} className="relative">
        <div className="cursor-pointer" onClick={() => setShowTableClick(!showTableClick)}>
          <div className="mb-2 flex justify-between w-[150px] px-5">
            <div id="chair1" className={`w-[40px] h-[20px] ${getChairColor(1)} rounded-t-[100px] rounded-b-xl`}></div>
            <div id="chair2" className={`w-[40px] h-[20px] ${getChairColor(2)} rounded-t-[100px] rounded-b-xl`}></div>
          </div>

          <div className={`w-[150px] h-[100px] rounded-xl flex drop-shadow-[1px_1px_2px_rgba(0,0,0,0.35)] ${getTableBackground()}`}>
            {/* เปลี่ยนสีของแถบด้านซ้ายตามสถานะโต๊ะ */}
            <div className={`w-[9px] h-full ${getStatusColor()} rounded-l-xl`}></div>
            <div className="flex-1 pl-3 py-1 flex flex-col justify-between">
              <div className="flex justify-between pr-3">
                <p className="text-[#C8C8C8]">{tableId}</p>
                {tableType.toUpperCase() === "VIP" && (
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">VIP</span>
                )}
              </div>
              <div className="flex justify-between items-end pr-3">
                <p>{localTableStatus}</p>
                {shouldShowCustomerCount() && (<p className="text-sm text-gray-500">{localCustomerCount} คน</p>)}
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-between w-[150px] px-5">
            <div id="chair3" className={`w-[40px] h-[20px] ${getChairColor(3)} rounded-t-xl rounded-b-[100px]`}></div>
            <div id="chair4" className={`w-[40px] h-[20px] ${getChairColor(4)} rounded-t-xl rounded-b-[100px]`}></div>
          </div>
        </div>
        
        {/* แสดง TableClick เมื่อคลิกที่โต๊ะ */}
        {showTableClick && (
          <TableClick 
            tableId={tableId} 
            tableStatus={localTableStatus} 
            customerCount={localCustomerCount}
            onClose={() => setShowTableClick(false)}
            onOrderCreated={(newStatus, newCustomerCount) => updateTableStatus(newStatus, newCustomerCount)}
          />
        )}
      </div>
    </>
  );
}

export default CardTable;