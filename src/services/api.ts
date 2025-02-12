import axios, { AxiosError } from "axios";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  // Removed name field requirement
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Sneaker {
  id: number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  images: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  badges?: Array<"new" | "trending" | "best-seller" | "limited-stock">;
  alternateImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
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

      // Automatically logout on 401 errors
      if (status === 401) {
        localStorage.removeItem("token");
      }

      throw new ApiError(status, message, data);
    }
    throw new ApiError(500, "Network Error");
  }
);

// API endpoints with proper typing
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ user: User; token: string }>("/auth/login", credentials),
  register: (data: RegisterData) =>
    api.post<{ user: User; token: string }>("/auth/register", data),
  getCurrentUser: () => api.get<User>("/auth/isAuthenticated"),
};

export const kicksApi = {
  getAllKicks: () => api.get<Sneaker[]>("/laceup/kicks"),
  getKickById: (id: string) => api.get<Sneaker>(`/laceup/kicks/${id}`),
  addKick: (formData: FormData) => api.post<Sneaker>("/laceup/kicks", formData),
  updateKick: (id: string, data: Partial<Sneaker>) =>
    api.put<Sneaker>(`/laceup/kicks/${id}`, data),
  deleteKick: (id: string) => api.delete<void>(`/laceup/kicks/${id}`),
};

export const categoriesApi = {
  getAllCategories: () => api.get<Category[]>("/categories"),
  getCategoryById: (id: string) => api.get<Category>(`/category/${id}`),
};

export const ordersApi = {
  getAllOrders: () => api.get<Order[]>("/orders"),
  getOrderById: (id: string) => api.get<Order>(`/orders/${id}`),
  addOrder: (data: Omit<Order, "id" | "status" | "createdAt">) =>
    api.post<Order>("/orders", data),
};

export default api;
