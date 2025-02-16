import axios, { AxiosError } from "axios";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Sneaker {
  id: number;
  name: string;
  price: string; // Price comes as string from backend
  description: string;
  category: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Order {
  id: number;
  customerId: string;
  productId: number;
  quantity: number;
}

// API Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling tokens and errors
api.interceptors.response.use(
  (response) => {
    // Always preserve the token unless explicitly told to change it
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    if (response.data?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      // Handle 401 Unauthorized errors
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh the session
        try {
          const response = await api.get("/auth/isAuthenticated");
          if (response.data?.token) {
            localStorage.setItem(TOKEN_KEY, response.data.token);
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Only clear auth data and redirect if not already on login page
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/login")) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = `/login?redirect=${encodeURIComponent(
              currentPath
            )}`;
          }
        }
      }

      throw new ApiError(status, message, error.response.data);
    }

    // Handle network errors without clearing auth
    if (error.message === "Network Error") {
      throw new ApiError(
        0,
        "Unable to connect to the server. Please check your connection."
      );
    }

    throw new ApiError(500, error.message || "Network Error");
  }
);

// API endpoints with proper typing
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{
      status: string;
      message: string;
      user: User;
      token: string;
    }>("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<{
      status: string;
      message: string;
      user: User;
      token: string;
    }>("/auth/register", data);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  adminRegister: async (data: RegisterData) => {
    const response = await api.post<{
      status: string;
      message: string;
      user: User;
      token: string;
    }>("/auth/admin/register", data);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    const response = await api.post<{ status: string; message: string }>(
      "/auth/logout"
    );
    localStorage.removeItem(TOKEN_KEY);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    return api.post<{ status: string; message: string }>(
      "/auth/forgotpassword",
      { email }
    );
  },

  resetPassword: async (token: string, password: string) => {
    return api.post<{ status: string; message: string }>(
      "/auth/resetpassword",
      { token, password }
    );
  },

  updatePassword: async (oldpassword: string, newpassword: string) => {
    return api.post<{ message: string }>("/auth/updatepassword", {
      oldpassword,
      newpassword,
    });
  },

  checkAuth: async () => {
    try {
      const response = await api.get<{
        status: string;
        message: string;
        user: User;
        token: string;
      }>("/auth/check");
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  },
};

export const kicksApi = {
  getAllKicks: () =>
    api.get<{ Kicks: number; data: Sneaker[] }>("/laceup/kicks"),

  getKickById: (id: number) => api.get<Sneaker>(`/laceup/kicks/${id}`),

  addKick: (formData: FormData) =>
    api.post<Sneaker>("/laceup/kicks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateKick: (
    id: number,
    data: Partial<{ name: string; price: string; image?: string }>
  ) => api.put<Sneaker>(`/laceup/kicks/${id}`, data),

  deleteKick: (id: number) => api.delete(`/laceup/kicks/${id}`),
};

export const categoriesApi = {
  getAllCategories: () =>
    api.get<{ Categories: number; data: Category[] }>("/categories"),

  getCategoryById: (id: number) => api.get<Category>(`/category/${id}`),
};

export const ordersApi = {
  getAllOrders: () => api.get<{ Orders: number; data: Order[] }>("/orders"),

  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),

  addOrder: (data: {
    customerId: string;
    productId: number;
    quantity: number;
  }) => api.post<Order>("/orders", data),
};

export default api;
