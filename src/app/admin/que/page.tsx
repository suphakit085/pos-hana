//src\app\admin\que\page.tsx
"use client";
import Admintemplate from '@/components/Admintemplate';
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
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { toast } from "sonner"

interface Reservation {
  resID: string;
  resName: string;
  resPhone: string;
  resDate: string;
  resTime: string;
  numberOfPeople: number;
  Tables_tabID: string;
  resStatus: string;
}

function Quepage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      // แปลง MySQL date format (YYYY-MM-DD) เป็น Date object
      const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
      const date = new Date(year, month - 1, day); // month - 1 เพราะ JavaScript เริ่มนับเดือนที่ 0

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      // แปลงเป็นรูปแบบไทย
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      if (!timeStr) return 'เวลาไม่ถูกต้อง';

      // กรณีที่เป็น ISO string
      if (timeStr.includes('T')) {
        const [datePart, timePart] = timeStr.split('T');
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes} น.`;
      }

      // กรณีที่เป็น MySQL time format (HH:mm:ss)
      const [hours, minutes] = timeStr.split(':');
      if (hours && minutes) {
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} น.`;
      }

      throw new Error('Unsupported time format');
    } catch (error) {
      console.error('Error formatting time:', error, timeStr);
      return 'เวลาไม่ถูกต้อง';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'cancelled':
        return 'ยกเลิกแล้ว';
      case 'pending':
        return 'รอการยืนยัน';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return '';
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reservations');
      }
      const data = await response.json();
      // Ensure data is an array and format dates
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (resID: string, status: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/reservations/${resID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update reservation');
      }

      await fetchReservations(); // Refresh the list after update
      toast.success(`${status === 'confirmed' ? 'ยืนยัน' : 'ยกเลิก'}การจองสำเร็จ`);
    } catch (error) {
      console.error('Error updating reservation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update reservation';
      setError(errorMessage);
      toast.error('ไม่สามารถอัพเดทสถานะการจองได้');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // Refresh data every minute
    const interval = setInterval(fetchReservations, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Admintemplate>
        <div className='size-full p-10 flex items-center justify-center'>
          <div className='bg-white size-full rounded-3xl p-10'>
            กำลังโหลด...
          </div>
        </div>
      </Admintemplate>
    );
  }

  if (error) {
    return (
      <Admintemplate>
        <div className='size-full p-10 flex items-center justify-center'>
          <div className='bg-white size-full rounded-3xl p-10 text-red-500'>
            เกิดข้อผิดพลาด: {error}
          </div>
        </div>
      </Admintemplate>
    );
  }

  return (
    <>
      <Admintemplate>
        <div className='size-full p-10 flex items-center justify-center'>
          <div className='bg-white size-full rounded-3xl'>
            <h1 className="text-3xl pl-10 pt-5 mb-5">รายการจองที่รอการยืนยัน</h1>

            <div className='flex justify-center items-center'>
              <div className='w-[95%]'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสการจอง</TableHead>
                      <TableHead>ชื่อการจอง</TableHead>
                      <TableHead>เบอร์โทร</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>เวลา</TableHead>
                      <TableHead>จำนวนคน</TableHead>
                      <TableHead>โต๊ะ</TableHead>
                      <TableHead className="text-right">การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">ไม่มีรายการจองที่รอการยืนยัน</TableCell>
                      </TableRow>
                    ) : (
                      reservations.map((reservation) => (
                        <TableRow key={reservation.resID}>
                          <TableCell>{reservation.resID}</TableCell>
                          <TableCell>{reservation.resName}</TableCell>
                          <TableCell>{reservation.resPhone}</TableCell>
                          <TableCell>{formatDate(reservation.resDate)}</TableCell>
                          <TableCell>{formatTime(reservation.resTime)}</TableCell>
                          <TableCell>{reservation.numberOfPeople}</TableCell>
                          <TableCell>{reservation.Tables_tabID}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              className="p-3 bg-[#dc3545] rounded-xl mr-4"
                              onClick={() => updateReservationStatus(reservation.resID, 'cancelled')}
                              disabled={updating}
                            >
                              ยกเลิก
                            </Button>
                            <Button 
                              className="p-3 bg-[#28a745] text-white rounded-xl"
                              onClick={() => updateReservationStatus(reservation.resID, 'confirmed')}
                              disabled={updating}
                            >
                              ยืนยันการจอง
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Admintemplate>
    </>
  )
}

export default Quepage
