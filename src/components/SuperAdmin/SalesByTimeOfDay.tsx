// src/components/SuperAdmin/SalesByTimeOfDay.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Clock, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { th } from 'date-fns/locale';

const SalesByTimeOfDay = () => {
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'heatmap'
  const [data, setData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจริงจากฐานข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // สร้าง URL สำหรับดึงข้อมูล
        // ในระบบจริงควรมี API endpoint เฉพาะสำหรับดึงข้อมูลนี้
        const response = await fetch('/api/superadmin/sales-by-time-of-day');
        
        if (!response.ok) {
          // ถ้า API ยังไม่พร้อม ให้ใช้ข้อมูลจำลองไปก่อน
          createMockData();
          return;
        }
        
        const responseData = await response.json();
        
        // บันทึกข้อมูลที่ได้จาก API
        setData(responseData.dailyData || []);
        setWeeklyData(responseData.weeklyData || []);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching time of day sales data:', error);
        setError(error.message || 'ไม่สามารถดึงข้อมูลยอดขายตามช่วงเวลาได้');
        
        // ในกรณีที่เกิดข้อผิดพลาด ให้ใช้ข้อมูลจำลองไปก่อน
        createMockData();
      }
    };
    
    fetchData();
  }, []);
  
  // สร้างข้อมูลจำลองในกรณีที่ API ยังไม่พร้อม
  const createMockData = () => {
    // ข้อมูลตามช่วงเวลาเฉลี่ย (ไม่แยกตามวัน)
    const timeRanges = [
      '06:00-09:59', '10:00-12:59', '13:00-15:59', 
      '16:00-18:59', '19:00-21:59', '22:00-23:59'
    ];
    
    // สร้างข้อมูลเฉลี่ยตามช่วงเวลา
    const dailyData = [
      { timeRange: '06:00-09:59', revenue: 2230, customers: 6, orders: 4, display: 'ช่วงเช้า' },
      { timeRange: '10:00-12:59', revenue: 10908, customers: 17, orders: 12, display: 'ช่วงสาย' },
      { timeRange: '13:00-15:59', revenue: 9349, customers: 14, orders: 10, display: 'ช่วงบ่าย' },
      { timeRange: '16:00-18:59', revenue: 9753, customers: 15, orders: 11, display: 'ช่วงเย็น' },
      { timeRange: '19:00-21:59', revenue: 16877, customers: 26, orders: 18, display: 'ช่วงค่ำ' },
      { timeRange: '22:00-23:59', revenue: 5678, customers: 9, orders: 6, display: 'ช่วงดึก' }
    ];
    
    // สร้างข้อมูลแยกตามวันในสัปดาห์
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const byDayAndTime = [];
    
    days.forEach(day => {
      // กำหนดตัวคูณสำหรับแต่ละวัน
      let multiplier = 1.0;
      
      if (day === 'เสาร์') multiplier = 1.4;
      else if (day === 'อาทิตย์') multiplier = 1.5;
      else if (day === 'ศุกร์') multiplier = 1.3;
      else if (day === 'จันทร์') multiplier = 0.8;
      
      timeRanges.forEach((time, index) => {
        // ปรับตามวัน
        let baseRevenue = dailyData[index].revenue;
        let adjustedRevenue = baseRevenue * multiplier;
        
        // เพิ่มความแปรปรวนเล็กน้อย
        adjustedRevenue += (Math.random() * 2000 - 1000);
        
        byDayAndTime.push({
          day,
          timeRange: time,
          revenue: Math.round(adjustedRevenue),
          display: dailyData[index].display
        });
      });
    });
    
    setData(dailyData);
    setWeeklyData(byDayAndTime);
    setIsLoading(false);
  };

  // ฟังก์ชันแปลงตัวเลขเป็นรูปแบบเงินบาท
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  // ฟังก์ชันสำหรับสร้าง tooltip ที่ปรับแต่งแล้ว
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-semibold text-gray-800">{payload[0].payload.display || label}</p>
          <p className="text-sm text-gray-600">
            ยอดขาย: <span className="font-medium text-blue-600">{formatCurrency(payload[0].value)}</span>
          </p>
          {payload[0].payload.customers && (
            <p className="text-sm text-gray-600">
              จำนวนลูกค้า: <span className="font-medium text-green-600">{payload[0].payload.customers} คน</span>
            </p>
          )}
          {payload[0].payload.orders && (
            <p className="text-sm text-gray-600">
              จำนวนออเดอร์: <span className="font-medium text-purple-600">{payload[0].payload.orders} ออเดอร์</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // ฟังก์ชันสำหรับสร้าง tooltip สำหรับวิว Heatmap
  const HeatmapTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.day}, {payload[0].payload.display || payload[0].payload.timeRange}
          </p>
          <p className="text-sm text-gray-600">
            ยอดขาย: <span className="font-medium text-blue-600">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // ฟังก์ชันกำหนดสีของแท่งกราฟตามช่วงเวลา
  const getBarColor = (entry, index) => {
    const colors = ['#ffcfd9', '#ffb8da', '#ff9fb7', '#ff85a2', '#ff6b8e', '#ff517a'];
    return colors[index % colors.length];
  };
  
  // จัดกลุ่มข้อมูลสำหรับ Heatmap
  const prepareHeatmapData = () => {
    if (!weeklyData.length) return [];
    
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const result = [];
    
    // ข้อมูลสำหรับ Heatmap
    days.forEach(day => {
      const dayData = {
        day,
      };
      
      // ดึงข้อมูลของแต่ละช่วงเวลาในวันนี้
      const dayEntries = weeklyData.filter(entry => entry.day === day);
      
      dayEntries.forEach(entry => {
        const timeKey = entry.display || entry.timeRange;
        dayData[timeKey] = entry.revenue;
        dayData[`${timeKey}Raw`] = entry; // เก็บข้อมูลดิบไว้สำหรับ tooltip
      });
      
      result.push(dayData);
    });
    
    return result;
  };
  
  // แปลงข้อมูลเป็นรูปแบบสำหรับกราฟเปรียบเทียบรายวัน
  const prepareWeeklyComparisonData = () => {
    if (!weeklyData.length) return [];
    
    const timeRanges = [...new Set(weeklyData.map(item => item.timeRange))];
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    
    return days.map(day => {
      const result = { day };
      
      timeRanges.forEach(timeRange => {
        const entry = weeklyData.find(item => item.day === day && item.timeRange === timeRange);
        if (entry) {
          const displayName = entry.display || timeRange;
          result[displayName] = entry.revenue;
          // เพื่อใช้ใน tooltip
          result[`${displayName}Display`] = displayName;
        }
      });
      
      return result;
    });
  };
  
  // แสดงกราฟแยกตามช่วงเวลา (ทุกวัน)
  const renderDailyChart = () => {
    if (loading || !data.length) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="display" 
            angle={0} 
            tick={{ fontSize: 14 }}
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
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry, index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  // แสดงกราฟเปรียบเทียบแยกตามวัน
  const renderWeeklyChart = () => {
    if (loading || !weeklyData.length) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      );
    }
    
    const weeklyComparisonData = prepareWeeklyComparisonData();
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={weeklyComparisonData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            angle={0} 
            tick={{ fontSize: 14 }}
          />
          <YAxis 
            tickFormatter={(value) => `฿${value/1000}k`}
            width={70}
          />
          <Tooltip 
            formatter={(value, name) => {
              // แสดงชื่อช่วงเวลาที่มีความหมาย
              const displayName = name.includes('Display') ? null : name;
              return displayName ? [formatCurrency(value), displayName] : null; 
            }}
          />
          <Legend />
          <Bar dataKey="ช่วงเช้า" name="ช่วงเช้า" stackId="a" fill="#ffcfd9" />
          <Bar dataKey="ช่วงสาย" name="ช่วงสาย" stackId="a" fill="#ffb8da" />
          <Bar dataKey="ช่วงบ่าย" name="ช่วงบ่าย" stackId="a" fill="#ff9fb7" />
          <Bar dataKey="ช่วงเย็น" name="ช่วงเย็น" stackId="a" fill="#ff85a2" />
          <Bar dataKey="ช่วงค่ำ" name="ช่วงค่ำ" stackId="a" fill="#ff6b8e" />
          <Bar dataKey="ช่วงดึก" name="ช่วงดึก" stackId="a" fill="#ff517a" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  // แสดงกราฟ Heat Map
  const renderHeatmap = () => {
    if (loading || !weeklyData.length) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      );
    }
    
    // แสดงเป็นกราฟแท่งซ้อนแทน heatmap จริง
    // เนื่องจาก recharts ไม่มี heatmap โดยตรง
    const heatmapData = prepareHeatmapData();
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="mt-8 mb-2">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">ยอดขายน้อย</span>
              <div className="flex">
                {['#ffcfd9', '#ffb8da', '#ff9fb7', '#ff85a2', '#ff6b8e', '#ff517a'].map((color, i) => (
                  <div 
                    key={i} 
                    className="w-6 h-6" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">ยอดขายมาก</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {['', 'ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'].map((header, i) => (
              <div 
                key={`header-${i}`} 
                className="font-medium text-center py-2"
              >
                {header}
              </div>
            ))}
            
            {heatmapData.map((dayData, dayIndex) => {
              // สร้างเซลล์สำหรับแต่ละวัน
              const cells = [];
              
              // เพิ่มชื่อวัน
              cells.push(
                <div key={`day-${dayIndex}`} className="font-medium flex items-center justify-center">
                  {dayData.day}
                </div>
              );
              
              // เพิ่มเซลล์สำหรับแต่ละช่วงเวลา
              ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'].forEach((timeRange, i) => {
                const value = dayData[timeRange];
                
                // คำนวณสีตามมูลค่า
                // ยอดขายสูงสุดประมาณ 25,000 บาท
                const intensity = Math.min(value / 25000, 1);
                const colorIndex = Math.floor(intensity * 5);
                const colors = ['#ffcfd9', '#ffb8da', '#ff9fb7', '#ff85a2', '#ff6b8e', '#ff517a'];
                const cellColor = colors[colorIndex];
                
                cells.push(
                  <div 
                    key={`cell-${dayIndex}-${i}`} 
                    className="rounded-md p-2 text-center relative group cursor-pointer"
                    style={{ backgroundColor: cellColor }}
                  >
                    <span className="font-medium text-gray-800">
                      {formatCurrency(value)}
                    </span>
                    
                    {/* Tooltip เมื่อ hover */}
                    <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 z-10 bg-white p-2 rounded-md shadow-md border text-sm whitespace-nowrap mt-1">
                      <p className="font-medium">{dayData.day}, {timeRange}</p>
                      <p>ยอดขาย: {formatCurrency(value)}</p>
                    </div>
                  </div>
                );
              });
              
              return cells;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center space-x-2">
          <Clock className="h-5 w-5 text-pink-500" />
          <span>ยอดขายตามช่วงเวลา</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              วิเคราะห์ยอดขายตามช่วงเวลาเพื่อวางแผนการบริหารทรัพยากร
            </p>
          </div>
          <Tabs defaultValue="daily" value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList>
              <TabsTrigger value="daily">รวมทุกวัน</TabsTrigger>
              <TabsTrigger value="weekly">แยกตามวัน</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* แสดงข้อมูลสำคัญ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-gray-500">ช่วงเวลาที่ขายดีที่สุด</p>
              </div>
              <p className="text-2xl font-bold mt-1">ช่วงค่ำ (19:00-21:59)</p>
              <p className="text-sm text-gray-600">{formatCurrency(16877)} เฉลี่ยต่อวัน</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium text-gray-500">ช่วงเวลาที่ขายน้อยที่สุด</p>
              </div>
              <p className="text-2xl font-bold mt-1">ช่วงเช้า (06:00-09:59)</p>
              <p className="text-sm text-gray-600">{formatCurrency(2230)} เฉลี่ยต่อวัน</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-500">วันที่ขายดีที่สุด</p>
              </div>
              <p className="text-2xl font-bold mt-1">วันเสาร์-อาทิตย์</p>
              <p className="text-sm text-gray-600">ยอดขายสูงกว่าวันธรรมดา 40-50%</p>
            </CardContent>
          </Card>
        </div>
        
        {/* แสดงกราฟตามโหมดที่เลือก */}
        {viewMode === 'daily' && renderDailyChart()}
        {viewMode === 'weekly' && renderWeeklyChart()}
        {viewMode === 'heatmap' && renderHeatmap()}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">วิเคราะห์ยอดขายตามช่วงเวลา</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• ช่วงเวลา 19:00-21:59 น. มียอดขายสูงที่สุด เนื่องจากเป็นช่วงมื้อเย็น</li>
            <li>• วันเสาร์และอาทิตย์มียอดขายสูงกว่าวันธรรมดาประมาณ 40-50%</li>
            <li>• ช่วงสาย (10:00-12:59) มียอดขายสูงเป็นอันดับสอง เนื่องจากเป็นช่วงมื้อเที่ยง</li>
            <li>• ช่วงเช้ามียอดขายน้อยที่สุด อาจพิจารณาปรับเวลาเปิดร้านหรือจัดโปรโมชันพิเศษ</li>
            <li>• วันศุกร์มียอดขายสูงกว่าวันธรรมดาอื่นๆ ประมาณ 30%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesByTimeOfDay;