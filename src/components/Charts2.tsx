// app/dashboard/orders/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrdersPage() {
  const orders = [
    { name: 'ลูกค้าหน้าร้าน', value: 10, percentage: 50, color: '#FFCE80' },
    { name: 'ลูกค้าจองหน้าเว็บ', value: 10, percentage: 25, color: '#8B8FFF' },
    { name: 'ยกเลิกการจอง', value: 30, percentage: 10, color: '#80E2E0' },
  ]
  
  const totalOrders = orders.reduce((sum, order) => sum + order.value, 0)

  return (
    <div className="container mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-indigo-600">
            รายงานลูกค้า
          </CardTitle>
          <Select defaultValue="number">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number of orders</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.name} className="flex items-center gap-4">
                  <div 
                    className={`w-full p-4 rounded-md flex justify-between items-center`}
                    style={{ backgroundColor: order.name === 'ลูกค้าหน้าร้าน' ? '#FFF8EC' : 
                                            order.name === 'ลูกค้าจองหน้าเว็บ' ? '#F0F1FF' : 
                                            '#EDFBFB' }}
                  >
                    <span className={`text-sm font-medium`}
                          style={{ color: order.name === 'ลูกค้าหน้าร้าน' ? '#B07B1C' : 
                                          order.name === 'ลูกค้าจองหน้าเว็บ' ? '#5258BE' : 
                                          '#25A3A1' }}>
                      {order.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{order.value} Orders</span>
                      <span className="font-medium text-gray-500">{order.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orders}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {orders.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold">{totalOrders}</span>
                <span className="text-gray-500">Orders</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}