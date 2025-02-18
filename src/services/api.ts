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

interface ErrorResponse {
  message?: string;
  [key: string]: any;
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
  timeout: 10000, // 10 second timeout
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
  (error) => Promise.reject(error)
);

// Response interceptor for handling tokens and errors
api.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest: any = error.config;

    if (!originalRequest || originalRequest._retry) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || error.message,
        error.response?.data
      );
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      try {
        const response = await authApi.checkAuth();
        if (response.token) {
          localStorage.setItem(TOKEN_KEY, response.token);
          originalRequest.headers.Authorization = `Bearer ${response.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
        throw refreshError;
      }
    }

    // Handle other errors
    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data?.message || "An error occurred",
        error.response.data
      );
    }

    if (!error.response && error.message === "Network Error") {
      throw new ApiError(
        0,
        "Unable to connect to the server. Please check your connection."
      );
    }

    throw new ApiError(500, error.message || "An unexpected error occurred");
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
    api.get<{ Categories: number; data: Category[] }>("/laceup/categories"),

  getCategoryById: (id: number) => api.get<Category>(`/laceup/category/${id}`),
};

export const ordersApi = {
  getAllOrders: () =>
    api.get<{ Orders: number; data: Order[] }>("/laceup/orders"),

  getOrderById: (id: number) => api.get<Order>(`/laceup/orders/${id}`),

  addOrder: (data: { kickId: number; quantity: number }) =>
    api.post<Order>("/laceup/orders", data),
};

export default api;
