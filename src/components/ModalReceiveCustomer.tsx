"use client";
import React, { useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { IoQrCode } from "react-icons/io5";
import { TbMoneybag } from "react-icons/tb";
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';

interface TableClickProps {
    tableId: string;
    tableStatus: string;
    customerCount: number;
    onClose: () => void;
}

function ModalReceiveCustomer({ tableId, tableStatus, customerCount, onClose }: TableClickProps) {
    const [activeTab, setActiveTab] = useState<string>('customer'); // Default tab

    // สถานะการกรอกข้อมูล
    const [newCustomerCount, setNewCustomerCount] = useState<number>(customerCount);
    const [reservationName, setReservationName] = useState<string>('');
    const [reservationTime, setReservationTime] = useState<string>('');
    const [reservationPhone, setReservationPhone] = useState<string>('');

    // คำนวณว่าควรแสดงปุ่มอะไรบ้างตามสถานะ
    const showCustomerButton = tableStatus === "ว่าง" || tableStatus === "จอง";
    const showReserveButton = tableStatus === "ว่าง";
    const showQrCodeButton = tableStatus === "มีลูกค้า";
    const showBillButton = tableStatus === "มีลูกค้า";

    const handleCustomerSubmit = () => {
        // โค้ดสำหรับบันทึกการรับลูกค้า
        console.log(`รับลูกค้า ${newCustomerCount} คน ที่โต๊ะ ${tableId}`);
        // TODO: อัพเดทสถานะโต๊ะในระบบ
        onClose();
    };

    const handleReservationSubmit = () => {
        // โค้ดสำหรับบันทึกการจองโต๊ะ
        console.log(`จองโต๊ะ ${tableId} ชื่อ ${reservationName} เวลา ${reservationTime}`);
        // TODO: อัพเดทสถานะโต๊ะในระบบ
        onClose();
    };

    const handleGenerateQR = () => {
        // โค้ดสำหรับสร้าง QR Code
        console.log(`สร้าง QR Code สำหรับโต๊ะ ${tableId}`);
        // TODO: สร้าง QR Code และแสดงผล
    };

    const handleCheckBill = () => {
        // โค้ดสำหรับเช็คบิล
        console.log(`เช็คบิลโต๊ะ ${tableId}`);
        // TODO: เปิดหน้าเช็คบิล
        onClose();
    };





    return (
        <div className="fixed inset-0 w-96 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        โต๊ะ {tableId} - {tableStatus}
                        {customerCount > 0 && ` (${customerCount} คน)`}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <MdOutlineCancel className="w-6 h-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b">
                    {showCustomerButton && (
                        <button
                            className={`flex items-center px-4 py-2 ${activeTab === 'customer' ? 'border-b-2 border-[#FFB8DA] text-[#FFB8DA]' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('customer')}
                        >
                            <FaRegUserCircle className="w-5 h-5 mr-1" />
                            รับลูกค้า
                        </button>
                    )}

                    {showReserveButton && (
                        <button
                            className={`flex items-center px-4 py-2 ${activeTab === 'reserve' ? 'border-b-2 border-[#FFB8DA] text-[#FFB8DA]' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('reserve')}
                        >
                            <LuCalendarDays className="w-5 h-5 mr-1" />
                            จองโต๊ะ
                        </button>
                    )}

                    {showQrCodeButton && (
                        <button
                            className={`flex items-center px-4 py-2 ${activeTab === 'qrcode' ? 'border-b-2 border-[#FFB8DA] text-[#FFB8DA]' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('qrcode')}
                        >
                            <IoQrCode className="w-5 h-5 mr-1" />
                            QR Code
                        </button>
                    )}

                    {showBillButton && (
                        <button
                            className={`flex items-center px-4 py-2 ${activeTab === 'bill' ? 'border-b-2 border-[#FFB8DA] text-[#FFB8DA]' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('bill')}
                        >
                            <TbMoneybag className="w-5 h-5 mr-1" />
                            เช็คบิล
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'customer' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">รับลูกค้า</h3>
                            <div>
                                <div className='grid grid-cols-1 md:grid-cols-2'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">จำนวนลูกค้า</label>
                                        <div className="mt-1 flex items-center">
                                            <button
                                                className="bg-[#FFB8DA] px-3 py-1 rounded-l-md hover:bg-[#fcc6e0]"
                                                onClick={() => setNewCustomerCount(Math.max(1, newCustomerCount - 1))}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newCustomerCount}
                                                onChange={(e) => setNewCustomerCount(parseInt(e.target.value) || 1)}
                                                className="text-center border-t border-b w-16 py-1"
                                            />
                                            <button
                                                className="bg-[#FFB8DA] px-3 py-1 rounded-r-md hover:bg-[#fcc6e0]"
                                                onClick={() => setNewCustomerCount(newCustomerCount + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between'>
                                        <label className="block text-sm font-medium text-gray-700">ตัวเลือกบุฟเฟต์</label>
                                        <select name="buffettype" id="type" className='border p-[3px] rounded-lg'>
                                            <option value="standard">Standard</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="w-full bg-[#FFB8DA] text-white py-2 rounded-md hover:bg-[#fcc6e0]"
                                onClick={handleCustomerSubmit}
                            >
                                ยืนยัน
                            </button>
                        </div>
                    )}

                    {activeTab === 'reserve' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">จองโต๊ะ</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ชื่อผู้จอง</label>
                                <input
                                    type="text"
                                    value={reservationName}
                                    onChange={(e) => setReservationName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="กรอกชื่อผู้จอง"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    value={reservationPhone}
                                    onChange={(e) => setReservationPhone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="เบอร์โทรศัพท์"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">เวลาที่จอง</label>
                                <input
                                    type="time"
                                    value={reservationTime}
                                    onChange={(e) => setReservationTime(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">จำนวนลูกค้า</label>
                                <div className="mt-1 flex items-center">
                                    <button
                                        className="bg-[#FFB8DA] px-3 py-1 rounded-l-md hover:bg-[#fcc6e0]"
                                        onClick={() => setNewCustomerCount(Math.max(1, newCustomerCount - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCustomerCount}
                                        onChange={(e) => setNewCustomerCount(parseInt(e.target.value) || 1)}
                                        className="text-center border-t border-b w-16 py-1"
                                    />
                                    <button
                                        className="bg-[#FFB8DA] px-3 py-1 rounded-r-md hover:bg-[#fcc6e0]"
                                        onClick={() => setNewCustomerCount(newCustomerCount + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                className="w-full bg-[#FFB8DA] text-white py-2 rounded-md hover:bg-[#fcc6e0]"
                                onClick={handleReservationSubmit}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>
                    )}

                    {activeTab === 'qrcode' && (
                        <div className="space-y-4 text-center">
                            <h3 className="text-lg font-medium">QR Code สำหรับสั่งอาหาร</h3>
                            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                {/* QR Code จะแสดงตรงนี้ */}
                                <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center">
                                    <IoQrCode className="w-24 h-24 text-gray-400" />
                                </div>
                            </div>
                            <button
                                className="w-full bg-[#FFB8DA] text-white py-2 rounded-md hover:bg-[#fcc6e0]"
                                onClick={handleGenerateQR}
                            >
                                สร้าง QR Code
                            </button>
                            <button
                                className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                            >
                                พิมพ์ QR Code
                            </button>
                        </div>
                    )}

                    {activeTab === 'bill' && (
                        <div className="space-y-4 text-center">
                            <h3 className="text-lg font-medium">เช็คบิล</h3>
                            <div className="p-4">
                                <p className="mb-2">ยืนยันการเช็คบิลโต๊ะ {tableId}</p>
                                <p className="text-sm text-gray-500">ลูกค้า: {customerCount} คน</p>
                            </div>
                            <Link href={`/admin/tables/checkbill?tableId=${tableId}&customerCount=${customerCount}`}>
                                <button
                                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                                    onClick={handleCheckBill}
                                >
                                    เช็คบิล
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalReceiveCustomer;