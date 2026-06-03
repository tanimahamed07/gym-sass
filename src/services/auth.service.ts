import { httpPost } from "./http.service";
import { setAccessToken, clearAccessToken } from "./api.config";
import type { ApiResponse } from "./http.service";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  gymName: string;
  gymAddress?: string;
  ownerName: string;
  email: string;
  password: string;
  phone: string;
}

export interface User {
  id: string;
  gymId: string;
  name: string;
  email: string;
  role: "owner" | "trainer" | "receptionist" | "member";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Auth Service Functions
export const login = async (
  credentials: LoginCredentials,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await httpPost<AuthResponse>("/auth/login", credentials);

  // Store access token
  if (response.data?.tokens?.accessToken) {
    setAccessToken(response.data.tokens.accessToken);
  }

  return response;
};

export const register = async (
  data: RegisterData,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await httpPost<AuthResponse>("/auth/register", data);

  // Store access token
  if (response.data?.tokens?.accessToken) {
    setAccessToken(response.data.tokens.accessToken);
  }

  return response;
};

export const logout = async (): Promise<void> => {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

  if (refreshToken) {
    try {
      await httpPost("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Clear tokens and user data
  clearAccessToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

export const refreshToken = async (
  refreshTokenValue: string,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await httpPost<AuthResponse>("/auth/refresh", {
    refreshToken: refreshTokenValue,
  });

  // Update access token in memory and localStorage
  if (response.data?.tokens?.accessToken) {
    setAccessToken(response.data.tokens.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.tokens.accessToken);
    }
  }

  return response;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};

export const saveUserToStorage = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const saveTokensToStorage = (tokens: AuthTokens): void => {
  if (typeof window !== "undefined") {
    setAccessToken(tokens.accessToken);
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
};
