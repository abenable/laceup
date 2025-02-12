import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface PasswordReset {
  token: string;
  password: string;
}

export interface PasswordUpdate {
  oldpassword: string;
  newpassword: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  user?: User;
  token?: string;
}

class AuthApi {
  private static instance: AuthApi;

  private constructor() {}

  static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async adminRegister(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/admin/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Admin registration failed"
      );
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/forgotpassword", { email });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset token"
      );
    }
  }

  async resetPassword(data: PasswordReset): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/resetpassword", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }

  async updatePassword(data: PasswordUpdate): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/updatepassword", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Password update failed"
      );
    }
  }

  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await api.get("/auth/check");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Authentication check failed"
      );
    }
  }
}

export const authApi = AuthApi.getInstance();
