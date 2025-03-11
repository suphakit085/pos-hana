"use client";
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import html2canvas from 'html2canvas';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface Reservation {
  resID: number;
  resDate: string;
  resTime: string;
  resStatus: ReservationStatus;
  table: {
    tableName: string;
    tableSeats: number;
  };
  resName: string;
  resPhone: string;
  numberOfPeople: number;
}

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
}

export default function ReservationDialog({ isOpen, onClose, reservation }: ReservationDialogProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'cancelled':
        return 'ยกเลิกแล้ว';
      default:
        return 'รอดำเนินการ';
    }
  };

  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleSaveAsImage = async () => {
    const element = document.getElementById('reservation-details');
    if (element) {
      try {
        const canvas = await html2canvas(element);
        const image = canvas.toDataURL("image/png");
        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = `reservation-${reservation.resID}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (err) {
        console.error("ไม่สามารถแคปเจอร์รายละเอียดได้:", err);
        alert("เกิดข้อผิดพลาดในการแคปเจอร์รายละเอียด");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      return timeStr;
    }

    try {
      const [datePart, timePart] = timeStr.split('T');
      if (timePart) {
        return timePart.substring(0, 5);
      }
      
      const date = new Date(timeStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeStr;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <div id="reservation-details" className="text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            {getStatusIcon(reservation.resStatus)}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {reservation.resStatus === 'confirmed' ? 'รายละเอียดการจองที่ยืนยันแล้ว' :
             reservation.resStatus === 'cancelled' ? 'รายละเอียดการจองที่ยกเลิก' :
             'รายละเอียดการจอง'}
          </h1>
          
          <div className="text-left mb-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลการจอง</h2>
              <p className="text-gray-600">รหัสการจอง: <span className="font-medium">#{reservation.resID}</span></p>
              <p className="text-gray-600">วันที่จอง: <span className="font-medium">{formatDate(reservation.resDate)}</span></p>
              <p className="text-gray-600">เวลา: <span className="font-medium">{formatTime(reservation.resTime)} น.</span></p>
              <p className={getStatusColor(reservation.resStatus)}>
                สถานะ: <span className="font-medium">{getStatusText(reservation.resStatus)}</span>
              </p>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลโต๊ะ</h2>
              <p className="text-gray-600">โต๊ะ: <span className="font-medium">{reservation.table.tableName}</span></p>
              <p className="text-gray-600">จำนวนที่นั่ง: <span className="font-medium">{Math.max(1, reservation.numberOfPeople)} ที่นั่ง</span></p>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-gray-700">ข้อมูลผู้จอง</h2>
              <p className="text-gray-600">ชื่อ: <span className="font-medium">{reservation.resName}</span></p>
              <p className="text-gray-600">เบอร์โทร: <span className="font-medium">{reservation.resPhone}</span></p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className={`flex-1 py-3 text-white rounded-lg font-medium transition-colors ${
                reservation.resStatus === 'confirmed' ? 'bg-green-500 hover:bg-green-600' :
                reservation.resStatus === 'cancelled' ? 'bg-red-500 hover:bg-red-600' :
                'bg-[#FFB8DA] hover:bg-pink-400'
              }`}
            >
              ปิด
            </button>
            <button
              onClick={handleSaveAsImage}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              บันทึกเป็นรูปภาพ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 