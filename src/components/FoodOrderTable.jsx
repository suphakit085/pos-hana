"use client"

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const FoodOrderTable = () => {
  // สถานะสำหรับการกรอง
  const [filter, setFilter] = useState('all');

  // ข้อมูลตัวอย่าง
  const foodOrders = [
    {
      id: 1,
      table: 'T01',
      name: 'หมูสามชั้นไทย',
      type: 'Pork Belly',
      quantity: 3,
      unit: 'จาน',
      status: 'รอดำเนินการ'
    },
    {
      id: 2,
      table: 'T01',
      name: 'เนื้อริบอาย',
      type: 'Beef Ribeye',
      quantity: 2,
      unit: 'จาน',
      status: 'กำลังปรุง'
    },
    {
      id: 3,
      table: 'T02',
      name: 'ลูกชิ้นเกาหลี',
      type: 'Pork Cake',
      quantity: 3,
      unit: 'จาน',
      status: 'เสิร์ฟแล้ว'
    },
    {
      id: 4,
      table: 'T03',
      name: 'เนื้อวากิว A5',
      type: 'Wagyu Beef',
      quantity: 1,
      unit: 'จาน',
      status: 'ยกเลิกแล้ว'
    },
    {
      id: 5,
      table: 'T02',
      name: 'ผักรวม',
      type: 'Vegetables',
      quantity: 2,
      unit: 'จาน',
      status: 'เสิร์ฟแล้ว'
    },
  ];

  // กรองรายการตามสถานะ
  const filteredOrders = filter === 'all' 
    ? foodOrders 
    : foodOrders.filter(order => order.status === filter);

  // ฟังก์ชันสำหรับกำหนดสีของสถานะ
  const getStatusClass = (status) => {
    switch (status) {
      case 'รอดำเนินการ':
        return 'bg-[#F4FFB8] text-yellow-800';
      case 'กำลังปรุง':
        return 'bg-yellow-100 text-yellow-800';
      case 'เสิร์ฟแล้ว':
        return 'bg-[#B8FFBD] text-green-800';
      case 'ยกเลิกแล้ว':
        return 'bg-[#FFB8B9] text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 bg-white">
      
      <div className="mb-5 flex gap-4">
        <Button 
          className={`rounded-lg py-6 px-8 text-black ${filter === 'all' ? 'text-white bg-[#ffa8d1] hover:bg-[#ffa8d1] hover:text-white' : 'bg-[#FFECF5] hover:bg-[#FFECF5]'}`}
          onClick={() => setFilter('all')}
        >
          ทั้งหมด
        </Button>
        <Button 
          className={`rounded-lg py-6 px-8 text-black ${filter === 'รอดำเนินการ' ? 'text-white bg-[#e1f181] hover:bg-[#f1ff9e] hover:text-white' : 'bg-[#F4FFB8] hover:bg-[#dff07d]'}`}
          onClick={() => setFilter('รอดำเนินการ')}
        >
          รอดำเนินการ
        </Button>
        <Button 
          className={`rounded-lg py-6 px-8 text-black ${filter === 'เสิร์ฟแล้ว' ? 'text-white bg-[#71da78] hover:bg-[#9eeba3] hover:text-white' : 'bg-[#B8FFBD] hover:bg-[#9eeba3]'}`}
          onClick={() => setFilter('เสิร์ฟแล้ว')}
        >
          เสิร์ฟแล้ว
        </Button>
        <Button 
          className={`rounded-lg py-6 px-8 text-black ${filter === 'ยกเลิกแล้ว' ? 'text-white bg-[#ff7a7c] hover:bg-[#ff9798] hover:text-white' : 'bg-[#ffb4b5] hover:bg-[#ff9798]'}`}
          onClick={() => setFilter('ยกเลิกแล้ว')}
        >
          ยกเลิกแล้ว
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[80px]">โต๊ะ</TableHead>
              <TableHead className="w-[250px]">รายการ</TableHead>
              <TableHead className="w-[100px]">จำนวน</TableHead>
              <TableHead className="w-[100px]">หน่วย</TableHead>
              <TableHead className="w-[150px] text-center">สถานะ</TableHead>
              <TableHead className="w-[200px] text-right">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.table}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.name}</div>
                    <div className="text-sm text-gray-500">{order.type}</div>
                  </div>
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.unit}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block px-4 py-2 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {order.status !== 'เสิร์ฟแล้ว' && order.status !== 'ยกเลิกแล้ว' && (
                      <>
                        <Button className="bg-[#B8FFBD] hover:bg-[#9eeba3] text-black hover:text-white">
                          เสิร์ฟแล้ว
                        </Button>
                        <Button variant="destructive">
                          ยกเลิก
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FoodOrderTable;