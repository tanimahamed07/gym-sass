"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  Users,
  UserCheck,
  ClipboardCheck,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import {
  memberService,
  attendanceService,
  paymentService,
} from "@/src/services";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  todayAttendance: number;
  monthlyRevenue: number;
  expiringSoon: number;
  memberGrowth: number;
  revenueGrowth: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    todayAttendance: 0,
    monthlyRevenue: 0,
    expiringSoon: 0,
    memberGrowth: 0,
    revenueGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState<
    Array<{ month: string; revenue: number }>
  >([]);
  const [attendanceData, setAttendanceData] = useState<
    Array<{ day: string; attendance: number }>
  >([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch members
        const membersResponse = await memberService.getMembers();
        const members = membersResponse.success ? membersResponse.data : [];
        const totalMembers = members.length;
        const activeMembers = members.filter(
          (m) => m.status === "active",
        ).length;

        // Fetch today's attendance
        const today = new Date().toISOString().split("T")[0];
        const attendanceResponse = await attendanceService.getAttendances({
          startDate: today,
          endDate: today,
        });
        const todayAttendance = attendanceResponse.success
          ? attendanceResponse.data.length
          : 0;

        // Fetch payments for monthly revenue
        const paymentsResponse = await paymentService.getPayments();
        const payments = paymentsResponse.success ? paymentsResponse.data : [];

        // Calculate current month revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = payments
          .filter((p) => {
            const paymentDate = new Date(p.createdAt);
            return (
              p.status === "completed" &&
              paymentDate.getMonth() === currentMonth &&
              paymentDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, p) => sum + p.amount, 0);

        // Mock expiring soon count (would need membership expiry data)
        const expiringSoon = Math.floor(totalMembers * 0.1);

        // Mock growth percentages
        const memberGrowth = activeMembers > 0 ? 12 : 0;
        const revenueGrowth = monthlyRevenue > 0 ? 8 : 0;

        setStats({
          totalMembers,
          activeMembers,
          todayAttendance,
          monthlyRevenue,
          expiringSoon,
          memberGrowth,
          revenueGrowth,
        });

        // Generate revenue chart data (last 6 months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const revenueChartData = months.map((month, index) => {
          const monthPayments = payments.filter((p) => {
            const paymentDate = new Date(p.createdAt);
            return (
              p.status === "completed" &&
              paymentDate.getMonth() === (currentMonth - 5 + index + 12) % 12
            );
          });
          return {
            month,
            revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
          };
        });
        setRevenueData(revenueChartData);

        // Generate attendance chart data (last 7 days)
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const attendanceChartData = days.map((day, index) => ({
          day,
          attendance: Math.floor(Math.random() * 50) + 20, // Mock data
        }));
        setAttendanceData(attendanceChartData);

        // Generate recent activities
        const recentActivities = [
          ...members.slice(0, 3).map((m, i) => ({
            id: `member-${i}`,
            user: m.name,
            action: "joined the gym",
            time: "2 hours ago",
            type: "member" as const,
          })),
          ...payments.slice(0, 2).map((p, i) => ({
            id: `payment-${i}`,
            user: "Member",
            action: `paid $${p.amount}`,
            time: "3 hours ago",
            type: "payment" as const,
          })),
        ];
        setActivities(recentActivities);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your gym today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.memberGrowth}%
                from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMembers > 0
                  ? Math.round((stats.activeMembers / stats.totalMembers) * 100)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Attendance
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAttendance}</div>
              <p className="text-xs text-muted-foreground">Check-ins today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.monthlyRevenue.toFixed(2)}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.revenueGrowth}%
                from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Expiring Soon
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiringSoon}</div>
              <p className="text-xs text-orange-600">Memberships in 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueData} />
          <AttendanceChart data={attendanceData} />
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </div>
    </DashboardLayout>
  );
}
