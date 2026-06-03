"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, setAccessToken, clearAccessToken } from "@/src/services";
import type { User } from "@/src/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUser && (storedAccessToken || storedRefreshToken)) {
          setUser(JSON.parse(storedUser));

          // Restore access token to API service
          if (storedAccessToken) {
            setAccessToken(storedAccessToken);
          } else if (storedRefreshToken) {
            // If we have refresh token but no access token, try to refresh
            try {
              const response =
                await authService.refreshToken(storedRefreshToken);
              authService.saveTokensToStorage(response.data.tokens);
              if (response.data.user) {
                setUser(response.data.user);
                authService.saveUserToStorage(response.data.user);
              }
            } catch (error) {
              console.error("Failed to refresh token on load:", error);
              // Clear invalid tokens
              localStorage.removeItem("user");
              localStorage.removeItem("refreshToken");
              clearAccessToken();
            }
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // Clear potentially corrupt data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Store tokens and user data
      authService.saveTokensToStorage(response.data.tokens);
      authService.saveUserToStorage(response.data.user);

      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);

      // Store tokens and user data
      authService.saveTokensToStorage(response.data.tokens);
      authService.saveUserToStorage(response.data.user);

      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state
      setUser(null);
      router.push("/login");
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(refreshToken);

      // Update tokens
      authService.saveTokensToStorage(response.data.tokens);

      // Update user data if available
      if (response.data.user) {
        setUser(response.data.user);
        authService.saveUserToStorage(response.data.user);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
