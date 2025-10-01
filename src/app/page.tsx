"use client";

import {
  Activity,
  BedDouble,
  BookOpen,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/erp/AdminDashboard";
import TeacherDashboard from "@/components/erp/TeacherDashboard";
import StudentDashboard from "@/components/erp/StudentDashboard";
import FinanceDashboard from "@/components/erp/FinanceDashboard";
import Header from "@/components/erp/Header";
import Sidebar from "@/components/erp/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 mb-6">
              <TabsTrigger value="admin" className="py-2">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="teacher" className="py-2">
                <GraduationCap className="mr-2 h-4 w-4" />
                Teacher
              </TabsTrigger>
              <TabsTrigger value="student" className="py-2">
                <User className="mr-2 h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="finance" className="py-2">
                <DollarSign className="mr-2 h-4 w-4" />
                Finance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="teacher">
              <TeacherDashboard />
            </TabsContent>
            <TabsContent value="student">
              <StudentDashboard />
            </TabsContent>
            <TabsContent value="finance">
              <FinanceDashboard />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
