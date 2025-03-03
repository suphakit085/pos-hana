"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react"

// สร้าง interface สำหรับข้อมูลการจอง
interface Booking {
  id: string
  customerName: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
  peopleCount: number
  location: string
}

export default function TodayBookings() {
  // จำลองข้อมูลการจองของวันนี้
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      customerName: "คุณสมชาย ใจดี",
      time: "09:30",
      status: "confirmed",
      peopleCount: 3,
      location: "โต๊ะ T01"
    },
    {
      id: "2",
      customerName: "คุณสมหญิง รักสวย",
      time: "11:00",
      status: "confirmed",
      peopleCount: 1,
      location: "โต๊ะ T02"
    },
    {
      id: "3",
      customerName: "คุณวิชัย มั่งมี",
      time: "13:30",
      status: "confirmed",
      peopleCount: 2,
      location: "โต๊ะ T03"
    },
    {
      id: "4",
      customerName: "คุณพิมพ์ใจ งามเลิศ",
      time: "16:00",
      status: "cancelled",
      peopleCount: 4,
      location: "โต๊ะ T04"
    },
    {
      id: "5",
      customerName: "คุณพิมพ์ใจ งามเลิศ",
      time: "16:00",
      status: "cancelled",
      peopleCount: 4,
      location: "โต๊ะ T04"
    },
  ])

  // ฟังก์ชันเพื่อจัดการสีของ Badge ตามสถานะการจอง
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // ฟังก์ชันเพื่อแปลสถานะเป็นภาษาไทย
  const translateStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "ยืนยันแล้ว"
      case "pending":
        return "รอการยืนยัน"
      case "cancelled":
        return "ยกเลิกแล้ว"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto py-2">
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                
                <div>
                  <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {translateStatus(booking.status)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>จำนวน {booking.peopleCount} คน</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full justify-end">

                  <Button className="px-3 py-2" variant="destructive">
                    ยกเลิกการจอง
                  </Button>
                
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}