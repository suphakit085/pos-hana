"use client";
import React, { useState } from "react";
import { TbHotelService, TbMoneybag } from "react-icons/tb";
import { HiOutlineQrCode } from "react-icons/hi2";
import { LuUserRoundPlus } from "react-icons/lu";
import ModalReceiveCustomer from "@/components/ModalReceiveCustomer"
interface TableClickProps {
  tableId: string;
  tableStatus: string;
  customerCount: number;
  onClose: () => void;
}

function TableClick({ tableId, tableStatus, customerCount, onClose }: TableClickProps) {


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /*
  // สร้างฟังก์ชันสำหรับการจัดการการคลิกแต่ละปุ่ม
  const handleReceiveCustomer = (): void => {
    console.log(`รับลูกค้าที่โต๊ะ ${tableId}`);
    // เพิ่มโค้ดสำหรับรับลูกค้าที่โต๊ะ tableId
    onClose();
  };

  const handleReserveTable = (): void => {
    console.log(`จองโต๊ะ ${tableId}`);
    // เพิ่มโค้ดสำหรับจองโต๊ะ tableId
    onClose();
  };

  const handleQRCode = (): void => {
    console.log(`สร้าง QR Code สำหรับโต๊ะ ${tableId}`);
    // เพิ่มโค้ดสำหรับสร้าง QR Code สำหรับโต๊ะ tableId
    onClose();
  };

  const handleCheckBill = (): void => {
    console.log(`เช็คบิลที่โต๊ะ ${tableId}`);
    // เพิ่มโค้ดสำหรับเช็คบิลที่โต๊ะ tableId
    onClose();
  };
*/


  const [activeTab, setActiveTab] = useState<string>('customer');

  const showCustomerButton = tableStatus === "ว่าง" || tableStatus === "จอง";
      const showReserveButton = tableStatus === "ว่าง";
      const showQrCodeButton = tableStatus === "มีลูกค้า";
      const showBillButton = tableStatus === "มีลูกค้า";


  return (
    <>
      <div className="absolute top-16 left-20 z-50">
        <div className="w-[200px] h-auto rounded-xl flex flex-col drop-shadow-[1px_1px_2px_rgba(0,0,0,0.35)] bg-white">


          {showCustomerButton && (
          <div
            className="flex justify-center items-center w-full h-[60px] border-b-[1px] border-[#CACACA] cursor-pointer hover:bg-gray-100"
            onClick={handleOpenModal}
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
            onClick={handleOpenModal}
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
            onClick={handleOpenModal}
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
            onClick={handleOpenModal}
          >
            <div className="w-[40%] h-full flex justify-end items-center">
              <TbMoneybag className="text-2xl mr-2" />
            </div>

            <div className="pl-1 w-[60%] h-full flex justify-start items-center">
              <p className="text-xl">เช็คบิล</p>
            </div>
          </div>
          )}



          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <ModalReceiveCustomer
                tableId={tableId}
                tableStatus={tableStatus}
                customerCount={customerCount}
                onClose={handleCloseModal}
              />
            </div>
          )}
          {/* {isModalOpen2 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <ModalAddIngre closemodal={handleCloseModal2} />
            </div>
          )}
          {isModalOpen2 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <ModalAddIngre closemodal={handleCloseModal3} />
            </div>
          )}
          {isModalOpen2 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <ModalAddIngre closemodal={handleCloseModal4} />
            </div>
          )} */}
        </div>
      </div>
    </>
  )
}
export default TableClick