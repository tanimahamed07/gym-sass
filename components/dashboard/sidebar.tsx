"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ClipboardCheck,
  Dumbbell,
  DollarSign,
  Calendar,
  Megaphone,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // If specified, only these roles can see this item
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: Users,
    roles: ["owner", "receptionist"],
  },
  {
    title: "Plans",
    href: "/dashboard/plans",
    icon: CreditCard,
    roles: ["owner"],
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Trainers",
    href: "/dashboard/trainers",
    icon: Dumbbell,
    roles: ["owner"],
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: DollarSign,
    roles: ["owner", "receptionist"],
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: Calendar,
    roles: ["owner", "trainer"],
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: Megaphone,
    roles: ["owner"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["owner"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = "owner" }: SidebarProps) {
  const pathname = usePathname();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(userRole);
  });

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">GymSaaS</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">© 2026 GymSaaS</div>
      </div>
    </aside>
  );
}
