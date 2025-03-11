"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import { getHours, setHours } from "date-fns";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const handleTimeChange = (newDate: Date | undefined) => {
    if (!newDate) return; // ถ้า newDate เป็น undefined ก็ไม่ต้องทำอะไร
  
    const hours = getHours(newDate);
    if (hours >= 10 && hours <= 21) {
      setDate(newDate);
    } else {
      // Reset to the closest valid time if out of range
      if (hours < 10) {
        setDate(setHours(newDate, 10));
      } else if (hours > 21) {
        setDate(setHours(newDate, 21));
      }
    }
  };  

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          ชั่วโมง
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={handleTimeChange}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          นาที
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={handleTimeChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}