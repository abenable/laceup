import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {}

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
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    // Initialize token refresh mechanism
    this.setupTokenRefresh();
  }

  private setupTokenRefresh() {
    // Clear any existing timeout
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }

    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        // Set up periodic token refresh (every 14 minutes if token expires in 15)
        this.tokenRefreshTimeout = setInterval(() => {
          this.checkAuth().catch(() => {
            // If refresh fails, clear the interval
            if (this.tokenRefreshTimeout) {
              clearInterval(this.tokenRefreshTimeout);
            }
          });
        }, 14 * 60 * 1000);
      } catch (error) {
        console.error("Failed to setup token refresh:", error);
      }
    }
  }

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
      if (this.tokenRefreshTimeout) {
        clearTimeout(this.tokenRefreshTimeout);
      }
      const response = await api.post("/auth/logout");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await api.get("/auth/isAuthenticated");

      // Important: Always keep the existing token unless explicitly given a new one
      if (response.data.status === "success") {
        if (response.data.token && response.data.token !== token) {
          localStorage.setItem("auth_token", response.data.token);
          this.setupTokenRefresh();
        }

        // Even if we don't get a new token, keep the existing one
        if (response.data.user) {
          localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        }
        return response.data;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      // Don't automatically clear token on network errors
      if (error.message !== "Network Error") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        if (this.tokenRefreshTimeout) {
          clearTimeout(this.tokenRefreshTimeout);
        }
      }
      throw new Error(
        error.response?.data?.message || "Authentication check failed"
      );
    }
  }
}

export const authApi = AuthApi.getInstance();
