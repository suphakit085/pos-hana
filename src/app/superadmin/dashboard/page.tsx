// src/app/superadmin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { DollarSign, Users, ShoppingBag, TrendingUp, Menu } from 'lucide-react';

// สีที่ใช้ในกราฟวงกลม
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9146FF'];

export default function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // ดึงข้อมูลแดชบอร์ดหลัก
        const dashboardResponse = await fetch('/api/superadmin/dashboard');
        
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        let data = await dashboardResponse.json();
        
        // ดึงข้อมูลจำนวนลูกค้าแยกต่างหาก
        try {
          const customerResponse = await fetch('/api/superadmin/customers/count');
          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            console.log("Customer data from separate endpoint:", customerData);
            
            // อัพเดทข้อมูลจำนวนลูกค้าในข้อมูลแดชบอร์ด
            if (data.stats) {
              data = {
                ...data,
                stats: {
                  ...data.stats,
                  totalCustomers: customerData.count || 0
                }
              };
            }
          }
        } catch (customerError) {
          console.error('Error fetching customer count:', customerError);
          // ถ้าดึงข้อมูลลูกค้าไม่ได้ ก็ใช้ข้อมูลเดิมไปก่อน
        }
        
        console.log("Dashboard data to be displayed:", data);
        setDashboardData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('ไม่สามารถดึงข้อมูลแดชบอร์ดได้');
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FFB8DA] text-black rounded-md hover:bg-[#fcc6e0]"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ไม่พบข้อมูล</h2>
          <p className="text-gray-700 mb-4">ไม่พบข้อมูลแดชบอร์ด</p>
        </div>
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

  // ข้อมูลสำหรับการแสดงผล
  const { stats, charts } = dashboardData;

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
                <h2 className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</h2>
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
                <h2 className="text-3xl font-bold">{(stats.totalCustomers || 0).toLocaleString()} คน</h2>
                <p className="text-xs text-gray-500 mt-1">จำนวนลูกค้าทั้งหมดที่เข้าใช้บริการ</p>
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
                <h2 className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</h2>
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
                <h2 className="text-3xl font-bold">{formatCurrency(stats.averageOrderValue)}</h2>
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
              <BarChart data={charts.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `฿${value/1000}k`} />
                <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'ยอดขาย']} />
                <Legend />
                <Bar dataKey="revenue" name="ยอดขาย" fill="#FFB8DA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* กราฟยอดขายตามวันในสัปดาห์ */}
      <Card>
        <CardHeader>
          <CardTitle>ยอดขายตามวันในสัปดาห์</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.salesByDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `฿${value/1000}k`} />
                <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'ยอดขาย']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="ยอดขาย" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* กราฟสินค้าขายดี */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {charts.topProducts.map((entry, index) => (
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
            <CardTitle>สินค้าขายดี (จำนวนที่ขายได้)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={charts.topProducts}
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

      {/* ตารางสรุปข้อมูลสินค้าขายดี */}
      <Card>
        <CardHeader>
          <CardTitle>รายการสินค้าขายดี</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนที่ขาย</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดขายรวม</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {charts.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.value.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(product.value * (product.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}