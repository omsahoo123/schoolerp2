"use client";

import { BookOpen, CalendarDays, CheckCircle, Percent } from "lucide-react";
import KpiCard from "./KpiCard";
import AttendanceView from "./AttendanceView";
import Homework from "./Homework";
import { students as mockStudents, studentAttendance as mockAttendance } from "@/lib/data";

export default function StudentDashboard() {
  // Mocking a logged-in student
  const loggedInStudent = mockStudents.find(s => s.id === 'S004'); // Myra Kumar

  if (!loggedInStudent) {
    return <p>Student not found.</p>;
  }

  const attendanceData = mockAttendance.find(sa => sa.studentId === loggedInStudent.id);
  const totalPresent = attendanceData?.records.filter(r => r.status === 'Present').length || 0;
  const totalAbsent = attendanceData?.records.filter(r => r.status === 'Absent').length || 0;
  const totalWorkingDays = totalPresent + totalAbsent;
  const attendancePercentage = totalWorkingDays > 0 ? (totalPresent / totalWorkingDays) * 100 : 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline">Welcome, {loggedInStudent.name}!</h2>
        <p className="text-muted-foreground">Here's your dashboard for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Attendance"
          icon={<Percent className="h-6 w-6" />}
          value={`${attendancePercentage.toFixed(1)}%`}
          description="Your overall attendance"
        />
        <KpiCard
          title="Days Present"
          icon={<CheckCircle className="h-6 w-6" />}
          value={totalPresent.toString()}
          description="Total classes attended"
        />
        <KpiCard
          title="Days Absent"
          icon={<CalendarDays className="h-6 w-6" />}
          value={totalAbsent.toString()}
          description="Total classes missed"
        />
        <KpiCard
          title="Homework"
          icon={<BookOpen className="h-6 w-6" />}
          value="Check list"
          description="View pending assignments"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Homework studentClass={loggedInStudent.class} studentSection={loggedInStudent.section} />
        </div>
        <div className="lg:col-span-1">
          <AttendanceView studentId={loggedInStudent.id} />
        </div>
      </div>
    </div>
  );
}
