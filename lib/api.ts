import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Token state
let accessToken: string | null = null;

// Token management functions
export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// Generic request function
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
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

// Auth API functions
export const login = async (
  credentials: LoginCredentials,
): Promise<ApiResponse<AuthResponse>> => {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = async (
  data: RegisterData,
): Promise<ApiResponse<AuthResponse>> => {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logout = async (): Promise<void> => {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

  if (refreshToken) {
    try {
      await request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Clear tokens and user data
  clearAccessToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

export const refreshToken = async (
  refreshTokenValue: string,
): Promise<ApiResponse<AuthResponse>> => {
  return request<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });
};

export const getProfile = async (): Promise<ApiResponse<any>> => {
  return request("/profile", {
    method: "GET",
  });
};

// Export default object for backward compatibility
export default {
  login,
  register,
  logout,
  refreshToken,
  getProfile,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
};
