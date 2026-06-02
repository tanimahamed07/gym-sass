"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserPlus,
  QrCode as QrCodeIcon,
  Loader2,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react";
import { attendanceService, memberService } from "@/src/services";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (qrDialogOpen && !scanning) {
      startQrScanner();
    } else if (!qrDialogOpen && qrScannerRef.current) {
      stopQrScanner();
    }

    return () => {
      if (qrScannerRef.current) {
        stopQrScanner();
      }
    };
  }, [qrDialogOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      // Fetch today's attendance
      const attendanceResponse = await attendanceService.getAttendances({
        startDate: today,
        endDate: today,
      });
      if (attendanceResponse.success) {
        setAttendance(attendanceResponse.data);
      }

      // Fetch members for manual check-in
      const membersResponse = await memberService.getMembers();
      if (membersResponse.success) {
        setMembers(
          membersResponse.data.filter((m: any) => m.status === "active"),
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const startQrScanner = async () => {
    try {
      setScanning(true);
      const html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Handle scanned QR code
          await handleQrScan(decodedText);
          stopQrScanner();
          setQrDialogOpen(false);
        },
        (errorMessage) => {
          // Handle scan errors silently
        },
      );
    } catch (error: any) {
      toast.error("Failed to start QR scanner: " + error.message);
      setScanning(false);
    }
  };

  const stopQrScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
    setScanning(false);
  };

  const handleQrScan = async (memberId: string) => {
    try {
      const response = await attendanceService.checkIn({ memberId });
      if (response.success) {
        toast.success("Check-in successful!");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check in");
    }
  };

  const handleManualCheckIn = async () => {
    if (!selectedMemberId) {
      toast.error("Please select a member");
      return;
    }

    try {
      setSubmitting(true);
      const response = await attendanceService.checkIn({
        memberId: selectedMemberId,
      });
      if (response.success) {
        toast.success("Check-in successful!");
        setManualDialogOpen(false);
        setSelectedMemberId("");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async (attendanceId: string) => {
    try {
      const response = await attendanceService.checkOut({ attendanceId });
      if (response.success) {
        toast.success("Check-out successful!");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check out");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">
              Track member check-ins and check-outs
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <QrCodeIcon className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan Member QR Code</DialogTitle>
                  <DialogDescription>
                    Position the QR code within the frame to check in
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <div
                    id="qr-reader"
                    ref={qrReaderRef}
                    className="w-full max-w-sm"
                  ></div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manual Check-in
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Check-in</DialogTitle>
                  <DialogDescription>
                    Select a member to manually check them in
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="member">Select Member</Label>
                    <Select
                      value={selectedMemberId}
                      onValueChange={setSelectedMemberId}
                    >
                      <SelectTrigger id="member">
                        <SelectValue placeholder="Choose a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} {member.email && `(${member.email})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleManualCheckIn}
                    disabled={submitting || !selectedMemberId}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Check In
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Check-ins Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Currently In Gym
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendance.filter((a) => a.status === "checked_in").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendance.filter((a) => a.status === "checked_out").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No check-ins yet today
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Check-out Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.memberId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {new Date(record.checkInTime).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.checkOutTime ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(record.checkOutTime).toLocaleTimeString()}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "checked_in"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {record.status === "checked_in"
                            ? "In Gym"
                            : "Checked Out"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.status === "checked_in" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCheckOut(record.id)}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Check Out
                          </Button>
                        )}
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
