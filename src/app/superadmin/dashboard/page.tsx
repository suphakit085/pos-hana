// src/app/superadmin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react';

// สีที่ใช้ในกราฟวงกลม
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9146FF'];

export default function SuperAdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ในระบบจริงควรเรียกข้อมูลจาก API
    // นี่เป็นเพียงข้อมูลตัวอย่าง
    const fetchDashboardData = async () => {
      try {
        // สร้างข้อมูลจำลอง
        setTotalRevenue(586420);
        setTotalCustomers(1248);
        setTotalOrders(3567);
        setAverageOrderValue(164.4);
        
        // ข้อมูลยอดขายรายวัน
        setSalesData([
          { name: 'จันทร์', revenue: 45000 },
          { name: 'อังคาร', revenue: 52000 },
          { name: 'พุธ', revenue: 49000 },
          { name: 'พฤหัสบดี', revenue: 63000 },
          { name: 'ศุกร์', revenue: 78000 },
          { name: 'เสาร์', revenue: 95000 },
          { name: 'อาทิตย์', revenue: 92000 },
        ]);
        
        // ข้อมูลสินค้าขายดี
        setTopProducts([
          { name: 'เนื้อวากิว A5', value: 235 },
          { name: 'เนื้อออสเตรเลีย', value: 187 },
          { name: 'หมูสไลด์', value: 162 },
          { name: 'ทะเลรวม', value: 134 },
          { name: 'ลูกชิ้นเกาหลี', value: 98 },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB8DA]"></div>
      </div>
    );
  }

  // ฟังก์ชันสำหรับแปลงตัวเลขเป็นรูปแบบเงินบาท
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
      
      {/* การ์ดสรุปข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">รายได้ทั้งหมด</p>
                <h2 className="text-3xl font-bold">{formatCurrency(totalRevenue)}</h2>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">จำนวนลูกค้า</p>
                <h2 className="text-3xl font-bold">{totalCustomers.toLocaleString()}</h2>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">จำนวนออเดอร์</p>
                <h2 className="text-3xl font-bold">{totalOrders.toLocaleString()}</h2>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ค่าเฉลี่ยต่อออเดอร์</p>
                <h2 className="text-3xl font-bold">{formatCurrency(averageOrderValue)}</h2>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* กราฟยอดขายรายวัน */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>ยอดขายรายวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `฿${value/1000}k`} />
                <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'ยอดขาย']} />
                <Legend />
                <Bar dataKey="revenue" name="ยอดขาย" fill="#FFB8DA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* กราฟ 10 อันดับสินค้าขายดี */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>5 อันดับสินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} รายการ`, 'จำนวนที่ขายได้']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>5 อันดับสินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topProducts}
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} รายการ`, 'จำนวนที่ขายได้']} />
                  <Bar dataKey="value" name="จำนวนที่ขายได้" fill="#8884d8" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}