import { httpGet, httpPost, httpPut, httpDelete } from "./http.service";
import type { ApiResponse } from "./http.service";

// Announcement Types
export interface Announcement {
  id: string;
  gymId: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  targetAudience: "all" | "members" | "trainers" | "staff";
  status: "draft" | "published" | "archived";
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  priority?: "low" | "medium" | "high";
  targetAudience?: "all" | "members" | "trainers" | "staff";
  publishDate?: string;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  priority?: "low" | "medium" | "high";
  targetAudience?: "all" | "members" | "trainers" | "staff";
  status?: "draft" | "published" | "archived";
  publishDate?: string;
}

// Announcement Service Functions
export const getAnnouncements = async (): Promise<
  ApiResponse<Announcement[]>
> => {
  return httpGet<Announcement[]>("/announcements");
};

export const getAnnouncementById = async (
  id: string,
): Promise<ApiResponse<Announcement>> => {
  return httpGet<Announcement>(`/announcements/${id}`);
};

export const createAnnouncement = async (
  data: CreateAnnouncementDto,
): Promise<ApiResponse<Announcement>> => {
  return httpPost<Announcement>("/announcements", data);
};

export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementDto,
): Promise<ApiResponse<Announcement>> => {
  return httpPut<Announcement>(`/announcements/${id}`, data);
};

export const deleteAnnouncement = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return httpDelete<void>(`/announcements/${id}`);
};

export const publishAnnouncement = async (
  id: string,
): Promise<ApiResponse<Announcement>> => {
  return httpPost<Announcement>(`/announcements/${id}/publish`, {});
};
