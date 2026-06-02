import { httpGet, httpPost, httpPut, httpDelete } from "./http.service";
import type { ApiResponse } from "./http.service";

// Trainer Types
export interface Trainer {
  id: string;
  gymId: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  certification?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainerDto {
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  certification?: string;
}

export interface UpdateTrainerDto {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  certification?: string;
  status?: "active" | "inactive";
}

// Trainer Service Functions
export const getTrainers = async (): Promise<ApiResponse<Trainer[]>> => {
  return httpGet<Trainer[]>("/trainers");
};

export const getTrainerById = async (
  id: string,
): Promise<ApiResponse<Trainer>> => {
  return httpGet<Trainer>(`/trainers/${id}`);
};

export const createTrainer = async (
  data: CreateTrainerDto,
): Promise<ApiResponse<Trainer>> => {
  return httpPost<Trainer>("/trainers", data);
};

export const updateTrainer = async (
  id: string,
  data: UpdateTrainerDto,
): Promise<ApiResponse<Trainer>> => {
  return httpPut<Trainer>(`/trainers/${id}`, data);
};

export const deleteTrainer = async (id: string): Promise<ApiResponse<void>> => {
  return httpDelete<void>(`/trainers/${id}`);
};
