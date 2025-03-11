"use client";
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import html2canvas from 'html2canvas';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from "next/link";
import { FaEye } from 'react-icons/fa';
import ReservationDialog from '@/components/ReservationDialog';

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

const statusConfig: Record<ReservationStatus, { label: string; className: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', className: 'bg-green-100 text-green-800' },
  pending: { label: 'รอดำเนินการ', className: 'bg-yellow-100 text-yellow-800' },
  cancelled: { label: 'ยกเลิกแล้ว', className: 'bg-red-100 text-red-800' }
};

export default function BookingHistory() {
    // This will be populated from the API
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filter, setFilter] = useState("all");
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch reservations from the API
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                // Get user data from localStorage
                const storedUserData = localStorage.getItem('userData');
                if (!storedUserData) {
                    toast.error('กรุณาเข้าสู่ระบบก่อนดูประวัติการจอง');
                    return;
                }

                // Parse user data to get customer ID
                const userData = JSON.parse(storedUserData);
                const customerID = userData.customerID;

                if (!customerID) {
                    toast.error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
                    return;
                }

                // Fetch reservations for this specific user
                const response = await fetch(`/api/user-reservations/getre?customerID=${customerID}`);
                if (response.ok) {
                    const data = await response.json();
                    // Transform the data to match the expected format
                    const transformedData = data.map((res: any) => {
                        const numberOfPeople = res.numberOfPeople || 1;
                        
                        // ใช้ชื่อโต๊ะจาก API โดยตรง หรือสร้างชื่อโต๊ะตามประเภท
                        let tableName = res.table.tableName;
                        if (!tableName) {
                            tableName = res.table.tabTypes === 'VIP' ? 'ห้อง VIP' : `โต๊ะ ${res.table.tabID}`;
                        }
                        
                        return {
                            resID: res.resID,
                            resDate: res.resDate,
                            resTime: res.resTime,
                            resStatus: res.resStatus,
                            resName: res.resName,
                            resPhone: res.resPhone,
                            numberOfPeople: numberOfPeople,
                            table: {
                                tableName: tableName,
                                tableSeats: numberOfPeople
                            }
                        };
                    });
                    setReservations(transformedData);
                } else {
                    toast.error('ไม่สามารถโหลดข้อมูลการจองได้');
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
                toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            }
        };

        fetchReservations();
    }, []);

    const filteredReservations = filter === "all"
        ? reservations
        : reservations.filter(reservation => reservation.resStatus === filter);

    const getStatusBadge = (status: ReservationStatus) => {
        const config = statusConfig[status];
        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateStr: string) => {
        const options = { year: 'numeric' as 'numeric' | '2-digit', month: 'long' as 'long' | 'short' | 'narrow', day: 'numeric' as 'numeric' | '2-digit' };
        return new Date(dateStr).toLocaleDateString('th-TH', options);
    };

    // Add this helper function near your other formatting functions
    const formatTime = (timeStr: string) => {
        // If timeStr is already in HH:mm format, return as is
        if (timeStr.match(/^\d{2}:\d{2}$/)) {
            return timeStr;
        }
        // For ISO date strings, extract just the time portion
        if (timeStr.includes('T')) {
            const [_, time] = timeStr.split('T');
            return time.substring(0, 5); // Get just HH:mm
        }
        // For other formats, create a date object and format it
        const date = new Date(timeStr);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleViewDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsDialogOpen(true);
    };

    const handleCaptureDetails = async () => {
        if (!selectedReservation) return;

        const detailsElement = document.getElementById('booking-details');
        if (detailsElement) {
            try {
                const canvas = await html2canvas(detailsElement);
                const image = canvas.toDataURL("image/png");

                // สร้าง element ลิงก์สำหรับดาวน์โหลด
                const downloadLink = document.createElement('a');
                downloadLink.href = image;
                downloadLink.download = `booking-${selectedReservation.resID}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (err) {
                console.error("ไม่สามารถแคปเจอร์รายละเอียดได้:", err);
                alert("เกิดข้อผิดพลาดในการแคปเจอร์รายละเอียด");
            }
        }
    };
    const handleCancelReservation = async (reservation: Reservation) => {
        if (!confirm('คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')) {
            return;
        }

        try {
            const response = await fetch('/api/user-reservations/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservationId: reservation.resID }),
            });

            if (response.ok) {
                toast.success('ยกเลิกการจองเรียบร้อยแล้ว');
                // Update local state
                setReservations(prevData =>
                    prevData.map(item =>
                        item.resID === reservation.resID
                            ? { ...item, resStatus: 'cancelled' }
                            : item
                    )
                );
            } else {
                toast.error('ไม่สามารถยกเลิกการจองได้');
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            toast.error('เกิดข้อผิดพลาดในการยกเลิกการจอง');
        }
    };
    return (
        <>
            <Toaster position="top-center" />
            <div className="hidden lg:flex fixed top-0 left-0 right-0">
                <UserDesktopNavbar />
            </div>

            <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
                <UserMobileNavbar />
            </div>

            <div className="container mx-auto px-4 py-16 mt-10">
                <h1 className="text-3xl font-bold mb-6">ประวัติการจอง</h1>

                <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center">
                        <span className="mr-2">สถานะ:</span>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="เลือกสถานะ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                                <SelectItem value="pending">รอยืนยัน</SelectItem>
                                <SelectItem value="cancelled">ยกเลิกแล้ว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Link href="/reservations/">
                        <Button variant="outline">จองโต๊ะเพิ่ม</Button>
                    </Link>
                </div>

                {/* for big screen */}
                <div className="hidden md:block">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>รายการจองทั้งหมด</CardTitle>
                            <p className="text-sm text-gray-500">แสดงประวัติการจองโต๊ะล่าสุดของคุณ</p>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[70vh] overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10">
                                        <TableRow>
                                            <TableHead>รหัสการจอง</TableHead>
                                            <TableHead>วันที่</TableHead>
                                            <TableHead>เวลา</TableHead>
                                            <TableHead>โต๊ะ</TableHead>
                                            <TableHead>สถานะ</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredReservations.map((reservation) => (
                                            <TableRow key={reservation.resID}>
                                                <TableCell className="font-medium">#{reservation.resID}</TableCell>
                                                <TableCell>{formatDate(reservation.resDate)}</TableCell>
                                                <TableCell>{formatTime(reservation.resTime)} น.</TableCell>
                                                <TableCell>{reservation.table.tableName}</TableCell>
                                                <TableCell>{getStatusBadge(reservation.resStatus)}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(reservation)}
                                                        >
                                                            <FaEye size={20} />
                                                        </Button>
                                                        {reservation.resStatus !== 'cancelled' && (
                                                            <Button variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancelReservation(reservation)}>
                                                                ยกเลิก
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* for small screen */}
                <div className="md:hidden space-y-4 max-h-[80vh] overflow-y-auto pb-4">
                    {filteredReservations.map((reservation) => (
                        <Card key={reservation.resID} className="w-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>#{reservation.resID}</CardTitle>
                                    {getStatusBadge(reservation.resStatus)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {formatDate(reservation.resDate)} | {formatTime(reservation.resTime)} น.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">โต๊ะ:</span>
                                        <span>{reservation.table.tableName}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(reservation)}>ดูรายละเอียด</Button>
                                {reservation.resStatus !== 'cancelled' && (
                                    <Button variant="destructive" size="sm" onClick={() => handleCancelReservation(reservation)}>ยกเลิก</Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modal รายละเอียดการจอง */}
            {selectedReservation && (
                <ReservationDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    reservation={selectedReservation as Reservation}
                />
            )}
        </>
    );
}