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
        // Set up periodic token refresh (every 10 minutes)
        this.tokenRefreshTimeout = setInterval(async () => {
          try {
            await this.checkAuth();
          } catch (error) {
            // If refresh fails, clear the interval and localStorage
            if (this.tokenRefreshTimeout) {
              clearInterval(this.tokenRefreshTimeout);
              this.tokenRefreshTimeout = null;
            }
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
          }
        }, 10 * 60 * 1000); // 10 minutes
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

      // If we get a successful response, update the stored data
      if (response.data.status === "success") {
        if (response.data.token && response.data.token !== token) {
          localStorage.setItem("auth_token", response.data.token);
          this.setupTokenRefresh();
        }

        if (response.data.user) {
          localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        }
        return response.data;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      // Only clear authentication data for specific auth failures, not network errors
      if (error.response?.status === 401 || error.response?.status === 403) {
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
