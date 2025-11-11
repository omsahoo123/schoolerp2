"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { parseISO } from "date-fns";
import { useData } from "@/lib/data-context";

type AttendanceViewProps = {
  studentId: string;
};

export default function AttendanceView({ studentId }: AttendanceViewProps) {
  const { studentAttendance } = useData();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const attendanceData = studentAttendance.find(sa => sa.studentId === studentId);

  const presentDays = attendanceData?.records
    .filter(r => r.status === 'Present')
    .map(r => parseISO(r.date)) || [];
  
  const absentDays = attendanceData?.records
    .filter(r => r.status === 'Absent')
    .map(r => parseISO(r.date)) || [];

  const holidayDays = attendanceData?.records
    .filter(r => r.status === 'Holiday')
    .map(r => parseISO(r.date)) || [];

  const totalPresent = presentDays.length;
  const totalAbsent = absentDays.length;
  const totalWorkingDays = totalPresent + totalAbsent;
  const attendancePercentage = totalWorkingDays > 0 ? (totalPresent / totalWorkingDays) * 100 : 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">My Attendance</CardTitle>
        <CardDescription>
          Overall Attendance: <span className="font-bold" style={{ color: attendancePercentage >= 75 ? 'hsl(var(--success))' : 'hsl(var(--warning))'}}>{attendancePercentage.toFixed(1)}%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-0"
          modifiers={{
            present: presentDays,
            absent: absentDays,
            holiday: holidayDays,
          }}
          modifiersStyles={{
            present: { 
              color: 'hsl(var(--success-foreground))', 
              backgroundColor: 'hsl(var(--success))'
            },
            absent: { 
              color: 'hsl(var(--destructive-foreground))', 
              backgroundColor: 'hsl(var(--destructive))'
            },
            holiday: {
              color: 'hsl(var(--warning-foreground))',
              backgroundColor: 'hsl(var(--warning))',
            },
          }}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full" style={{backgroundColor: 'hsl(var(--success))'}} />
            <span className="text-sm">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full" style={{backgroundColor: 'hsl(var(--destructive))'}} />
            <span className="text-sm">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full" style={{backgroundColor: 'hsl(var(--warning))'}} />
            <span className="text-sm">Holiday</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
