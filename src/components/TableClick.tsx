//components/TableClick.tsx
"use client";
import React, { useState } from "react";
import { TbHotelService, TbMoneybag } from "react-icons/tb";
import { HiOutlineQrCode } from "react-icons/hi2";
import { LuUserRoundPlus } from "react-icons/lu";
import ModalReceiveCustomer from "@/components/ModalReceiveCustomer";

interface TableClickProps {
  tableId: string;
  tableStatus: string;
  customerCount: number;
  onClose: () => void;
  onOrderCreated?: (newStatus: string, newCustomerCount: number) => void;
}

function TableClick({ tableId, tableStatus, customerCount, onClose, onOrderCreated }: TableClickProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string>('receive'); // เพิ่ม state เพื่อระบุประเภทของ Modal

  // เปิด Modal และระบุประเภท
  const handleOpenModal = (action: string) => {
    console.log(`Opening modal for action: ${action}`);
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

  return (
    <>
      <div className="absolute top-16 left-20 z-40">
        <div className="w-[200px] h-auto rounded-xl flex flex-col drop-shadow-[1px_1px_2px_rgba(0,0,0,0.35)] bg-white">
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

          {showReserveButton && (
            <div
              className="flex justify-center items-center w-full h-[60px] border-b-[1px] border-[#CACACA] cursor-pointer hover:bg-gray-100"
              onClick={() => handleOpenModal('reserve')}
            >
              <div className="w-[40%] h-full flex justify-end items-center">
                <TbHotelService className="text-2xl mr-2" />
              </div>
              <div className="pl-1 w-[60%] h-full flex justify-start items-center">
                <p className="text-xl">จองโต๊ะ</p>
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
      
      {/* เตรียมพร้อมสำหรับ Modal อื่นๆ ในอนาคต */}
      {/* {isModalOpen && modalAction === 'reserve' && (...)} */}
      {/* {isModalOpen && modalAction === 'qrcode' && (...)} */}
      {/* {isModalOpen && modalAction === 'bill' && (...)} */}
    </>
  );
}

export default TableClick;