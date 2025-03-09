"use client";
// src/app/superadmin/dashboard/page.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { toast, Toaster } from "sonner";

export default function SuperadminDashboard() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [totalSales, setTotalSales] = useState<number>(0);
  const [costAmount, setCostAmount] = useState<number>(0);
  const [profitAmount, setProfitAmount] = useState<number>(0);
  const [costPercent, setCostPercent] = useState<number>(0);
  const [profitPercent, setProfitPercent] = useState<number>(0);
  const [dailySalesData, setDailySalesData] = useState<any[]>([]);
  const [weeklySalesData, setWeeklySalesData] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [cancelledOrders, setCancelledOrders] = useState<number>(0);
  const [completedSales, setCompletedSales] = useState<number>(0);
  const [pendingSales, setPendingSales] = useState<number>(0);
  const [cancelledSales, setCancelledSales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    percentAvailable: 0,
    bestSellingProduct: '',
    bestSellingProductPercent: 0,
    bestCategory: '',
    bestCategoryPercent: 0
  });
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    averageSpendPerCustomer: 0,
    averageBillAmount: 0
  });
  const [tableStats, setTableStats] = useState({
    totalTablesUsed: 0,
    averageTimePerTable: 0,
    customersPerTable: 0,
    ordersPerTable: 0,
    maxTimePerTable: 0,
    maxOrdersPerTable: 0
  });
  const [staffActivities, setStaffActivities] = useState({
    profileEdits: 0,
    tableLayoutEdits: 0,
    menuEdits: 0,
    billsOpened: 0,
    ordersPlaced: 0,
    transactions: 0,
    returnBills: 0,
    cancelledItems: 0,
    total: 0
  });
  
  // รูปแบบตัวเลขเป็นเงินบาท
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('฿', '');
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. ดึงข้อมูลยอดขายและกำไร
        const salesResponse = await fetch('/api/superadmin/sales');
        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          setTotalSales(salesData.totalSales || 0);
          setCostAmount(salesData.totalCosts || 0);
          setProfitAmount(salesData.totalProfit || 0);
          
          // คำนวณเปอร์เซ็นต์ต้นทุนและกำไร
          if (salesData.totalSales > 0) {
            const costPercentage = (salesData.totalCosts / salesData.totalSales) * 100;
            const profitPercentage = (salesData.totalProfit / salesData.totalSales) * 100;
            setCostPercent(parseFloat(costPercentage.toFixed(2)));
            setProfitPercent(parseFloat(profitPercentage.toFixed(2)));
          }
        }
        
        // 2. ดึงข้อมูลออเดอร์
        const ordersResponse = await fetch('/api/superadmin/orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setCompletedOrders(ordersData.completedOrders || 0);
          setPendingOrders(ordersData.pendingOrders || 0);
          setCancelledOrders(ordersData.cancelledOrders || 0);
          setCompletedSales(ordersData.completedSales || 0);
          setPendingSales(ordersData.pendingSales || 0);
          setCancelledSales(ordersData.cancelledSales || 0);
        }
        
        // 3. ดึงข้อมูลยอดขายตามช่วงเวลา
        const timeSeriesResponse = await fetch('/api/superadmin/salesbytime');
        if (timeSeriesResponse.ok) {
          const timeSeriesData = await timeSeriesResponse.json();
          setDailySalesData(timeSeriesData.hourlySales || []);
          setWeeklySalesData(timeSeriesData.dailySales || []);
        }
        
        // 4. ดึงข้อมูลสินค้า
        const productsResponse = await fetch('/api/superadmin/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          
          // 4.1 สถิติสินค้า
          setProductStats({
            totalProducts: productsData.totalProducts || 0,
            availableProducts: productsData.availableProducts || 0,
            percentAvailable: productsData.percentAvailable || 0,
            bestSellingProduct: productsData.bestSellingProduct?.name || 'ไม่มีข้อมูล',
            bestSellingProductPercent: productsData.bestSellingProduct?.percent || 0,
            bestCategory: productsData.bestCategory?.name || 'ไม่มีข้อมูล',
            bestCategoryPercent: productsData.bestCategory?.percent || 0
          });
          
          // 4.2 สินค้าขายดี
          setTopProducts(productsData.topProducts || []);
        }
        
        // 5. ดึงข้อมูลลูกค้า
        const customersResponse = await fetch('/api/superadmin/customers');
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomerStats({
            totalCustomers: customersData.totalCustomers || 0,
            averageSpendPerCustomer: customersData.averageSpendPerCustomer || 0,
            averageBillAmount: customersData.averageBillAmount || 0
          });
        }
        
        // 6. ดึงข้อมูลโต๊ะ
        const tablesResponse = await fetch('/api/superadmin/tables');
        if (tablesResponse.ok) {
          const tablesData = await tablesResponse.json();
          setTableStats({
            totalTablesUsed: tablesData.totalTablesUsed || 0,
            averageTimePerTable: tablesData.averageTimePerTable || 0,
            customersPerTable: tablesData.customersPerTable || 0,
            ordersPerTable: tablesData.ordersPerTable || 0,
            maxTimePerTable: tablesData.maxTimePerTable || 0,
            maxOrdersPerTable: tablesData.maxOrdersPerTable || 0
          });
        }
        
        // 7. ดึงข้อมูลกิจกรรมพนักงาน
        const staffResponse = await fetch('/api/superadmin/staff');
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          setStaffActivities({
            profileEdits: staffData.profileEdits || 0,
            tableLayoutEdits: staffData.tableLayoutEdits || 0,
            menuEdits: staffData.menuEdits || 0,
            billsOpened: staffData.billsOpened || 0,
            ordersPlaced: staffData.ordersPlaced || 0,
            transactions: staffData.transactions || 0,
            returnBills: staffData.returnBills || 0,
            cancelledItems: staffData.cancelledItems || 0,
            total: staffData.total || 0
          });
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("ไม่สามารถโหลดข้อมูลแดชบอร์ดได้");
        
        // กรณีที่ไม่สามารถโหลดข้อมูลได้ ให้ใช้ข้อมูลตัวอย่าง (เพื่อการพัฒนา)
        setMockData();
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [selectedBranch]);

  // สำหรับอัพเดทการเลือกสาขา
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    toast.info(`กำลังโหลดข้อมูลสาขา: ${value === 'all' ? 'ทั้งหมด' : value}`);
  };

  // คำนวณเปอร์เซ็นต์สำเร็จของออเดอร์
  const calculateCompletionRate = () => {
    const total = completedOrders + pendingOrders + cancelledOrders;
    return total > 0 ? Math.round((completedOrders / total) * 100) : 0;
  };
  
  // ตั้งค่าข้อมูลตัวอย่างในกรณีไม่สามารถโหลดข้อมูลจริงได้
  const setMockData = () => {
    // 1. ยอดขายและกำไร
    setTotalSales(30459);
    setCostAmount(10942);
    setProfitAmount(19517);
    setCostPercent(35.92);
    setProfitPercent(64.08);
    
    // 2. ข้อมูลออเดอร์
    setCompletedOrders(29);
    setPendingOrders(3);
    setCancelledOrders(0);
    setCompletedSales(29869);
    setPendingSales(590);
    setCancelledSales(0);
    
    // 3. ข้อมูลยอดขายตามช่วงเวลา
    setDailySalesData([
      { day: '00', sales: 0 }, { day: '01', sales: 0 }, { day: '02', sales: 0 },
      { day: '03', sales: 0 }, { day: '04', sales: 0 }, { day: '05', sales: 0 },
      { day: '06', sales: 0 }, { day: '07', sales: 0 }, { day: '08', sales: 0 },
      { day: '09', sales: 0 }, { day: '10', sales: 0 }, { day: '11', sales: 800 },
      { day: '12', sales: 1200 }, { day: '13', sales: 1800 }, { day: '14', sales: 1400 },
      { day: '15', sales: 1000 }, { day: '16', sales: 4200 }, { day: '17', sales: 3500 },
      { day: '18', sales: 3200 }, { day: '19', sales: 5000 }, { day: '20', sales: 8000 },
      { day: '21', sales: 0 }, { day: '22', sales: 0 }, { day: '23', sales: 0 }
    ]);
    
    setWeeklySalesData([
      { day: 'Sun', sales: 30000 }, { day: 'Mon', sales: 0 }, { day: 'Tue', sales: 0 },
      { day: 'Wed', sales: 0 }, { day: 'Thu', sales: 0 }, { day: 'Fri', sales: 0 },
      { day: 'Sat', sales: 0 }
    ]);
    
    // 4. ข้อมูลสินค้า
    setProductStats({
      totalProducts: 33,
      availableProducts: 13,
      percentAvailable: 39.39,
      bestSellingProduct: 'หมูสไลซ์',
      bestSellingProductPercent: 57.89,
      bestCategory: 'อาหาร',
      bestCategoryPercent: 85.32
    });
    
    setTopProducts([
      { id: 1, name: 'หมูสไลซ์', quantity: 77, amount: 17633 },
      { id: 2, name: 'เนื้อสไลซ์', quantity: 19, amount: 6441 },
      { id: 3, name: 'รีเวอ', quantity: 106, amount: 3180 },
      { id: 4, name: 'หมูเด้งโต', quantity: 6, amount: 954 },
      { id: 5, name: 'เบียร์สิงห์', quantity: 8, amount: 720 },
      { id: 6, name: 'ชุดหมูกลับบ้าน', quantity: 2, amount: 500 },
      { id: 7, name: 'หมูเด้งเล็ก', quantity: 2, amount: 258 },
      { id: 8, name: 'เบียร์ช้าง', quantity: 3, amount: 240 },
      { id: 9, name: 'ชุดน้ำจิ้ม', quantity: 7, amount: 203 },
      { id: 10, name: 'เบียร์ลีโอ', quantity: 2, amount: 170 }
    ]);
    
    // 5. ข้อมูลลูกค้า
    setCustomerStats({
      totalCustomers: 106,
      averageSpendPerCustomer: 287.35,
      averageBillAmount: 951.84
    });
    
    // 6. ข้อมูลโต๊ะ
    setTableStats({
      totalTablesUsed: 103,
      averageTimePerTable: 1.22,
      customersPerTable: 3,
      ordersPerTable: 3,
      maxTimePerTable: 2.22,
      maxOrdersPerTable: 10
    });
    
    // 7. ข้อมูลกิจกรรมพนักงาน
    setStaffActivities({
      profileEdits: 0,
      tableLayoutEdits: 0,
      menuEdits: 0,
      billsOpened: 32,
      ordersPlaced: 32,
      transactions: 32,
      returnBills: 0,
      cancelledItems: 0,
      total: 96
    });
  };

  return (
    <div className="space-y-6">
      <Toaster richColors />
      
      {/* ส่วนหัวและตัวเลือกสาขา */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ภาพรวม</h1>
          <p className="text-gray-500">ข้อมูลรายได้และยอดขายของร้าน</p>
        </div>
        
      </div>
      
      {/* แจ้งเตือนล่าสุด */}
      
      {loading ? (
        // แสดงสถานะกำลังโหลด
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB8DA]"></div>
          <span className="ml-3 text-gray-500">กำลังโหลดข้อมูล...</span>
        </div>
      ) : (
        <>
          {/* บัตรสรุปยอดขาย */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">ยอดขายสุทธิ</h2>
                    <p className="text-4xl font-bold text-green-500">{formatCurrency(totalSales)} <span className="text-base text-gray-500">บาท</span></p>
                    
                    <div className="mt-8 space-y-2">
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full" 
                          style={{ width: `${profitPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ยอดขาย</span>
                        <p className="text-lg font-semibold">{formatCurrency(totalSales)} บาท</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ส่วนลด</span>
                        <p className="text-lg font-semibold">-0 บาท</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ลดท้ายบิล</span>
                        <p className="text-lg font-semibold">-0 บาท</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ค่าบริการ</span>
                        <p className="text-lg font-semibold">0 บาท</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ค่าจัดส่ง</span>
                        <p className="text-lg font-semibold">0 บาท</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">ภาษี (7%)</span>
                        <p className="text-lg font-semibold">0 บาท</p>
                      </div>
                    </div>
                    
                    <div className="text-right pt-4 border-t">
                      <span className="text-sm text-gray-500">รวมสุทธิ</span>
                      <p className="text-lg font-semibold">{formatCurrency(totalSales)} บาท</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* บัตรสรุปสถานะออเดอร์ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">บิลปิดขายแล้ว</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-gray-100" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-green-500" 
                        strokeWidth="10" 
                        strokeDasharray={`${calculateCompletionRate() * 2.51} 251`}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{calculateCompletionRate()}</span>
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center border-r">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-sm text-gray-500">ทำเสร็จ</span>
                    </div>
                    <p className="text-3xl font-bold text-center">{completedOrders} <span className="text-xs">บิล</span></p>
                    <p className="text-xs text-gray-500">{formatCurrency(completedSales)} บาท</p>
                  </div>
                  
                  <div className="text-center border-r">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-sm text-gray-500">รอชำระเงิน</span>
                    </div>
                    <p className="text-3xl font-bold text-center">{pendingOrders} <span className="text-xs">บิล</span></p>
                    <p className="text-xs text-gray-500">{formatCurrency(pendingSales)} บาท</p>
                  </div>
                  
                  
                </div>
              </CardContent>
            </Card>
            
            {/* บัตรสรุปวิธีชำระเงิน */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">วิธีชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500">เงินสด</p>
                    <p className="text-3xl font-bold text-center mt-2">0 <span className="text-xs">บาท</span></p>
                    <p className="text-xs text-gray-500">จำนวน 0 บิล</p>
                  </div>
                  
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500">ค้างชำระ</p>
                    <p className="text-3xl font-bold text-center mt-2">0 <span className="text-xs">บาท</span></p>
                    <p className="text-xs text-gray-500">จำนวน 0 บิล</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* กราฟข้อมูลยอดขาย */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ยอดขายรายชั่วโมง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} บาท`, 'ยอดขาย']}
                      labelFormatter={(value) => `เวลา ${value}:00 น.`}
                    />
                    <Bar dataKey="sales" fill="#FF9F40" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* กราฟยอดขายรายวันในสัปดาห์ */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ยอดขายแยกตามช่วงวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} บาท`, 'ยอดขาย']}
                    />
                    <Bar dataKey="sales" fill="#4CAF50" barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* แถวบัตรข้อมูลสินค้า */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* บัตรข้อมูลสินค้า */}
            <Card>
              <CardHeader className="pb-2 flex justify-between items-center">
                <CardTitle className="text-lg">สินค้า</CardTitle>
                <Button className="bg-teal-500 hover:bg-teal-600 h-8 px-3 py-1 text-xs">ดูเพิ่มเติม</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-sm font-medium">สินค้าทั้งหมด</p>
                    <p className="text-xl font-bold mt-1">{productStats.availableProducts}/{productStats.totalProducts} <span className="text-xs font-normal">หน่วย</span></p>
                    <p className="text-xs text-gray-500 mt-1">คิดเป็นร้อยละ: {productStats.percentAvailable}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-sm font-medium">สินค้าขายดี</p>
                    <p className="text-xl font-bold mt-1">{productStats.bestSellingProduct}</p>
                    <p className="text-xs text-gray-500 mt-1">คิดเป็นร้อยละ: {productStats.bestSellingProductPercent}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-sm font-medium">หมวดหมู่ขายดี</p>
                    <p className="text-xl font-bold mt-1">{productStats.bestCategory}</p>
                    <p className="text-xs text-gray-500 mt-1">คิดเป็นร้อยละ: {productStats.bestCategoryPercent}%</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-base font-medium mb-3">10 อันดับสินค้าขายดี</p>
                  <div className="space-y-2">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-600">
                          <th className="text-left font-medium pb-2">สินค้า</th>
                          <th className="text-right font-medium pb-2"><span className="sr-only">จำนวน</span></th>
                          <th className="text-right font-medium pb-2"><span className="sr-only">ยอดขาย</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.slice(0, 5).map((product, idx) => (
                          <tr key={product.id}>
                            <td className="py-1">
                              <div className="flex items-center">
                                <div className={`${idx < 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs`}>
                                  {idx + 1}
                                </div>
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td className="text-right">{product.quantity}</td>
                            <td className="text-right">{product.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            
          </div>
        </>
      )}
    </div>
  );
}