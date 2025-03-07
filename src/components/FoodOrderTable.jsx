"use client"

import React, { useState, useEffect } from 'react';
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

// แปลงสถานะจากภาษาอังกฤษเป็นภาษาไทย
const translateStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'รอดำเนินการ';
    case 'SERVED':
      return 'เสิร์ฟแล้ว';
    case 'CANCELLED':
      return 'ยกเลิกแล้ว';
    default:
      return status;
  }
};

// แปลงสถานะจากภาษาไทยเป็นภาษาอังกฤษ
const getEnglishStatus = (thaiStatus) => {
  switch (thaiStatus) {
    case 'รอดำเนินการ':
      return 'PENDING';
    case 'เสิร์ฟแล้ว':
      return 'SERVED';
    case 'ยกเลิกแล้ว':
      return 'CANCELLED';
    default:
      return thaiStatus;
  }
};

const FoodOrderTable = () => {
  // สถานะสำหรับการกรอง
  const [filter, setFilter] = useState('all');
  // สถานะสำหรับเก็บข้อมูลการสั่งอาหาร
  const [foodOrders, setFoodOrders] = useState([]);
  // สถานะสำหรับการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลการสั่งอาหารเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    fetchOrders();
    
    // ตั้งเวลาดึงข้อมูลทุก 30 วินาที
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    // ล้างการตั้งเวลาเมื่อคอมโพเนนต์ถูกทำลาย
    return () => clearInterval(intervalId);
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลการสั่งอาหาร
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // ดึงข้อมูลจาก API
      const response = await fetch('/api/orders/pending');
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลการสั่งอาหารได้');
      }
      
      const data = await response.json();
      
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      const formattedOrders = data.map(order => {
        return order.items.map(item => ({
          id: `${order.orderID}-${item.menuItemID}`,
          orderID: order.orderID,
          table: `T${order.Tables_tabID.toString().padStart(2, '0')}`,
          name: item.menuItem.menuItemNameTHA,
          type: item.menuItem.menuItemNameENG,
          quantity: item.quantity,
          unit: 'จาน',
          status: translateStatus(item.status),
          createdAt: new Date(order.orderCreatedAt)
        }));
      }).flat();
      
      // เรียงลำดับตามเวลาที่สั่ง (ล่าสุดขึ้นก่อน)
      formattedOrders.sort((a, b) => b.createdAt - a.createdAt);
      
      setFoodOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // ถ้าไม่สามารถดึงข้อมูลได้ ให้ใช้ข้อมูลตัวอย่าง
      setFoodOrders([
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
          status: 'รอดำเนินการ'
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับอัพเดตสถานะการสั่งอาหาร
  const updateOrderStatus = async (orderId, menuItemId, newStatus) => {
    try {
      // แยก orderID และ menuItemID จาก id
      const [orderID, menuItemID] = orderId.split('-');
      
      // แปลงสถานะเป็นภาษาอังกฤษ
      const englishStatus = getEnglishStatus(newStatus);
      
      // ส่งคำขอไปยัง API เพื่ออัพเดตสถานะ
      const response = await fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: parseInt(orderID),
          menuItemID: parseInt(menuItemID),
          status: englishStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('ไม่สามารถอัพเดตสถานะได้');
      }
      
      // อัพเดตสถานะในข้อมูลท้องถิ่น
      setFoodOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      
      // แสดงข้อความแจ้งเตือน
      alert(`อัพเดตสถานะสำเร็จ: รายการ ${menuItemId} ถูกอัพเดตเป็น ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`เกิดข้อผิดพลาด: ไม่สามารถอัพเดตสถานะได้`);
    }
  };

  // กรองรายการตามสถานะ
  const filteredOrders = filter === 'all' 
    ? foodOrders 
    : foodOrders.filter(order => order.status === filter);

  // ฟังก์ชันสำหรับกำหนดสีของสถานะ
  const getStatusClass = (status) => {
    switch (status) {
      case 'รอดำเนินการ':
        return 'bg-[#F4FFB8] text-yellow-800';
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
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-4">
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
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={fetchOrders}
        >
          รีเฟรช
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">ไม่พบรายการอาหารที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
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
                        {order.status === 'รอดำเนินการ' && (
                          <>
                            <Button 
                              className="bg-[#B8FFBD] hover:bg-[#9eeba3] text-black hover:text-white"
                              onClick={() => updateOrderStatus(order.id, order.name, 'เสิร์ฟแล้ว')}
                            >
                              เสิร์ฟแล้ว
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, order.name, 'ยกเลิกแล้ว')}
                            >
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
          )}
        </div>
      )}
    </div>
  );
};

export default FoodOrderTable;