import { httpGet, httpPost, httpPut, httpDelete } from "./http.service";
import type { ApiResponse } from "./http.service";

// Member Types
export interface Member {
  id: string;
  gymId: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  membershipPlanId?: string;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMembers {
  data: Member[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateMemberDto {
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  membershipPlanId?: string;
  joinDate?: string;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  membershipPlanId?: string;
  status?: "active" | "inactive" | "suspended";
}

// Member Service Functions
export const getMembers = async (): Promise<ApiResponse<PaginatedMembers>> => {
  return httpGet<PaginatedMembers>("/members");
};

export const getMemberById = async (
  id: string,
): Promise<ApiResponse<Member>> => {
  return httpGet<Member>(`/members/${id}`);
};

export const createMember = async (
  data: CreateMemberDto,
): Promise<ApiResponse<Member>> => {
  return httpPost<Member>("/members", data);
};

export const updateMember = async (
  id: string,
  data: UpdateMemberDto,
): Promise<ApiResponse<Member>> => {
  return httpPut<Member>(`/members/${id}`, data);
};

export const deleteMember = async (id: string): Promise<ApiResponse<void>> => {
  return httpDelete<void>(`/members/${id}`);
};

export const getMemberQR = async (
  id: string,
): Promise<ApiResponse<{ qrCode: string }>> => {
  return httpGet<{ qrCode: string }>(`/members/${id}/qr`);
};
