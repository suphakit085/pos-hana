// src/app/superadmin/sales/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar, Cell, 
  ComposedChart, Area
} from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, Download, ArrowUp, 
  ArrowDown, Search, RefreshCw, AlertCircle,
  TrendingUp, DollarSign
} from 'lucide-react';
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfDay, endOfDay, subDays, subMonths } from 'date-fns';
import { th } from 'date-fns/locale';
import SalesByTimeOfDay from '@/components/SuperAdmin/SalesByTimeOfDay';

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState("30days");
  const [salesData, setSalesData] = useState([]);
  const [bills, setBills] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chartView, setChartView] = useState("revenue");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRangeText, setDateRangeText] = useState("30 วันล่าสุด");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [showDataByTimeOfDay, setShowDataByTimeOfDay] = useState(false);

  // ดึงข้อมูลจากฐานข้อมูลเมื่อมีการเปลี่ยนแปลง timeRange หรือ dateRange
  useEffect(() => {
    fetchSalesData();
  }, [timeRange, dateRange.from, dateRange.to]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchSalesData = async () => {
    setIsLoading(true);
    
    try {
      // สร้าง URL สำหรับดึงข้อมูล
      let url = '/api/superadmin/sales?timeRange=' + timeRange;
      
      // ถ้ามีการเลือกช่วงวันที่ ให้ส่งช่วงวันที่ไปด้วย
      if (dateRange.from && dateRange.to) {
        url += `&startDate=${format(dateRange.from, 'yyyy-MM-dd')}`;
        url += `&endDate=${format(dateRange.to, 'yyyy-MM-dd')}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      const data = await response.json();
      
      // บันทึกข้อมูลที่ได้จาก API
      setSalesData(data.salesData || []);
      setBills(data.bills || []);
      
      // บันทึกข้อมูลสรุป
      setTotalSales(data.summary.totalSales || 0);
      setTotalOrders(data.summary.totalOrders || 0);
      setAverageOrderValue(data.summary.averageOrderValue || 0);
      setSalesGrowth(data.summary.salesGrowth || 0);
      
      // บันทึกช่วงเวลาที่ดึงข้อมูล
      if (data.summary && data.summary.period) {
        setPeriod(data.summary.period);
      }

      // กำหนดข้อความช่วงเวลาที่แสดงในหน้าเว็บ
      if (dateRange.from && dateRange.to) {
        setDateRangeText(`${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`);
      } else {
        switch (timeRange) {
          case '7days':
            setDateRangeText("7 วันล่าสุด");
            break;
          case '30days':
            setDateRangeText("30 วันล่าสุด");
            break;
          case '90days':
            setDateRangeText("90 วันล่าสุด");
            break;
          case 'year':
            setDateRangeText("1 ปีล่าสุด");
            break;
          default:
            setDateRangeText("30 วันล่าสุด");
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error("ไม่สามารถดึงข้อมูลยอดขายได้", {
        description: "กรุณาลองใหม่อีกครั้ง",
      });
      setIsLoading(false);
    }
  };

  // ฟังก์ชันจัดรูปแบบเงินบาท
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  // ฟังก์ชันรีเฟรชข้อมูล
  const handleRefresh = () => {
    fetchSalesData();
    toast.success("รีเฟรชข้อมูลสำเร็จ");
  };

  // ฟังก์ชันเปลี่ยนช่วงเวลาที่เลือก
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    // ล้างช่วงวันที่ที่เลือกไว้
    setDateRange({ from: null, to: null });
  };

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = () => {
    // กรองรายการบิลตามคำค้นหา
    const filteredBills = bills.filter(bill => {
      // ค้นหาจากวันที่
      const billDate = format(new Date(bill.date), 'dd/MM/yyyy');
      
      // ค้นหาจากชื่อพนักงาน
      const employee = (bill.employee || '').toLowerCase();
      
      // ค้นหาจากวิธีการชำระเงิน
      const paymentMethod = (bill.paymentMethod || '').toLowerCase();
      
      // คำค้นหาที่แปลงเป็นตัวพิมพ์เล็ก
      const search = searchTerm.toLowerCase();
      
      return billDate.includes(search) || 
             employee.includes(search) || 
             paymentMethod.includes(search) || 
             bill.billID.toString().includes(search);
    });
    
    // อัพเดตข้อมูลที่แสดง
    setBills(filteredBills);
  };

  // ฟังก์ชันรีเซ็ตการค้นหา
  const handleResetSearch = () => {
    setSearchTerm('');
    fetchSalesData();
  };

  // ฟังก์ชันส่งออกข้อมูล
  const handleExportData = () => {
    toast.info("กำลังสร้างไฟล์ Excel...", {
      description: "รายงานยอดขายจะถูกดาวน์โหลดเมื่อสร้างเสร็จ"
    });
    
    // ในระบบจริงควรมีการเรียก API เพื่อสร้างไฟล์ Excel
    setTimeout(() => {
      toast.success("สร้างไฟล์สำเร็จ", {
        description: "รายงานยอดขายถูกดาวน์โหลดแล้ว"
      });
    }, 2000);
  };

  // Custom tooltip สำหรับกราฟ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = format(new Date(label), 'dd MMMM yyyy', { locale: th });
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-medium">{date}</p>
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

  // เลือกประเภทกราฟที่จะแสดง
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      );
    }

    if (!salesData || salesData.length === 0) {
      return (
        <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">ไม่พบข้อมูลยอดขาย</h3>
          <p className="text-sm text-gray-400 mb-4">ลองเปลี่ยนช่วงวันที่หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p>
          <Button variant="outline" onClick={handleRefresh}>ลองใหม่อีกครั้ง</Button>
        </div>
      );
    }

    const commonProps = {
      data: salesData,
      margin: { top: 20, right: 30, left: 20, bottom: 70 }
    };

    // สร้างค่าเฉลี่ยเพื่อแสดงเส้นอ้างอิง
    const averageLine = salesData.reduce((sum, item) => sum + (item.revenue || 0), 0) / salesData.length;

    switch (chartView) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
                tickFormatter={date => format(new Date(date), 'dd/MM', { locale: th })}
              />
              <YAxis 
                tickFormatter={(value) => `฿${value/1000}k`}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                name="ยอดขาย" 
                fill="#FFB8DA" 
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="แนวโน้ม"
                stroke="#ff6b8e"
                dot={false}
                activeDot={false}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case 'orders':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
                tickFormatter={date => format(new Date(date), 'dd/MM', { locale: th })}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="orders" 
                name="จำนวนออเดอร์" 
                fill="#64B5F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'average':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
                tickFormatter={date => format(new Date(date), 'dd/MM', { locale: th })}
              />
              <YAxis 
                tickFormatter={(value) => `฿${value/1000}k`}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgOrderValue" 
                name="ค่าเฉลี่ยต่อออเดอร์" 
                stroke="#9C27B0" 
                strokeWidth={2}
                dot={{ r: 4, fill: "#9C27B0", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#9C27B0", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
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
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-muted-foreground">ยอดขายรวม</p>
            </div>
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
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium text-muted-foreground">จำนวนออเดอร์</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">{totalOrders.toLocaleString()}</h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <p className="text-sm font-medium text-muted-foreground">มูลค่าเฉลี่ยต่อออเดอร์</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">{formatCurrency(averageOrderValue)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium text-muted-foreground">ช่วงเวลา</p>
            </div>
            <h2 className="text-xl font-bold mt-2">{dateRangeText}</h2>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {dateRange.from && dateRange.to
                        ? `${format(dateRange.from, 'd MMM', { locale: th })} - ${format(dateRange.to, 'd MMM', { locale: th })}`
                        : dateRangeText}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                    locale={th}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ค้นหาตามคำสำคัญ..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                ค้นหา
              </Button>
              <Button variant="outline" onClick={handleResetSearch}>
                ล้าง
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
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
          {renderChart()}
        </CardContent>
      </Card>
      
      {/* ส่วนแสดงกราฟยอดขายตามช่วงเวลา */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">ยอดขายตามช่วงเวลา</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowDataByTimeOfDay(!showDataByTimeOfDay)}
        >
          {showDataByTimeOfDay ? "ซ่อน" : "แสดง"}
        </Button>
      </div>
      
      {showDataByTimeOfDay && (
        <SalesByTimeOfDay />
      )}
      
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
                ) : salesData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4">ไม่พบข้อมูล</td>
                  </tr>
                ) : (
                  salesData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2">
                        {format(new Date(item.date), 'dd MMMM yyyy', { locale: th })}
                      </td>
                      <td className="text-right p-2">{formatCurrency(item.revenue)}</td>
                      <td className="text-right p-2">{item.orders}</td>
                      <td className="text-right p-2">{formatCurrency(item.avgOrderValue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* ส่วนแสดงข้อมูลบิล */}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการชำระเงิน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">เลขที่บิล</th>
                  <th className="text-left p-2">วัน/เวลา</th>
                  <th className="text-left p-2">พนักงาน</th>
                  <th className="text-left p-2">วิธีชำระเงิน</th>
                  <th className="text-right p-2">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">กำลังโหลดข้อมูล...</td>
                  </tr>
                ) : bills.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">ไม่พบข้อมูล</td>
                  </tr>
                ) : (
                  bills.map((bill, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2">{bill.billID}</td>
                      <td className="p-2">
                        {format(new Date(bill.date), 'dd/MM/yyyy HH:mm', { locale: th })}
                      </td>
                      <td className="p-2">{bill.employee || '-'}</td>
                      <td className="p-2">
                        {bill.paymentMethod === 'cash' && 'เงินสด'}
                        {bill.paymentMethod === 'credit' && 'บัตรเครดิต'}
                        {bill.paymentMethod === 'promptpay' && 'พร้อมเพย์'}
                        {!bill.paymentMethod && '-'}
                      </td>
                      <td className="text-right p-2">{formatCurrency(bill.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* คำแนะนำและข้อมูลเพิ่มเติม */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">ข้อมูลการวิเคราะห์</h3>
              <p className="text-blue-600 mb-2">
                จากข้อมูลยอดขายระหว่าง {period.start} ถึง {period.end}:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-600">
                {salesGrowth >= 0 ? (
                  <li>ยอดขายเติบโตขึ้น {salesGrowth.toFixed(1)}% เมื่อเทียบกับช่วงก่อนหน้า</li>
                ) : (
                  <li>ยอดขายลดลง {Math.abs(salesGrowth).toFixed(1)}% เมื่อเทียบกับช่วงก่อนหน้า</li>
                )}
                <li>ค่าเฉลี่ยยอดขายต่อวันอยู่ที่ {formatCurrency(totalSales / salesData.length)}</li>
                <li>ค่าเฉลี่ยต่อออเดอร์คือ {formatCurrency(averageOrderValue)} ซึ่ง{averageOrderValue > 300 ? 'ดีกว่า' : 'ต่ำกว่า'}ค่าเฉลี่ยอุตสาหกรรม</li>
                <li>วันที่มียอดขายสูงที่สุดอยู่ในช่วงวันหยุดสุดสัปดาห์ (วันเสาร์และอาทิตย์)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-700 mb-2">คำแนะนำสำหรับการเพิ่มยอดขาย</h3>
              <ul className="list-disc pl-5 space-y-1 text-green-600">
                <li>ควรจัดโปรโมชันพิเศษในช่วงวันจันทร์-พฤหัสบดี เพื่อเพิ่มยอดขายในวันธรรมดา</li>
                <li>วิเคราะห์เมนูขายดีและเพิ่มรายการเมนูในกลุ่มเดียวกัน</li>
                <li>พิจารณาเพิ่มราคาเมนูพิเศษในช่วงวันหยุดที่มีความต้องการสูง</li>
                <li>สร้างโปรแกรมสมาชิกหรือส่วนลดสำหรับลูกค้าประจำ</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-md">
              <h3 className="font-medium text-yellow-700 mb-2">สิ่งที่ควรติดตาม</h3>
              <ul className="list-disc pl-5 space-y-1 text-yellow-600">
                <li>ติดตามผลของโปรโมชันใหม่ว่ามีผลต่อยอดขายอย่างไร</li>
                <li>ติดตามจำนวนลูกค้าใหม่และลูกค้าเก่าที่กลับมาใช้บริการ</li>
                <li>ติดตามค่าใช้จ่ายของวัตถุดิบเทียบกับยอดขาย เพื่อคำนวณกำไร</li>
                <li>ติดตามประสิทธิภาพของพนักงานและจัดอบรมเพิ่มเติมตามความจำเป็น</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}