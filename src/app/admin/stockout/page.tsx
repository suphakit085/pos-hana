"use client"
import Admintemplate from "@/components/Admintemplate"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { RiSearchLine } from "react-icons/ri";
import { Calendar as CalendarIcon, ChevronDown, RefreshCw, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, formatISO } from "date-fns";
import { th } from "date-fns/locale";
import { toast, Toaster } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function StockoutPage() {
  const [stockOuts, setStockOuts] = useState([]);
  const [filteredStockOuts, setFilteredStockOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  
  // ดึงข้อมูลประวัติการเบิกสินค้า
  const fetchStockOuts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stockout');
      if (!response.ok) {
        throw new Error('Failed to fetch stock outs');
      }
      const data = await response.json();
      setStockOuts(data);
      setFilteredStockOuts(data);
    } catch (error) {
      console.error('Error fetching stock outs:', error);
      toast.error("ไม่สามารถโหลดข้อมูลประวัติการเบิกได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockOuts();
  }, []);

  // ฟังก์ชันสำหรับการค้นหาและกรองข้อมูล
  const handleSearch = (e) => {
    e.preventDefault();
    filterData();
  }

  // ฟังก์ชันกรองข้อมูลตามคำค้นหาและช่วงวันที่
  const filterData = () => {
    let filtered = [...stockOuts];
    
    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.stock?.ingredientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee?.empFname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee?.empLname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // กรองตามช่วงวันที่
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        if (!item.tsCreatedAt) return false;
        
        const itemDate = parseISO(item.tsCreatedAt);
        return isWithinInterval(itemDate, { 
          start: new Date(dateRange.from.setHours(0, 0, 0, 0)), 
          end: new Date(dateRange.to.setHours(23, 59, 59, 999)) 
        });
      });
    }
    
    setFilteredStockOuts(filtered);
  }

  // ฟังก์ชันรีเซ็ตการกรอง
  const resetFilters = () => {
    setSearchTerm('');
    setDateRange({ from: null, to: null });
    setFilteredStockOuts(stockOuts);
    toast.info("รีเซ็ตการกรองข้อมูลแล้ว");
  }

  return (
    <Admintemplate>
      <Toaster richColors position="top-right" />
      <div className='size-full p-10 flex items-center justify-center'>
        <div className='bg-white size-full rounded-3xl'>
          <div className="mt-5 w-full h-[70px] px-6 flex items-center justify-between">
            <p className="text-3xl">ประวัติการเบิกสินค้า</p>
            <div className="flex gap-2">
              <Link href="/admin/addstockout">
                <Button className="py-2 px-4 bg-[#FFB8DA] hover:bg-[#fcc6e0]">
                  เบิกสินค้าใหม่
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchStockOuts}
                title="รีเฟรชข้อมูล"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full px-6 py-4">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาประวัติการเบิก (ชื่อวัตถุดิบ, พนักงาน, หมายเหตุ)..."
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
                          className="w-[240px] justify-between border-gray-300 bg-white hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-[#FFB8DA]" />
                            <span className="text-sm">
                              {dateRange.from && dateRange.to
                                ? `${format(dateRange.from, "d MMM", { locale: th })} - ${format(dateRange.to, "d MMM", { locale: th })}`
                                : "เลือกช่วงวันที่"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border rounded-md shadow-lg" align="start">
                        <div className="p-3 border-b border-gray-200 bg-[#FFF5F9]">
                          <div className="text-sm font-medium">เลือกช่วงวันที่</div>
                        </div>
                        <div className="p-2">
                          <Calendar
                            mode="range"
                            defaultMonth={dateRange.from || new Date()}
                            selected={dateRange}
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
                          />
                        </div>
                        <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDateRange({ from: null, to: null })}
                            className="text-xs h-7 border-gray-300"
                          >
                            ล้าง
                          </Button>
                          <div className="flex gap-1">
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
                                const start = startOfMonth(today);
                                const end = endOfMonth(today);
                                setDateRange({ from: start, to: end });
                              }}
                              className="text-xs h-7 border-gray-300"
                            >
                              เดือนนี้
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button 
                      type="submit" 
                      className="py-2 bg-[#FFB8DA] hover:bg-[#fcc6e0]"
                      onClick={handleSearch}
                    >
                      ค้นหา
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                      className="py-2"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      ล้างตัวกรอง
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-2 w-full px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">รายการประวัติการเบิกสินค้า</CardTitle>
                <CardDescription>
                  {dateRange.from && dateRange.to ? (
                    <span>
                      กรองข้อมูลตั้งแต่วันที่ {format(dateRange.from, "dd/MM/yyyy")} ถึง {format(dateRange.to, "dd/MM/yyyy")}
                    </span>
                  ) : (
                    <span>แสดงข้อมูลทั้งหมด</span>
                  )}
                  {searchTerm && <span> • ค้นหา: "{searchTerm}"</span>}
                  <span> • แสดง {filteredStockOuts.length} รายการจากทั้งหมด {stockOuts.length} รายการ</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-[#FFB8DA] border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-3 text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">รหัสนำออก</TableHead>
                          <TableHead className="w-[150px] md:w-[200px]">ชื่อสินค้า</TableHead>
                          <TableHead className="w-[75px] text-right">จำนวน</TableHead>
                          <TableHead className="w-[75px] text-right">หน่วย</TableHead>
                          <TableHead className="w-[150px]">พนักงาน</TableHead>
                          <TableHead className="w-[150px] text-right">วันที่ทำรายการ</TableHead>
                          <TableHead className="w-[150px] text-right">หมายเหตุ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStockOuts.length > 0 ? (
                          filteredStockOuts.map((stockOut) => (
                            <TableRow key={stockOut.TimeScriptionID}>
                              <TableCell className="font-medium">{stockOut.TimeScriptionID}</TableCell>
                              <TableCell>{stockOut.stock?.ingredientName || 'ไม่ระบุ'}</TableCell>
                              <TableCell className="text-right">{stockOut.Quantity}</TableCell>
                              <TableCell className="text-right">{stockOut.Unit}</TableCell>
                              <TableCell>
                                {stockOut.employee?.empFname} {stockOut.employee?.empLname}
                              </TableCell>
                              <TableCell className="text-right">
                                {stockOut.tsCreatedAt 
                                  ? new Date(stockOut.tsCreatedAt).toLocaleString('th-TH', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'ไม่ระบุ'
                                }
                              </TableCell>
                              <TableCell className="text-right">{stockOut.note || '-'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <XCircle className="h-12 w-12 text-gray-300 mb-3" />
                                <p className="font-medium">ไม่พบข้อมูลประวัติการเบิกสินค้า</p>
                                <p className="text-sm mt-1">ลองเปลี่ยนเงื่อนไขการค้นหาหรือช่วงวันที่</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Admintemplate>
  )
}

export default StockoutPage