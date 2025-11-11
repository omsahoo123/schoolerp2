
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useData } from "@/lib/data-context";

type NavLink = {
    href: string;
    label: string;
};

const navLinksByRole: Record<string, NavLink[]> = {
    Admin: [
        { href: "/", label: "Dashboard" },
        { href: "/admissions", label: "Admissions" },
    ],
    Teacher: [
        { href: "/", label: "Dashboard" },
    ],
    Student: [
        { href: "/", label: "Dashboard" },
    ],
    Finance: [
        { href: "/", label: "Dashboard" },
    ],
};

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const { students } = useData();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("https://picsum.photos/seed/110/100/100");
  const [avatarFallback, setAvatarFallback] = useState("AD");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);

    if (role === 'Student') {
        const studentId = sessionStorage.getItem("studentId");
        if (studentId && students) {
            const student = students.find(s => s.id === studentId);
            if (student) {
                setAvatarUrl(student.avatar);
                setAvatarFallback(student.name.charAt(0).toUpperCase());
            }
        }
    } else if (role) {
        setAvatarFallback(role.charAt(0).toUpperCase());
    }
  }, [students]);

  const handleLogout = () => {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("studentId");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  const currentNavLinks = userRole ? navLinksByRole[userRole] || [] : [];

  const NavLinks = ({isSheet = false}: {isSheet?: boolean}) => (
    <nav className={isSheet ? "grid gap-6 text-lg font-medium" : "hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"}>
        <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
            <School className="h-6 w-6" />
            <span className={isSheet ? "" : "sr-only"}>School ERP</span>
        </Link>
        {currentNavLinks.map(link => (
             <Link
                key={link.href}
                href={link.href}
                className={"text-muted-foreground transition-colors hover:text-foreground"}
            >
                {link.label}
            </Link>
        ))}
    </nav>
  );

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-40">
        <NavLinks />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <NavLinks isSheet={true} />
          </SheetContent>
        </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
