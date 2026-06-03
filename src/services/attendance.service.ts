import { httpGet, httpPost } from "./http.service";
import type { ApiResponse } from "./http.service";

// Attendance Types
export interface Attendance {
  id: string;
  memberId: string;
  classId?: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "checked_in" | "checked_out";
  createdAt: string;
  updatedAt: string;
}

export interface CheckInDto {
  memberId: string;
  classId?: string;
}

export interface CheckOutDto {
  attendanceId: string;
}

export interface AttendanceStats {
  totalCheckIns: number;
  totalCheckOuts: number;
  activeMembers: number;
  date: string;
}

// Attendance Service Functions
export const getAttendances = async (params?: {
  startDate?: string;
  endDate?: string;
  memberId?: string;
}): Promise<ApiResponse<Attendance[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("start_date", params.startDate);
  if (params?.endDate) queryParams.append("end_date", params.endDate);
  if (params?.memberId) queryParams.append("member_id", params.memberId);

  const query = queryParams.toString();
  return httpGet<Attendance[]>(`/attendance/report${query ? `?${query}` : ""}`);
};

export const getAttendanceById = async (
  id: string,
): Promise<ApiResponse<Attendance>> => {
  return httpGet<Attendance>(`/attendance/${id}`);
};

export const checkIn = async (
  data: CheckInDto,
): Promise<ApiResponse<Attendance>> => {
  return httpPost<Attendance>("/attendance/check-in", data);
};

export const checkOut = async (
  data: CheckOutDto,
): Promise<ApiResponse<Attendance>> => {
  return httpPost<Attendance>("/attendance/check-out", data);
};

export const getAttendanceStats = async (
  date?: string,
): Promise<ApiResponse<AttendanceStats>> => {
  return httpGet<AttendanceStats>(
    `/attendance/stats${date ? `?date=${date}` : ""}`,
  );
};

export const getMemberAttendance = async (
  memberId: string,
): Promise<ApiResponse<Attendance[]>> => {
  return httpGet<Attendance[]>(`/attendance/member/${memberId}`);
};
