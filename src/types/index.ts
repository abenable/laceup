export interface Sneaker {
  id: number;
  name: string;
  price: string;
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

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface ApiResponse<T> {
  status?: string;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  totalCount: number; // For counts like Kicks, Categories, Orders
  data: T[];
}

export interface ErrorResponse {
  status: number;
  message: string;
  data?: any;
}
