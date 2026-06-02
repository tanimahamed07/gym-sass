import { httpGet, httpPost, httpPut, httpDelete } from "./http.service";
import type { ApiResponse } from "./http.service";

// Class Types
export interface GymClass {
  id: string;
  gymId: string;
  name: string;
  description?: string;
  trainerId?: string;
  schedule: string;
  duration: number;
  capacity: number;
  currentEnrollment: number;
  status: "active" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string;
  description?: string;
  trainerId?: string;
  schedule: string;
  duration: number;
  capacity: number;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  trainerId?: string;
  schedule?: string;
  duration?: number;
  capacity?: number;
  status?: "active" | "cancelled" | "completed";
}

// Class Service Functions
export const getClasses = async (): Promise<ApiResponse<GymClass[]>> => {
  return httpGet<GymClass[]>("/classes");
};

export const getClassById = async (
  id: string,
): Promise<ApiResponse<GymClass>> => {
  return httpGet<GymClass>(`/classes/${id}`);
};

export const createClass = async (
  data: CreateClassDto,
): Promise<ApiResponse<GymClass>> => {
  return httpPost<GymClass>("/classes", data);
};

export const updateClass = async (
  id: string,
  data: UpdateClassDto,
): Promise<ApiResponse<GymClass>> => {
  return httpPut<GymClass>(`/classes/${id}`, data);
};

export const deleteClass = async (id: string): Promise<ApiResponse<void>> => {
  return httpDelete<void>(`/classes/${id}`);
};
