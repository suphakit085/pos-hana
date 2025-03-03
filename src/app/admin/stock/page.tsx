"use client"
import Admintemplate from "@/components/Admintemplate"
import { Button } from "@/components/ui/button"
import { RiAddLargeLine, RiSearchLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { useState } from 'react';
import ModalAddProduct from "@/components/ModalAddProduct";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ModalAddIngre from "@/components/ModalAddIngre";

 
const products = [
  {
    id:"1",
    name: "เนื้อออสเตรเลีย",
    remaining: "70",
    unit: "KG",
    min: "70",
    status: "ปกติ",
    dateupdate: "20-11-2025 18:00",
  },
  {
    id:"2",
    name: "เนื้อไก่",
    remaining: "50",
    unit: "KG",
    min: "20",
    status: "เหลือน้อย",
    dateupdate: "20-11-2025 18:00",
  },
]

function getStatusClass(status: string) {
  switch (status) {
    case "ปกติ":
      return "bg-green-200";
    case "เหลือน้อย":
      return "bg-red-200";
    default:
      return "";
  }
}

function Stockpage() {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };


  return (
    <>
    <Admintemplate>
    <div className='size-full p-10  flex items-center justify-center '>
      <div className='bg-white size-full  rounded-3xl'>
      
        <div className=" mt-5 w-full h-[100px] flex flex-col justify-center  px-6 sm:flex-row sm:h-[70px] sm:items-center sm:justify-between">
          <p className="text-3xl">คลังสินค้า</p>
          <div className="flex">
            <Button className="mr-2 bg-[#FFB8DA] hover:bg-[#fcc6e0]"  onClick={handleOpenModal}><RiAddLargeLine/> เพิ่มสินค้าใหม่</Button>
            <Button className="py-2 px-4 mr-2 rounded bg-[#FFB8DA] hover:bg-[#fcc6e0]" onClick={handleOpenModal2}><RiAddLargeLine/> เพิ่มวัตถุดิบใหม่</Button>            
            <Button variant="outline"><LuRefreshCw /> รีเฟรช</Button>
          </div>
        </div>
        
        <div className="w-full h-[70px]  flex items-center justify-center">
          <div className="relative w-full px-6  flex items-center justify-center">
                  <input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] w-full"
                  />
                  <RiSearchLine className="absolute left-9 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
        </div>
        
        <div className="mt-2 w-full px-6">
          <div className="border rounded-md  min-w-[950px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">รหัสสินค้า</TableHead>
                  <TableHead className="w-[150px] md:w-[200px]">ชื่อสินค้า</TableHead>
                  <TableHead className="w-[100px] text-right">คงเหลือ</TableHead>
                  <TableHead className="w-[75px] text-right">หน่วย</TableHead>
                  <TableHead className="w-[75px] text-right">ขั้นต่ำ</TableHead>
                  <TableHead className="w-[150px] text-center">สถานะ</TableHead>
                  <TableHead className="w-[150px] md:w-[200px] text-right">อัปเดตล่าสุด</TableHead>
                  <TableHead className="w-[160px] text-right">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">{product.remaining}</TableCell>
                    <TableCell className="text-right">{product.unit}</TableCell>
                    <TableCell className="text-right">{product.min}</TableCell>
                    <TableCell className="text-center"> <span className={`px-8 py-2 rounded-full ${getStatusClass(product.status)}`}>
                            {product.status}
                          </span></TableCell>
                    <TableCell className="text-right">{product.dateupdate}</TableCell>
                    <TableCell className="flex items-center justify-around lg:justify-end">
                      <Button className="lg:mr-2 bg-[#FFC107] hover:bg-[#ffd044]">แก้ไข</Button>
                      <Button variant="destructive">ลบ</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      

        
        {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <ModalAddProduct closemodal={handleCloseModal}/>
              </div>
            )}
        {isModalOpen2 && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <ModalAddIngre closemodal={handleCloseModal2}/>
              </div>
            )}




      </div>
    </div>
    </Admintemplate>
    </>
  )
}
export default Stockpage