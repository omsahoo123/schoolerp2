"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpen,
  CalendarCheck,
  DollarSign,
  GraduationCap,
  Home,
  School,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SidebarProps = {
  isSheet?: boolean
}

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/admissions", label: "Admissions", icon: UserPlus },
  { href: "/students", label: "Students", icon: User },
  { href: "/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/homework", label: "Homework", icon: BookOpen },
]

export default function Sidebar({ isSheet = false } : SidebarProps) {
  const pathname = usePathname()
  const Wrapper = isSheet ? 'div' : TooltipProvider;

  const NavContent = () => (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <Link
        href="#"
        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
      >
        <School className="h-4 w-4 transition-all group-hover:scale-110" />
        <span className="sr-only">Schiool ERP</span>
      </Link>
      {navLinks.map((link) => (
        <Wrapper key={link.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    isSheet && "w-full justify-start h-10 px-4"
                )}
              >
                <link.icon className="h-5 w-5" />
                {isSheet && <span className="ml-4">{link.label}</span>}
                <span className="sr-only">{link.label}</span>
              </Link>
            </TooltipTrigger>
            {!isSheet && <TooltipContent side="right">{link.label}</TooltipContent>}
          </Tooltip>
        </Wrapper>
      ))}
    </nav>
  )

  const AsideWrapper = isSheet ? 'div' : 'aside';

  return (
    <AsideWrapper className={cn(
        !isSheet && "hidden md:block fixed inset-y-0 left-0 z-50 border-r bg-sidebar text-sidebar-foreground",
        isSheet ? "w-full bg-background text-foreground" : "w-14"
    )}>
        { isSheet ? (
             <div className="flex flex-col h-full">
                <div className="sticky top-0 p-4 border-b">
                     <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                        <School className="h-6 w-6 text-primary" />
                        <span>Schiool ERP</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <NavContent />
                </div>
             </div>
        ) : (
             <div className="flex h-full max-h-screen flex-col gap-2">
                 <NavContent />
                 <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </nav>
             </div>
        )}

    </AsideWrapper>
  )
}
