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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
    // Remove any default CORS headers as they should be handled by the server
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;
      const data = error.response.data;

      if (status === 401) {
        localStorage.removeItem("token");
        // Redirect to login if needed
      }
      throw new ApiError(status, message, data);
    }
    // Network errors or CORS errors
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
    }>("/auth/login", credentials);
    if (response.data.user) {
      localStorage.setItem("token", response.data.user.id);
    }
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<{
      status: string;
      message: string;
      User: User;
    }>("/auth/register", data);
    if (response.data.User) {
      localStorage.setItem("token", response.data.User.id);
    }
    return response.data;
  },

  adminRegister: async (data: RegisterData) => {
    const response = await api.post<{
      status: string;
      message: string;
      User: User;
    }>("/auth/admin/register", data);
    if (response.data.User) {
      localStorage.setItem("token", response.data.User.id);
    }
    return response.data;
  },

  logout: async () => {
    const response = await api.post<{ status: string; message: string }>(
      "/auth/logout"
    );
    localStorage.removeItem("token");
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
    return api.get<{ status: string; message: string }>("/auth/check");
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
