"use client";

import Link from "next/link";
import { BedDouble, DollarSign, KeyRound, UserPlus, Users } from "lucide-react";
import KpiCard from "./KpiCard";
import FeeStatusChart from "./FeeStatusChart";
import HostelOccupancy from "./HostelOccupancy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useData } from "@/lib/data-context";
import AdmissionChart from "./AdmissionChart";
import HostelChart from "./HostelChart";
import { useState } from "react";
import TeacherCredentials from "./TeacherCredentials";
import AdmissionRequests from "./AdmissionRequests";
import JobApplications from "./JobApplications";
import NoticeBoard from "./NoticeBoard";

export default function AdminDashboard() {
    const { students, fees, hostelRooms } = useData();
    const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
    const totalStudents = students.length;
    const feesDue = fees.filter(f => f.status === 'Due' || f.status === 'Overdue').length;
    const occupancyRate = (hostelRooms.reduce((acc, room) => acc + room.occupants.length, 0) / hostelRooms.reduce((acc, room) => acc + room.capacity, 0) * 100).toFixed(0);

  return (
    <>
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Students"
          icon={<Users className="h-6 w-6" />}
          value={totalStudents.toString()}
          description="Across all classes"
          onClick={() => alert('Displaying all students...')}
        />
        <KpiCard
          title="Fees Due"
          icon={<DollarSign className="h-6 w-6" />}
          value={feesDue.toString()}
          description="Students with pending payments"
          onClick={() => alert('Displaying students with due fees...')}
        />
        <KpiCard
          title="Hostel Occupancy"
          icon={<BedDouble className="h-6 w-6" />}
          value={`${occupancyRate}%`}
          description="Current hostel occupancy rate"
          onClick={() => alert('Opening hostel details...')}
        />
        <KpiCard
          title="Generate Credentials"
          icon={<KeyRound className="h-6 w-6" />}
          value="New Teacher"
          description="Create login for new staff"
          onClick={() => setIsCredentialsOpen(true)}
        />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <NoticeBoard userRole="Admin" />
        </div>
        <div className="flex flex-col gap-6">
            <AdmissionRequests />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <JobApplications />
        </div>
        <div className="lg:col-span-1">
            <HostelOccupancy />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeeStatusChart />
        <AdmissionChart />
        <HostelChart />
      </div>

       <div className="grid gap-6">
         <Card className="flex flex-col items-center justify-center p-6 bg-accent text-accent-foreground">
            <UserPlus className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-bold font-headline text-center mb-2">New Admissions</h3>
            <p className="text-sm text-center mb-4">Generate and manage new student admission forms.</p>
            <Link href="/admissions">
                <Button>Go to Admissions</Button>
            </Link>
        </Card>
      </div>
    </div>
    <TeacherCredentials open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen} />
    </>
  );
}
