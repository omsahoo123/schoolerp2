"use client";

import { useState } from "react";
import { BookOpen, CalendarCheck, KeyRound, Users } from "lucide-react";
import KpiCard from "./KpiCard";
import AttendanceLogger from "./AttendanceLogger";
import StudentCredentials from "./StudentCredentials";
import Homework from "./Homework";
import { useData } from "@/lib/data-context";

export default function TeacherDashboard() {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const { students } = useData();

  // Example data for a specific teacher
  const assignedClasses = ["10A", "11A"];
  const totalStudents = students.filter(s => assignedClasses.includes(`${s.class}${s.section}`)).length;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard
          title="Log Attendance"
          icon={<CalendarCheck className="h-6 w-6" />}
          value="Today's Log"
          description="Mark student attendance"
          onClick={() => setIsAttendanceOpen(true)}
          className="bg-card text-card-foreground"
        />
        <KpiCard
          title="Total Students"
          icon={<Users className="h-6 w-6" />}
          value={totalStudents.toString()}
          description="In your classes"
        />
        <KpiCard
          title="Manage Homework"
          icon={<BookOpen className="h-6 w-6" />}
          value="Assign & Review"
          description="Click card below"
        />
        <KpiCard
          title="Generate Credentials"
          icon={<KeyRound className="h-6 w-6" />}
          value="New Student"
          description="Create login for new students"
          onClick={() => setIsCredentialsOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1">
        <Homework isTeacher={true} />
      </div>

      <AttendanceLogger open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen} />
      <StudentCredentials open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen} />
    </>
  );
}
