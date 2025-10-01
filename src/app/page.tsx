"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/erp/AdminDashboard";
import TeacherDashboard from "@/components/erp/TeacherDashboard";
import StudentDashboard from "@/components/erp/StudentDashboard";
import FinanceDashboard from "@/components/erp/FinanceDashboard";
import Header from "@/components/erp/Header";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true";
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setAuthenticated(true);
      setUserRole(sessionStorage.getItem("userRole"));
    }
  }, [router]);

  if (!authenticated || !userRole) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  const renderDashboard = () => {
    switch(userRole) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Teacher':
        return <TeacherDashboard />;
      case 'Student':
        return <StudentDashboard />;
      case 'Finance':
        return <FinanceDashboard />;
      default:
        // For simplicity, redirect to login if role is invalid
        router.push('/login');
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
