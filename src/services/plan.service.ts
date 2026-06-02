import { httpGet, httpPost, httpPut, httpDelete } from "./http.service";
import type { ApiResponse } from "./http.service";

// Plan Types
export interface Plan {
  id: string;
  gymId: string;
  name: string;
  description?: string;
  duration: number;
  durationType: "days" | "weeks" | "months" | "years";
  price: number;
  currency: string;
  features?: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanDto {
  name: string;
  description?: string;
  duration: number;
  durationType: "days" | "weeks" | "months" | "years";
  price: number;
  currency?: string;
  features?: string[];
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  duration?: number;
  durationType?: "days" | "weeks" | "months" | "years";
  price?: number;
  features?: string[];
  status?: "active" | "inactive";
}

// Plan Service Functions
export const getPlans = async (): Promise<ApiResponse<Plan[]>> => {
  return httpGet<Plan[]>("/plans");
};

export const getPlanById = async (id: string): Promise<ApiResponse<Plan>> => {
  return httpGet<Plan>(`/plans/${id}`);
};

export const createPlan = async (
  data: CreatePlanDto,
): Promise<ApiResponse<Plan>> => {
  return httpPost<Plan>("/plans", data);
};

export const updatePlan = async (
  id: string,
  data: UpdatePlanDto,
): Promise<ApiResponse<Plan>> => {
  return httpPut<Plan>(`/plans/${id}`, data);
};

export const deletePlan = async (id: string): Promise<ApiResponse<void>> => {
  return httpDelete<void>(`/plans/${id}`);
};
