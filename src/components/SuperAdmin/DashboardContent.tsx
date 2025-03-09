"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { th } from 'date-fns/locale';

// สีสำหรับกราฟ
const COLORS = ['#4ADE80', '#FB923C', '#38BDF8'];

// กราฟวงกลมแสดงสถานะออเดอร์
const OrderStatusChart = ({ completedOrders, pendingOrders, cancelledOrders }: any) => {
  const total = completedOrders + pendingOrders + cancelledOrders;
  const completedPercent = total > 0 ? (completedOrders / total * 100).toFixed(0) : 0;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* วงแหวนพื้นหลัง */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          
          {/* วงแหวนแสดงสถานะ */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="10"
            strokeDasharray={`${completedPercent * 2.51} 251`}
            strokeLinecap="round"
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-sm">บิล</span>
        </div>
      </div>
    </div>
  );
};

const DashboardUI = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // สร้าง query string
        const queryString = `timeRange=${timeRange}&branch=${selectedBranch}`;
        
        // ดึงข้อมูลสรุปภาพรวม
        const dashboardResponse = await fetch(`/api/superadmin/dashboard/summary?${queryString}`);
        
        if (!dashboardResponse.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลภาพรวมได้');
        }
        
        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        setLoading(false);
        
        // แสดงข้อความแจ้งเตือน
        toast.error('ไม่สามารถโหลดข้อมูลได้', {
          description: error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง',
        });
      }
    };
    
    fetchData();
  }, [timeRange, selectedBranch]);
  
  // Handle branch change
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  // ฟังก์ชันจัดรูปแบบเงินบาท
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const queryString = `timeRange=${timeRange}&branch=${selectedBranch}`;
        const dashboardResponse = await fetch(`/api/superadmin/dashboard/summary?${queryString}`);
        
        if (dashboardResponse.ok) {
          const dashboardResult = await dashboardResponse.json();
          setDashboardData(dashboardResult);
        }
        
        setLoading(false);
        toast.success('รีเฟรชข้อมูลสำเร็จ');
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
        setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        setLoading(false);
        
        toast.error('ไม่สามารถรีเฟรชข้อมูลได้', {
          description: error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง',
        });
      }
    };
    
    fetchData();
  };
  
  // Custom tooltip สำหรับกราฟ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // แสดงสถานะการโหลด
  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB8DA]"></div>
        <span className="ml-3 text-gray-500">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }
  
  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
        <div className="text-red-500 text-3xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-red-800 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh}>ลองใหม่อีกครั้ง</Button>
      </div>
    );
  }

  // คำนวณข้อมูลสำหรับแสดงผล
  const totalSales = dashboardData?.summary?.totalSales || 0;
  const costAmount = dashboardData?.summary?.totalSales * 0.36 || 0; // สมมติว่าต้นทุนประมาณ 36% ของยอดขาย
  const profitAmount = totalSales - costAmount;
  const costPercent = totalSales > 0 ? (costAmount / totalSales * 100).toFixed(2) : "0";
  const profitPercent = totalSales > 0 ? (profitAmount / totalSales * 100).toFixed(2) : "0";
  
  const completedOrders = dashboardData?.summary?.completedOrders || 0;
  const pendingOrders = dashboardData?.summary?.pendingOrders || 0;
  const cancelledOrders = dashboardData?.summary?.cancelledOrders || 0;
  const completedSales = dashboardData?.summary?.completedSales || 0;
  const pendingSales = dashboardData?.summary?.pendingSales || 0;
  const cancelledSales = dashboardData?.summary?.cancelledSales || 0;

  return (
    <div className="space-y-6">
      {/* ส่วนหัวและตัวเลือก */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ภาพรวม</h1>
          <p className="text-gray-500">ข้อมูลรายได้และยอดขายของร้าน</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">สาขา</span>
          <Select 
            value={selectedBranch} 
            onValueChange={handleBranchChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="เลือกสาขา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">- ทั้งหมด -</SelectItem>
              <SelectItem value="central">สาขากลาง</SelectItem>
              <SelectItem value="north">สาขาเหนือ</SelectItem>
              <SelectItem value="south">สาขาใต้</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={timeRange} 
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 วันล่าสุด</SelectItem>
              <SelectItem value="30days">30 วันล่าสุด</SelectItem>
              <SelectItem value="90days">90 วันล่าสุด</SelectItem>
              <SelectItem value="year">1 ปีล่าสุด</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh}>
            รีเฟรช
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* การ์ดแสดงยอดขายรวม */}
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg text-gray-500">ยอดขายสุทธิ</h2>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-green-500">{formatCurrency(totalSales)}</span>
                  <span className="ml-1 text-gray-500">บาท</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>ต้นทุน ({costPercent}%)</span>
                    <span>{formatCurrency(costAmount)} บาท</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-300 rounded-full" 
                      style={{ width: `${costPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-orange-500 font-medium mt-1">{formatCurrency(costAmount)} บาท</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>กำไร ({profitPercent}%)</span>
                    <span>{formatCurrency(profitAmount)} บาท</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-300 rounded-full" 
                      style={{ width: `${profitPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-blue-500 font-medium mt-1">{formatCurrency(profitAmount)} บาท</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ยอดขาย</span>
                    <span>{formatCurrency(totalSales)} บาท</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ลดราคา</span>
                    <span>-0 บาท</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ลดท้ายบิล</span>
                    <span>-0 บาท</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ค่าบริการ</span>
                    <span>0 บาท</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ค่าจัดส่ง</span>
                    <span>0 บาท</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">ภาษี (7%)</span>
                    <span>0 บาท</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-2 border-t">
                <span className="text-gray-500">รวมสุทธิ</span>
                <span className="font-bold">{formatCurrency(totalSales)} บาท</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* การ์ดแสดงบิลปิดขาย */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg mb-4">บิลปิดขายแล้ว</h2>
            
            <OrderStatusChart 
              completedOrders={completedOrders}
              pendingOrders={pendingOrders}
              cancelledOrders={cancelledOrders}
            />
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-sm text-gray-500">ทำเสร็จ</span>
                </div>
                <p className="text-xl font-bold">{completedOrders} <span className="text-xs">บิล</span></p>
                <p className="text-xs text-gray-500">{formatCurrency(completedSales)} บาท</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                  <span className="text-sm text-gray-500">รอชำระเงิน</span>
                </div>
                <p className="text-xl font-bold">{pendingOrders} <span className="text-xs">บิล</span></p>
                <p className="text-xs text-gray-500">{formatCurrency(pendingSales)} บาท</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                  <span className="text-sm text-gray-500">การยกเลิก</span>
                </div>
                <p className="text-xl font-bold">{cancelledOrders} <span className="text-xs">บิล</span></p>
                <p className="text-xs text-gray-500">{formatCurrency(cancelledSales)} บาท</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* กราฟยอดขายรายวัน */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg mb-4">ยอดขายรายวัน</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData?.charts?.dailySales || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    try {
                      return format(new Date(date), 'yyyy-MM-dd');
                    } catch (e) {
                      return date;
                    }
                  }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="ยอดขาย" 
                  stroke="#38BDF8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* กราฟยอดขายแยกตามช่วงเวลา */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg mb-4">ยอดขายแยกตามช่วงเวลา</h2>
            <div className="flex justify-center space-x-2 mb-4">
              <Button variant="outline" size="sm" className="text-xs h-7">เวลาทั้งหมด</Button>
              <Button variant="outline" size="sm" className="text-xs h-7">เวลาปัจจุบัน</Button>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { time: '00', sales: 0 },
                    { time: '01', sales: 0 },
                    { time: '02', sales: 0 },
                    { time: '03', sales: 0 },
                    { time: '04', sales: 0 },
                    { time: '05', sales: 0 },
                    { time: '06', sales: 0 },
                    { time: '07', sales: 0 },
                    { time: '08', sales: 0 },
                    { time: '09', sales: 0 },
                    { time: '10', sales: 0 },
                    { time: '11', sales: 800 },
                    { time: '12', sales: 1200 },
                    { time: '13', sales: 1800 },
                    { time: '14', sales: 1400 },
                    { time: '15', sales: 1000 },
                    { time: '16', sales: 4200 },
                    { time: '17', sales: 3500 },
                    { time: '18', sales: 3200 },
                    { time: '19', sales: 5000 },
                    { time: '20', sales: 8000 },
                    { time: '21', sales: 0 },
                    { time: '22', sales: 0 },
                    { time: '23', sales: 0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} บาท`, 'ยอดขาย']} />
                  <Bar dataKey="sales" fill="#FFB8DA" barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* กราฟยอดขายแยกตามวัน */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg mb-4">ยอดขายแยกตามช่วงวัน</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: 'Sun', sales: 30000 },
                    { day: 'Mon', sales: 0 },
                    { day: 'Tue', sales: 0 },
                    { day: 'Wed', sales: 0 },
                    { day: 'Thu', sales: 0 },
                    { day: 'Fri', sales: 0 },
                    { day: 'Sat', sales: 0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} บาท`, 'ยอดขาย']} />
                  <Bar dataKey="sales" fill="#4ADE80" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardUI;