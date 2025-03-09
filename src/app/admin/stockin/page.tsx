"use client"
import React, { useState, useEffect } from 'react';
import Admintemplate from "@/components/Admintemplate";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Search, Eye, ArrowUpDown, 
  Download, RefreshCw, Plus, Users,
  ChevronDown, XCircle, AlertCircle
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from '@/components/ui/sonner';
import { Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ComboBoxCus from '@/components/combobox/ComboBoxCus';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, format, startOfMonth, endOfMonth, isToday } from "date-fns";
import { th } from "date-fns/locale";
import Modalreceipt from "@/components/Modalreceipt";
import { fetchStockInDetails } from "@/actions/actions";
import { Badge } from "@/components/ui/badge";

export default function StockInPage() {
  const [stockIns, setStockIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockInDetails, setStockInDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredStockIns, setFilteredStockIns] = useState([]);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [sortDirection, setSortDirection] = useState({ date: 'desc', price: null });
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalValue: 0,
    uniqueEmployees: 0
  });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedStockIn, setSelectedStockIn] = useState(null);
  const [cancelNote, setCancelNote] = useState('');

  // ดึงข้อมูลการนำเข้า
  const fetchStockIns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stockin');
      if (!response.ok) {
        throw new Error('Failed to fetch stock ins');
      }
      const data = await response.json();
      setStockIns(data);
      setFilteredStockIns(data);
      
      // คำนวณสถิติ
      const totalValue = data.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // นับจำนวนพนักงานที่ไม่ซ้ำกัน
      const uniqueEmployeeIds = new Set();
      data.forEach(item => {
        if (item.employee && item.Employee_empID) {
          uniqueEmployeeIds.add(item.Employee_empID);
        }
      });
      
      setStats({
        totalEntries: data.length,
        totalValue: totalValue,
        uniqueEmployees: uniqueEmployeeIds.size
      });
    } catch (error) {
      console.error('Error fetching stock ins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockIns();
  }, []);

  // ดูรายละเอียด
  const handleViewDetails = async (stockInID) => {
    try {
      const data = await fetchStockInDetails(stockInID);
      setStockInDetails(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching stock in details:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายละเอียดได้');
    }
  };

  // แสดงหน้าต่างยกเลิกการนำเข้า
  const handleOpenCancelDialog = (stockIn) => {
    if (stockIn.isCanceled) {
      toast.error('ไม่สามารถยกเลิกได้', {
        description: 'รายการนี้ถูกยกเลิกไปแล้ว',
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }
    setSelectedStockIn(stockIn);
    setCancelNote('');
    setCancelDialogOpen(true);
  };

  // ยกเลิกการนำเข้า
  const handleCancelStockIn = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const empID = formData.get('empID');
    
    if (!selectedStockIn || !cancelNote.trim()) {
      toast.error('กรุณาระบุสาเหตุการยกเลิก');
      return;
    }
    
    if (!empID) {
      toast.error('กรุณาเลือกพนักงานผู้ยกเลิก');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/stockin/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockInID: selectedStockIn.stockInID,
          canceledByEmpID: parseInt(empID),
          cancelNote: cancelNote
        }),
      });

      // ตรวจสอบว่า response ถูกต้องหรือไม่
      let errorMessage = 'ไม่สามารถยกเลิกรายการได้';
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // แสดง toast แจ้งเตือนเมื่อยกเลิกสำเร็จ
      toast.success('ยกเลิกการนำเข้าสินค้าเรียบร้อยแล้ว', {
        description: `รายการนำเข้ารหัส ${selectedStockIn.stockInID} ถูกยกเลิก`,
        duration: 5000,
      });
      
      setCancelDialogOpen(false);
      fetchStockIns(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error('Error canceling stock in:', error);
      
      // แสดง toast แจ้งเตือนเมื่อเกิดข้อผิดพลาด
      toast.error('เกิดข้อผิดพลาดในการยกเลิกรายการ', {
        description: error.message || 'โปรดลองอีกครั้งในภายหลัง',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ค้นหา
  const handleSearch = (e) => {
    e.preventDefault();
    filterData();
  };

  // กรองข้อมูล
  const filterData = () => {
    let filtered = [...stockIns];
    
    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.employee?.empFname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee?.empLname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stockInID.toString().includes(searchTerm) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // กรองตามช่วงวันที่
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // ถึงสิ้นวัน
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.stockInDateTime);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    
    setFilteredStockIns(filtered);
    
    // คำนวณสถิติใหม่
    const totalValue = filtered.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // นับจำนวนพนักงานที่ไม่ซ้ำกันในข้อมูลที่กรอง
    const uniqueEmployeeIds = new Set();
    filtered.forEach(item => {
      if (item.employee && item.Employee_empID) {
        uniqueEmployeeIds.add(item.Employee_empID);
      }
    });
    
    setStats({
      totalEntries: filtered.length,
      totalValue: totalValue,
      uniqueEmployees: uniqueEmployeeIds.size
    });
  };

  // เรียงข้อมูล
  const sortByDate = () => {
    const newDirection = sortDirection.date === 'asc' ? 'desc' : 'asc';
    setSortDirection({ ...sortDirection, date: newDirection });
    
    const sorted = [...filteredStockIns].sort((a, b) => {
      const dateA = new Date(a.stockInDateTime);
      const dateB = new Date(b.stockInDateTime);
      return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredStockIns(sorted);
  };
  
  const sortByPrice = () => {
    const newDirection = sortDirection.price === 'asc' ? 'desc' : 'asc';
    setSortDirection({ ...sortDirection, price: newDirection });
    
    const sorted = [...filteredStockIns].sort((a, b) => {
      return newDirection === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    });
    
    setFilteredStockIns(sorted);
  };

  // ฟอร์แมตราคา
  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <Admintemplate>
      <Toaster richColors position="top-right" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">ประวัติการนำเข้าสินค้า</h1>
            <p className="text-gray-500 mt-1">ดูประวัติและรายละเอียดการนำเข้าสินค้าทั้งหมด</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/admin/stockindetail">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" /> นำเข้าสินค้าใหม่
              </Button>
            </Link>
            <Button variant="outline" onClick={fetchStockIns}>
              <RefreshCw className="h-4 w-4 mr-2" /> รีเฟรช
            </Button>
          </div>
        </div>
        
        {/* สรุปข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">จำนวนรายการทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries} รายการ</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">มูลค่ารวมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">จำนวนพนักงานที่นำเข้า</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                {stats.uniqueEmployees} คน
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ส่วนค้นหาและกรอง */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาตามรหัส, พนักงาน, หมายเหตุ..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FFB8DA]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-[210px] justify-between border-gray-300 bg-white hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">
                          {dateRange.from && dateRange.to
                            ? `${format(dateRange.from, "d MMM", { locale: th })} - ${format(dateRange.to, "d MMM", { locale: th })}`
                            : "เลือกช่วงวันที่"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-gray-200 rounded-md shadow-lg" align="start">
                    <div className="p-3 border-b border-gray-200 bg-pink-50">
                      <div className="text-sm font-medium text-pink-700">เลือกช่วงวันที่</div>
                    </div>
                    <div className="p-2">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from || new Date()}
                        selected={{
                          from: dateRange.from || undefined,
                          to: dateRange.to || undefined,
                        }}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange({ 
                              from: range.from || null, 
                              to: range.to || range.from || null 
                            });
                          }
                        }}
                        numberOfMonths={1}
                        locale={th}
                        classNames={{
                          months: "flex flex-col space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center px-2",
                          caption_label: "text-sm font-medium text-gray-900",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 rounded-full",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-gray-500 rounded-md w-9 font-medium text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "h-9 w-9 text-center text-sm relative p-0 rounded-md focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-pink-100 [&:has([aria-selected].day-outside)]:bg-pink-50 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:rounded-md",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-100",
                          day_range_end: "day-range-end",
                          day_selected: "bg-pink-500 text-white hover:bg-pink-600 hover:text-white focus:bg-pink-500 focus:text-white",
                          day_today: "bg-gray-100 text-gray-900",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50",
                          day_range_middle: "aria-selected:bg-pink-50 aria-selected:text-gray-900",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                    <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDateRange({ from: null, to: null });
                          filterData();
                          const dropdownTrigger = document.querySelector("[data-state='open']");
                          if (dropdownTrigger) {
                            (dropdownTrigger as HTMLElement).click();
                          }
                        }}
                        className="text-xs h-7 border-gray-300"
                      >
                        ล้าง
                      </Button>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            setDateRange({ from: today, to: today });
                          }}
                          className="text-xs h-7 border-gray-300"
                        >
                          วันนี้
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            const startMonth = startOfMonth(today);
                            const endMonth = endOfMonth(today);
                            setDateRange({ from: startMonth, to: endMonth });
                          }}
                          className="text-xs h-7 border-gray-300"
                        >
                          เดือนนี้
                        </Button>
                        <Button
                          onClick={() => {
                            filterData();
                            const dropdownTrigger = document.querySelector("[data-state='open']");
                            if (dropdownTrigger) {
                              (dropdownTrigger as HTMLElement).click();
                            }
                          }}
                          className="bg-pink-500 hover:bg-pink-600 text-white text-xs h-7"
                          size="sm"
                        >
                          ตกลง
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button type="button" className="bg-pink-500 hover:bg-pink-600 text-white" onClick={filterData}>
                  ค้นหา
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ตารางข้อมูล */}
        <Card>
          <CardHeader>
            <CardTitle>ประวัติการนำเข้าสินค้า</CardTitle>
            <CardDescription>
              แสดงผล {filteredStockIns.length} รายการ จากทั้งหมด {stockIns.length} รายการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB8DA]"></div>
                <span className="ml-2">กำลังโหลดข้อมูล...</span>
              </div>
            ) : filteredStockIns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border rounded-md bg-gray-50">
                <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium mb-1">ไม่พบข้อมูลการนำเข้าสินค้า</p>
                <p className="text-gray-400 text-sm">ลองเปลี่ยนช่วงวันที่หรือคำค้นหา</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">รหัส</TableHead>
                      <TableHead className="cursor-pointer" onClick={sortByDate}>
                        <div className="flex items-center">
                          วันที่และเวลา
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={sortByPrice}>
                        <div className="flex items-center justify-end">
                          มูลค่ารวม
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>พนักงาน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStockIns.map((stockIn) => (
                      <TableRow key={stockIn.stockInID}>
                        <TableCell className="font-medium">{stockIn.stockInID}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(stockIn.stockInDateTime).toLocaleString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(stockIn.totalPrice)}
                        </TableCell>
                        <TableCell>
                          {stockIn.employee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                {stockIn.employee.empFname.charAt(0)}
                              </div>
                              <span>{stockIn.employee.empFname} {stockIn.employee.empLname}</span>
                            </div>
                          ) : 'ไม่ระบุ'}
                        </TableCell>
                        <TableCell>
                          {stockIn.isCanceled ? (
                            <Badge variant="destructive">ยกเลิกแล้ว</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              สำเร็จ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {stockIn.note || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">เปิดเมนู</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(stockIn.stockInID)}>
                                ดูรายละเอียด
                              </DropdownMenuItem>
                              {!stockIn.isCanceled && (
                                <DropdownMenuItem onClick={() => handleOpenCancelDialog(stockIn)} className="text-red-600 focus:text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  ยกเลิกการนำเข้า
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                พิมพ์ใบนำเข้า
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal แสดงรายละเอียด */}
        {isModalOpen && stockInDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Modalreceipt
              receiptNumber={stockInDetails.stockIn.stockInID.toString()}
              date={new Date(stockInDetails.stockIn.stockInDateTime).toLocaleString('th-TH')}
              staffName={`${stockInDetails.stockIn.employee.empFname} ${stockInDetails.stockIn.employee.empLname}`}
              items={stockInDetails.details.map(detail => ({
                name: detail.ingredientName,
                quantity: detail.quantity,
                unit: detail.unit,
                pricePerUnit: detail.pricePerUnit,
                totalPrice: detail.totalPrice
              }))}
              totalAmount={stockInDetails.stockIn.totalPrice}
              closemodal={() => setIsModalOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Dialog ยกเลิกการนำเข้า */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              ยกเลิกการนำเข้าสินค้า
            </DialogTitle>
            <DialogDescription>
              เมื่อยกเลิกการนำเข้า ระบบจะปรับลดจำนวนสินค้าในคลังตามรายการที่นำเข้า
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCancelStockIn}>
            <div className="space-y-4 py-2">
              {selectedStockIn && (
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <div><span className="font-medium">รหัสการนำเข้า:</span> {selectedStockIn.stockInID}</div>
                  <div><span className="font-medium">วันที่นำเข้า:</span> {new Date(selectedStockIn.stockInDateTime).toLocaleString('th-TH')}</div>
                  <div><span className="font-medium">มูลค่า:</span> {formatPrice(selectedStockIn.totalPrice)}</div>
                  <div><span className="font-medium">พนักงานที่นำเข้า:</span> {selectedStockIn.employee ? `${selectedStockIn.employee.empFname} ${selectedStockIn.employee.empLname}` : 'ไม่ระบุ'}</div>
                </div>
              )}
              
              <div>
                <label htmlFor="canceledBy" className="block text-sm font-medium text-gray-700 mb-1">
                  พนักงานผู้ยกเลิก <span className="text-red-500">*</span>
                </label>
                <ComboBoxCus />
              </div>
              
              <div>
                <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-1">
                  ระบุสาเหตุการยกเลิก <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="cancelReason"
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="กรุณาระบุสาเหตุการยกเลิกรายการนำเข้านี้"
                  rows={3}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!cancelNote.trim() || loading}
              >
                {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการยกเลิก'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Admintemplate>
  );
}