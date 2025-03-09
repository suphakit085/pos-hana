// src/app/superadmin/sales/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { Download } from 'lucide-react';
import { ArrowUp } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import { Search } from 'lucide-react';

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState("30days");
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chartView, setChartView] = useState("revenue");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRangeText, setDateRangeText] = useState("30 วันล่าสุด");

  // ฟังก์ชันสร้างข้อมูลจำลองสำหรับกราฟ
  const generateSampleData = (days) => {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const formattedDate = formatDateToYMD(date);
      const revenue = Math.floor(Math.random() * 10000) + 5000;
      const orders = Math.floor(Math.random() * 20) + 10;
      
      data.push({
        date: formattedDate,
        revenue,
        orders,
        avgOrderValue: Math.round(revenue / orders)
      });
    }
    
    return data;
  };

  // ฟังก์ชันจัดรูปแบบวันที่ (แบบไม่ใช้ date-fns)
  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ฟังก์ชันจัดรูปแบบวันที่แบบไทย
  const formatThaiDate = (dateStr) => {
    const months = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // ฟังก์ชันจัดรูปแบบวันที่แบบสั้น
  const formatShortDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  // อัพเดทข้อมูลเมื่อเปลี่ยนช่วงเวลา
  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      
      try {
        // ในระบบจริงควรดึงข้อมูลจาก API ตามช่วงเวลาที่เลือก
        // นี่เป็นเพียงข้อมูลจำลอง
        let days = 30;
        
        if (timeRange === '7days') {
          days = 7;
          setDateRangeText("7 วันล่าสุด");
        } else if (timeRange === '30days') {
          days = 30;
          setDateRangeText("30 วันล่าสุด");
        } else if (timeRange === '90days') {
          days = 90;
          setDateRangeText("90 วันล่าสุด");
        } else if (timeRange === 'year') {
          days = 365;
          setDateRangeText("1 ปีล่าสุด");
        }
        
        const data = generateSampleData(days);
        setSalesData(data);
        
        // คำนวณสรุปข้อมูล
        const total = data.reduce((sum, item) => sum + item.revenue, 0);
        const orders = data.reduce((sum, item) => sum + item.orders, 0);
        
        setTotalSales(total);
        setTotalOrders(orders);
        setAverageOrderValue(orders ? total / orders : 0);
        
        // คำนวณการเติบโต (เปรียบเทียบกับช่วงเวลาก่อนหน้า)
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        
        const firstHalfTotal = firstHalf.reduce((sum, item) => sum + item.revenue, 0);
        const secondHalfTotal = secondHalf.reduce((sum, item) => sum + item.revenue, 0);
        
        const growth = firstHalfTotal ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0;
        setSalesGrowth(growth);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
  }, [timeRange]);

  // ฟังก์ชันจัดรูปแบบเงินบาท
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  // เปลี่ยนช่วงเวลาที่เลือก
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  // ฟังก์ชันส่งออกข้อมูล
  const handleExportData = () => {
    // ในระบบจริงควรส่งคำขอไปยัง API เพื่อสร้างรายงานส่งออก
    alert("กำลังสร้างไฟล์รายงาน...");
  };

  // Custom tooltip สำหรับกราฟ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-medium">{formatThaiDate(label)}</p>
          {chartView === "revenue" && (
            <p className="text-blue-600">
              ยอดขาย: {formatCurrency(payload[0].value)}
            </p>
          )}
          {chartView === "orders" && (
            <p className="text-green-600">
              ออเดอร์: {payload[0].value.toLocaleString()}
            </p>
          )}
          {chartView === "average" && (
            <p className="text-purple-600">
              เฉลี่ย/ออเดอร์: {formatCurrency(payload[0].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // คำนวณวันที่เริ่มต้นและสิ้นสุดของช่วงเวลาที่เลือก
  const getDateRangeDisplay = () => {
    const now = new Date();
    const start = new Date(now);
    
    if (timeRange === '7days') {
      start.setDate(start.getDate() - 7);
    } else if (timeRange === '30days') {
      start.setDate(start.getDate() - 30);
    } else if (timeRange === '90days') {
      start.setDate(start.getDate() - 90);
    } else if (timeRange === 'year') {
      start.setFullYear(start.getFullYear() - 1);
    }
    
    const startText = `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()}`;
    const endText = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    
    return `${startText} - ${endText}`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">รายงานยอดขาย</h1>
        <Button onClick={handleExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          ดาวน์โหลดรายงาน
        </Button>
      </div>
      
      {/* ส่วนสรุปข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">ยอดขายรวม</p>
            <h2 className="text-3xl font-bold mt-2">{formatCurrency(totalSales)}</h2>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {salesGrowth >= 0 ? <ArrowUp className="h-4 w-4 inline mr-1" /> : <ArrowDown className="h-4 w-4 inline mr-1" />}
                {Math.abs(salesGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">จากช่วงก่อนหน้า</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">จำนวนออเดอร์</p>
            <h2 className="text-3xl font-bold mt-2">{totalOrders.toLocaleString()}</h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">มูลค่าเฉลี่ยต่อออเดอร์</p>
            <h2 className="text-3xl font-bold mt-2">{formatCurrency(averageOrderValue)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">ช่วงเวลา</p>
            <h2 className="text-xl font-bold mt-2">{getDateRangeDisplay()}</h2>
          </CardContent>
        </Card>
      </div>
      
      {/* ส่วนตัวกรองและการค้นหา */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={timeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ช่วงเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 วันล่าสุด</SelectItem>
                  <SelectItem value="30days">30 วันล่าสุด</SelectItem>
                  <SelectItem value="90days">90 วันล่าสุด</SelectItem>
                  <SelectItem value="year">1 ปีล่าสุด</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRangeText}
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาตามคำสำคัญ..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Button onClick={() => setSearchTerm('')}>
                ค้นหา
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ส่วนแสดงกราฟ */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>แนวโน้มยอดขาย</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={chartView === "revenue" ? "default" : "outline"} 
                onClick={() => setChartView("revenue")}
                size="sm"
              >
                ยอดขาย
              </Button>
              <Button 
                variant={chartView === "orders" ? "default" : "outline"} 
                onClick={() => setChartView("orders")}
                size="sm"
              >
                จำนวนออเดอร์
              </Button>
              <Button 
                variant={chartView === "average" ? "default" : "outline"} 
                onClick={() => setChartView("average")}
                size="sm"
              >
                เฉลี่ยต่อออเดอร์
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => formatShortDate(date)}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    chartView === "orders" 
                      ? value.toLocaleString() 
                      : formatCurrency(value).replace('฿', '')
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {chartView === "revenue" && (
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="ยอดขาย"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {chartView === "orders" && (
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="จำนวนออเดอร์"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {chartView === "average" && (
                  <Line
                    type="monotone"
                    dataKey="avgOrderValue"
                    name="เฉลี่ยต่อออเดอร์"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      {/* ส่วนแสดงข้อมูลรายวัน */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลรายวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">วันที่</th>
                  <th className="text-right p-2">ยอดขาย</th>
                  <th className="text-right p-2">ออเดอร์</th>
                  <th className="text-right p-2">เฉลี่ย/ออเดอร์</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4">กำลังโหลดข้อมูล...</td>
                  </tr>
                ) : (
                  salesData
                    .filter(item => 
                      !searchTerm || 
                      item.date.includes(searchTerm) || 
                      item.revenue.toString().includes(searchTerm) ||
                      item.orders.toString().includes(searchTerm)
                    )
                    .map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-2">{formatThaiDate(item.date)}</td>
                        <td className="text-right p-2">{formatCurrency(item.revenue)}</td>
                        <td className="text-right p-2">{item.orders}</td>
                        <td className="text-right p-2">{formatCurrency(item.revenue / item.orders)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}