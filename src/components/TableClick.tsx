//components/TableClick.tsx
"use client";
import React, { useState } from "react";
import { TbHotelService, TbMoneybag } from "react-icons/tb";
import { HiOutlineQrCode } from "react-icons/hi2";
import { LuUserRoundPlus } from "react-icons/lu";
import { MdOutlineTableBar } from "react-icons/md";
import ModalReceiveCustomer from "@/components/ModalReceiveCustomer";
import { X } from "lucide-react";

interface TableClickProps {
  tableId: string;
  tableStatus: string;
  customerCount: number;
  tableType?: string; // เพิ่มฟิลด์ประเภทโต๊ะ
  onClose: () => void;
  onOrderCreated?: (newStatus: string, newCustomerCount: number) => void;
}

function TableClick({ tableId, tableStatus, customerCount, tableType = "normal", onClose, onOrderCreated }: TableClickProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string>('receive'); // เพิ่ม state เพื่อระบุประเภทของ Modal

  // เปิด Modal และระบุประเภท
  const handleOpenModal = (action: string) => {
    if (action === 'bill') {
      // นำทางไปยังหน้าเช็คบิล
      window.location.href = `/admin/tables/checkbill?tableId=${tableId}&customerCount=${customerCount}`;
      onClose(); // ปิด TableClick
      return;
    }
    
    if (action === 'qrcode') {
      // ดึง ID ของโต๊ะ (ตัดตัวอักษร T ออก)
      let cleanTableId = tableId;
      if (tableId.startsWith('T') || tableId.startsWith('t')) {
        cleanTableId = tableId.substring(1);
      }
      
      // ดึงข้อมูลออเดอร์ของโต๊ะนี้ก่อน เพื่อให้ได้ orderItemId
      fetch(`/api/orders?tableId=${cleanTableId}&status=active`)
        .then(response => {
          if (!response.ok) {
            throw new Error('ไม่พบออเดอร์ที่เปิดอยู่สำหรับโต๊ะนี้');
          }
          return response.json();
        })
        .then(data => {
          if (data && data.length > 0) {
            const latestOrder = data[0]; // ใช้ออเดอร์ล่าสุด
            // นำทางไปยังหน้า QR Code โดยใช้ orderItemId
            window.location.href = `/admin/qrcode/${latestOrder.orderItemId}`;
          } else {
            alert('ไม่พบออเดอร์ที่เปิดอยู่สำหรับโต๊ะนี้');
          }
        })
        .catch(error => {
          console.error('Error fetching order data:', error);
          alert('เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์: ' + error.message);
        })
        .finally(() => {
          onClose(); // ปิด TableClick
        });
      return;
    }
    
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  // ส่งต่อการอัปเดตสถานะโต๊ะไปยัง parent component
  const handleOrderCreated = (newStatus: string, newCustomerCount: number) => {
    console.log(`Order created: status=${newStatus}, customers=${newCustomerCount}`);
    if (onOrderCreated) {
      onOrderCreated(newStatus, newCustomerCount);
    }
    // ไม่ปิด Modal เพื่อให้สามารถแสดง QR Code ได้
  };

  // แสดงปุ่มตามสถานะโต๊ะ
  const showCustomerButton = tableStatus === "ว่าง" || tableStatus === "จอง";
  const showReserveButton = tableStatus === "ว่าง";
  const showQrCodeButton = tableStatus === "มีลูกค้า";
  const showBillButton = tableStatus === "มีลูกค้า";
  const showCloseTableButton = tableStatus === "มีลูกค้า"; // เพิ่มเงื่อนไขสำหรับปุ่มปิดโต๊ะ

  // เพิ่มฟังก์ชันสำหรับปิดออเดอร์และเปลี่ยนสถานะโต๊ะเป็น "ว่าง"
  const handleCloseTable = async () => {
    if (!confirm(`ต้องการปิดโต๊ะ ${tableId} และยกเลิกออเดอร์ทั้งหมดหรือไม่?`)) {
      return;
    }

    try {
      // ตัดตัวอักษร "T" ออกจาก tableId ถ้ามี
      let cleanTableId = tableId;
      if (tableId.startsWith('T') || tableId.startsWith('t')) {
        cleanTableId = tableId.substring(1);
      }
      
      // แปลง tableId เป็นตัวเลขก่อนส่งไปยัง API
      const numericTableId = parseInt(cleanTableId);
      
      if (isNaN(numericTableId)) {
        throw new Error(`รูปแบบ ID โต๊ะไม่ถูกต้อง: "${tableId}"`);
      }

      // 1. ปิดออเดอร์
      const closeOrderResponse = await fetch(`/api/orders/close`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: numericTableId
        }),
      });

      if (!closeOrderResponse.ok) {
        const errorData = await closeOrderResponse.json();
        console.error("ไม่สามารถปิดออเดอร์ได้:", closeOrderResponse.statusText, errorData);
        
        // ถ้าไม่พบออเดอร์ที่ยังไม่ปิด ให้ดำเนินการต่อ
        if (errorData.error !== "No active orders found for this table") {
          throw new Error(`ไม่สามารถปิดออเดอร์ได้: ${errorData.error || closeOrderResponse.statusText}`);
        }
      }

      // 2. อัพเดตสถานะโต๊ะเป็น "ว่าง"
      const updateTableResponse = await fetch(`/api/tables/${numericTableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ว่าง'
        }),
      });

      if (!updateTableResponse.ok) {
        const errorData = await updateTableResponse.json();
        console.error("ไม่สามารถอัพเดตสถานะโต๊ะได้:", updateTableResponse.statusText, errorData);
        throw new Error(`ไม่สามารถอัพเดตสถานะโต๊ะได้: ${errorData.error || updateTableResponse.statusText}`);
      }

      // อัพเดต UI
      if (onOrderCreated) {
        onOrderCreated("ว่าง", 0);
      }
      
      alert(`ปิดโต๊ะ ${tableId} สำเร็จ`);
      onClose();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการปิดโต๊ะ:", error);
      alert(`เกิดข้อผิดพลาดในการปิดโต๊ะ: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`);
    }
  };

  return (
    <>
      <div className="absolute top-16 left-20 z-40">
        <div className="w-[200px] h-auto rounded-xl flex flex-col drop-shadow-[1px_1px_2px_rgba(0,0,0,0.35)] bg-white">
          <div className="w-full h-[50px] flex justify-between items-center px-4 border-b">
            <div className="flex items-center">
              <h3 className="font-bold">
                {tableId}
                {tableType?.toUpperCase() === "VIP" && (
                  <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">VIP</span>
                )}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          {showCustomerButton && (
            <div
              className="flex justify-center items-center w-full h-[60px] border-b-[1px] border-[#CACACA] cursor-pointer hover:bg-gray-100"
              onClick={() => handleOpenModal('receive')}
            >
              <div className="w-[40%] h-full flex justify-end items-center">
                <LuUserRoundPlus className="text-2xl mr-2" />
              </div>
              <div className="pl-1 w-[60%] h-full flex justify-start items-center">
                <p className="text-xl">รับลูกค้า</p>
              </div>
            </div>
          )}

        

          {showQrCodeButton && (
            <div
              className="flex justify-center items-center w-full h-[60px] border-b-[1px] border-[#CACACA] cursor-pointer hover:bg-gray-100"
              onClick={() => handleOpenModal('qrcode')}
            >
              <div className="w-[40%] h-full flex justify-end items-center">
                <HiOutlineQrCode className="text-2xl mr-2" />
              </div>
              <div className="pl-1 w-[60%] h-full flex justify-start items-center">
                <p className="text-xl">QRCODE</p>
              </div>
            </div>
          )}

          {showBillButton && (
            <div
              className="flex justify-center items-center w-full h-[60px] cursor-pointer hover:bg-gray-100"
              onClick={() => handleOpenModal('bill')}
            >
              <div className="w-[40%] h-full flex justify-end items-center">
                <TbMoneybag className="text-2xl mr-2" />
              </div>
              <div className="pl-1 w-[60%] h-full flex justify-start items-center">
                <p className="text-xl">เช็คบิล</p>
              </div>
            </div>
          )}

          {showCloseTableButton && (
            <div
              className="flex justify-center items-center w-full h-[60px] cursor-pointer hover:bg-gray-100"
              onClick={handleCloseTable}
            >
              <div className="w-[40%] h-full flex justify-end items-center">
                <MdOutlineTableBar className="text-2xl text-red-500" />
              </div>
              <div className="w-[60%] h-full flex justify-start items-center pl-3">
                <p className="text-xl">ปิดโต๊ะ</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* แสดง Modal ตามประเภทที่เลือก */}
      {isModalOpen && modalAction === 'receive' && (
        <ModalReceiveCustomer
          tableId={tableId}
          tableStatus={tableStatus}
          customerCount={customerCount}
          onClose={() => {
            handleCloseModal();
            onClose(); // ปิด TableClick ด้วย
          }}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </>
  );
}

export default TableClick;