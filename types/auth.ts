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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
