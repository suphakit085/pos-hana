// src/components/SuperAdmin/ProductCategoryPieChart.tsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// สีที่ใช้ในกราฟวงกลม
const COLORS = ['#FFB8DA', '#FF85C0', '#FF5AA7', '#FF2F8E', '#FF0075', '#D60063', '#AD0050', '#84003D', '#5B002A', '#330018'];

interface CategoryChartProps {
  loading: boolean;
}

const ProductCategoryPieChart: React.FC<CategoryChartProps> = ({ loading }) => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // เรียก API เพื่อดึงข้อมูลสินค้าตามหมวดหมู่
        const response = await fetch('/api/superadmin/products/categories');
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่สินค้าได้');
        }
        
        const data = await response.json();
        setCategoryData(data);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('ไม่สามารถโหลดข้อมูลหมวดหมู่สินค้าได้');
        
        // สร้างข้อมูลตัวอย่างเพื่อแสดงในกรณีที่ไม่สามารถดึงข้อมูลจริงได้
        const sampleData = [
          { name: 'อาหาร', value: 42 },
          { name: 'เครื่องดื่ม', value: 18 },
          { name: 'ของหวาน', value: 15 },
          { name: 'ซีฟู้ด', value: 13 },
          { name: 'เนื้อสัตว์', value: 12 }
        ];
        setCategoryData(sampleData);
      }
    };

    if (!loading) {
      fetchCategoryData();
    }
  }, [loading]);

  // Custom tooltip สำหรับกราฟวงกลม
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            จำนวน: <span className="font-medium">{payload[0].value}</span> รายการ
          </p>
          <p className="text-sm">
            สัดส่วน: <span className="font-medium">{(payload[0].percent * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">สัดส่วนสินค้าตามหมวดหมู่</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#FFB8DA"
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCategoryPieChart;