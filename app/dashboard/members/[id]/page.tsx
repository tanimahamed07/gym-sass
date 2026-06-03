"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Activity,
  DollarSign,
  Loader2,
  QrCode,
} from "lucide-react";
import {
  memberService,
  attendanceService,
  paymentService,
  planService,
  trainerService,
} from "@/src/services";
import type { Member } from "@/src/services/member.service";
import type { Plan } from "@/src/services/plan.service";
import type { Trainer } from "@/src/services/trainer.service";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [assigningPlan, setAssigningPlan] = useState(false);

  // Mock weight progress data
  const weightData = [
    { month: "Jan", weight: 85 },
    { month: "Feb", weight: 83 },
    { month: "Mar", weight: 81 },
    { month: "Apr", weight: 80 },
    { month: "May", weight: 78 },
    { month: "Jun", weight: 77 },
  ];

  useEffect(() => {
    fetchMemberData();
  }, [memberId]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);

      // Fetch member details
      const memberResponse = await memberService.getMemberById(memberId);
      if (memberResponse.success) {
        setMember(memberResponse.data);
      }

      // Fetch attendance
      const attendanceResponse =
        await attendanceService.getMemberAttendance(memberId);
      if (attendanceResponse.success) {
        setAttendance(attendanceResponse.data);
      }

      // Fetch payments
      const paymentsResponse = await paymentService.getMemberPayments(memberId);
      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data);
      }

      // Fetch plans
      const plansResponse = await planService.getPlans();
      if (plansResponse.success) {
        setPlans(plansResponse.data.filter((p) => p.status === "active"));
      }

      // Fetch trainers
      const trainersResponse = await trainerService.getTrainers();
      if (trainersResponse.success) {
        setTrainers(trainersResponse.data.filter((t) => t.status === "active"));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch member data");
      router.push("/dashboard/members");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }

    try {
      setAssigningPlan(true);
      const response = await memberService.updateMember(memberId, {
        membershipPlanId: selectedPlanId,
      });

      if (response.success) {
        toast.success("Plan assigned successfully!");
        setMember(response.data);
        setSelectedPlanId("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to assign plan");
    } finally {
      setAssigningPlan(false);
    }
  };

  const handleViewQR = async () => {
    try {
      const response = await memberService.getMemberQR(memberId);
      if (response.success) {
        // Display QR code (you could show it in a modal or download it)
        toast.success("QR code loaded");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load QR code");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!member) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Member not found</p>
          <Link href="/dashboard/members">
            <Button>Back to Members</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/members">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">
              Member since {new Date(member.joinDate).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" onClick={handleViewQR}>
            <QrCode className="h-4 w-4 mr-2" />
            View QR Code
          </Button>
          <Badge
            variant={
              member.status === "active"
                ? "default"
                : member.status === "inactive"
                  ? "secondary"
                  : "destructive"
            }
          >
            {member.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {member.phone}
                    </p>
                  </div>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {member.address}
                    </p>
                  </div>
                </div>
              )}
              {member.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                      {member.gender && ` • ${member.gender}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Plan</CardTitle>
              <CardDescription>
                Assign or update membership plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.membershipPlanId ? (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Active Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Plan ID: {member.membershipPlanId}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-lg border-dashed">
                  <p className="text-sm text-muted-foreground mb-2">
                    No active membership plan
                  </p>
                </div>
              )}

              <Dialog>
                <DialogTrigger render={<Button className="w-full" />}>
                  Assign Plan
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Membership Plan</DialogTitle>
                    <DialogDescription>
                      Select a membership plan to assign to this member
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select
                      value={selectedPlanId}
                      onValueChange={(value) => setSelectedPlanId(value || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/{plan.durationType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAssignPlan}
                      disabled={assigningPlan || !selectedPlanId}
                    >
                      {assigningPlan ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign Plan"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {trainers.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Assign Trainer</p>
                  <Select
                    value={selectedTrainerId}
                    onValueChange={(value) => setSelectedTrainerId(value || "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.name}
                          {trainer.specialization &&
                            ` - ${trainer.specialization}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weight Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>
              Weight tracking over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              Recent check-ins ({attendance.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Check-out Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.checkInTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "checked_in"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Recent transactions ({payments.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payment records yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 10).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
