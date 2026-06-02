import { API_URL, getAccessToken } from "./api.config";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Generic HTTP request function
export const httpRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw new Error(error.message || "Network error occurred");
  }
};

// HTTP methods
export const httpGet = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, { method: "GET" });
};

export const httpPost = async <T>(
  endpoint: string,
  body: any,
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const httpPut = async <T>(
  endpoint: string,
  body: any,
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

export const httpPatch = async <T>(
  endpoint: string,
  body: any,
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const httpDelete = async <T>(
  endpoint: string,
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, { method: "DELETE" });
};
