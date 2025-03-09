// src/components/SuperAdmin/TopSellingPieChart.tsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// สีที่ใช้ในกราฟวงกลม - ชุดสีที่หลากหลายมากขึ้น
const COLORS = [
  '#FF6384', // แดงอมชมพู
  '#36A2EB', // ฟ้า
  '#FFCE56', // เหลือง
  '#4BC0C0', // เขียวอมฟ้า
  '#9966FF', // ม่วง
  '#FF9F40', // ส้ม
  '#C9CBCF', // เทา
  '#7ED321', // เขียว
  '#50E3C2', // เขียวมิ้นต์
  '#FF7675', // แดงอิฐ
  '#6C5CE7', // น้ำเงินอมม่วง
  '#FDCB6E'  // เหลืองทอง
];

interface TopSellingChartProps {
  loading: boolean;
  topProducts: any[];
}

const TopSellingPieChart: React.FC<TopSellingChartProps> = ({ loading, topProducts }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (topProducts && topProducts.length > 0) {
      // คำนวณข้อมูลสำหรับแสดงในกราฟวงกลม
      const pieData = prepareChartData(topProducts);
      setChartData(pieData);
    } else {
      // ถ้าไม่มีข้อมูลจริง ให้ใช้ข้อมูลตัวอย่าง
      const sampleData = [
        { name: 'หมูสไลซ์', value: 33 },
        { name: 'เนื้อสไลซ์', value: 25 },
        { name: 'กุ้ง', value: 18 },
        { name: 'เบียร์', value: 15 },
        { name: 'อื่นๆ', value: 9 }
      ];
      setChartData(sampleData);
    }
  }, [topProducts]);

  // ฟังก์ชันเตรียมข้อมูลสำหรับแสดงในกราฟวงกลม
  const prepareChartData = (products: any[]) => {
    // คัดเลือกสินค้าขายดี 5 อันดับแรก
    const topFiveProducts = products.slice(0, 5);
    
    // คำนวณยอดรวมทั้งหมด
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
    
    // คำนวณยอดรวมของสินค้า 5 อันดับแรก
    const topFiveQuantity = topFiveProducts.reduce((total, product) => total + product.quantity, 0);
    
    // คำนวณยอดสินค้าที่เหลือ (ถ้ามี)
    const otherQuantity = totalQuantity - topFiveQuantity;
    
    // สร้างข้อมูลสำหรับกราฟวงกลม
    const pieData = topFiveProducts.map(product => ({
      name: product.name,
      value: product.quantity
    }));
    
    // เพิ่มข้อมูล "อื่นๆ" ถ้ามีสินค้ามากกว่า 5 รายการ
    if (products.length > 5 && otherQuantity > 0) {
      pieData.push({
        name: 'อื่นๆ',
        value: otherQuantity
      });
    }
    
    return pieData;
  };

  // Custom tooltip สำหรับกราฟวงกลม
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
      const percent = ((payload[0].value / totalValue) * 100).toFixed(1);
      const bgColor = payload[0].payload.fill; // ใช้สีจากชิ้นส่วนของพาย
      
      return (
        <div className="bg-white p-3 border shadow-lg rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: bgColor }}
            />
            <p className="font-medium text-base">{payload[0].name}</p>
          </div>
          <p className="text-sm mt-1">
            จำนวนที่ขาย: <span className="font-medium">{payload[0].value.toLocaleString()}</span> รายการ
          </p>
          <p className="text-sm mt-1">
            สัดส่วน: <span className="font-medium">{percent}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-pink-500"></span>
          สัดส่วนสินค้าขายดี
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูลสินค้าขายดี</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={30} // เพิ่ม innerRadius เพื่อทำให้เป็นโดนัทกราฟ
                  fill="#FFB8DA"
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2} // เพิ่มระยะห่างระหว่างชิ้นส่วนของพาย
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  formatter={(value, entry, index) => (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSellingPieChart;