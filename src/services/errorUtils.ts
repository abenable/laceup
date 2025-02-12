import { ApiError } from "./api";

export const handleApiError = (err: unknown): string => {
  if (err instanceof ApiError) {
    // Handle specific HTTP status codes
    switch (err.status) {
      case 400:
        return err.message || "Invalid request. Please check your input.";
      case 401:
        return "Please sign in to continue.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 422:
        return err.message || "Validation error. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return err.message || "An unexpected error occurred.";
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred.";
};

export const isNetworkError = (err: unknown): boolean => {
  return err instanceof ApiError && err.status === 0;
};

export const isAuthError = (err: unknown): boolean => {
  return err instanceof ApiError && (err.status === 401 || err.status === 403);
};

export const isValidationError = (err: unknown): boolean => {
  return err instanceof ApiError && (err.status === 400 || err.status === 422);
};
