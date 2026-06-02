"use client";

import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Sidebar } from "./sidebar";
import { DashboardNavbar } from "./navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar userRole={user?.role} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar />

          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="container py-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
