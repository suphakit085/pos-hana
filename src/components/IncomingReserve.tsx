//src\components\IncomingReserve.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon } from "lucide-react"

interface Reservation {
  resID: string | number; // Accept both string and number types
  resName: string;
  resPhone: string;
  resTime: string;
  numberOfPeople: number;
  Tables_tabID: string;
  resStatus: string;
}

export default function IncomingReserve() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (timeStr: string) => {
    try {
      if (!timeStr) return 'เวลาไม่ถูกต้อง';

      // กรณีที่เป็น ISO string (เช่น "1970-01-01T20:00:00")
      if (timeStr.includes('T')) {
        const timePart = timeStr.split('T')[1];
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes} น.`;
      }

      // กรณีที่เป็น MySQL time format (HH:mm:ss)
      const [hours, minutes] = timeStr.split(':');
      if (hours && minutes) {
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} น.`;
      }

      throw new Error('Unsupported time format');
    } catch (error) {
      console.error('Error formatting time:', error, timeStr);
      return 'เวลาไม่ถูกต้อง';
    }
  };

  const fetchTodayReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching today\'s reservations...');
      const response = await fetch('/api/reservations/today');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch today's reservations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received reservations data:', data);
      
      // Ensure data is an array
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching today\'s reservations:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const completeReservation = async (resID: string | number) => {
    try {
      console.log(`Completing reservation with ID: ${resID}`);
      const response = await fetch(`/api/reservations/${resID}`, {
        method: 'DELETE', // This will trigger soft delete
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Complete reservation response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to complete reservation: ${response.status}`);
      }

      const result = await response.json();
      console.log('Complete reservation result:', result);

      fetchTodayReservations(); // Refresh the list after completion
    } catch (error) {
      console.error('Error completing reservation:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete reservation');
    }
  };

  useEffect(() => {
    fetchTodayReservations();
    // Refresh data every minute
    const interval = setInterval(fetchTodayReservations, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-2 h-auto">
        <div className="text-center p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-2 h-auto">
        <div className="text-center p-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="container mx-auto py-2 h-auto">
        <div className="text-center p-4">ไม่มีการจองสำหรับวันนี้</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 h-auto">
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.resID} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-lg">{reservation.resName}</CardTitle>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                ยืนยันแล้ว
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center text-sm">
                  <PhoneIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{reservation.resPhone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(reservation.resTime)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>จำนวน {reservation.numberOfPeople} คน</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>โต๊ะ {reservation.Tables_tabID}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full justify-end">
                <Button 
                  className="px-3 py-2 bg-[#28a745]"
                  onClick={() => completeReservation(reservation.resID)}
                >
                  เสร็จสิ้น
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}