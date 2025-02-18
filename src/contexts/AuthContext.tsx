import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";
import type { User, LoginCredentials, RegisterData } from "../services/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  adminRegister: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { token: string; password: string }) => Promise<void>;
  updatePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verify token and refresh user data
  const verifySession = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      setUserData(null);
      return false;
    }

    try {
      const response = await authApi.login({
        email: user?.email || "",
        password: "",
      });
      if (response.user) {
        setUserData(response.user);
        if (response.token) {
          setToken(response.token);
        }
        return true;
      }
      return false;
    } catch (err) {
      // Only clear on actual auth errors, not network errors
      if (err instanceof Error && err.message.includes("auth")) {
        setToken(undefined);
        setUserData(null);
      }
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (localStorage.getItem(TOKEN_KEY)) {
          await verifySession();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Remove periodic verification since we're handling it in the API interceptor
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && user) {
        await verifySession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const setToken = (token: string | undefined) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const setUserData = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
    throw err;
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await authApi.login(credentials);
      if (response.user) {
        setUserData(response.user);
        if (response.token) {
          setToken(response.token);
        }
        navigate("/");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authApi.register(data);
      if (response.user) {
        setUserData(response.user);
        if (response.token) {
          setToken(response.token);
        }
        navigate("/");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const adminRegister = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authApi.adminRegister(data);
      if (response.user) {
        setUserData(response.user);
        if (response.token) {
          setToken(response.token);
        }
        navigate("/admin");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authApi.logout();
      setUserData(null);
      setToken(undefined);
      navigate("/login");
    } catch (err) {
      handleError(err);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await authApi.forgotPassword(email);
    } catch (err) {
      handleError(err);
    }
  };

  const resetPassword = async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => {
    try {
      setError(null);
      await authApi.resetPassword({ token, password });
      navigate("/login");
    } catch (err) {
      handleError(err);
    }
  };

  const updatePassword = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      setError(null);
      await authApi.updatePassword({
        oldpassword: oldPassword,
        newpassword: newPassword,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    adminRegister,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
  };

  if (loading) {
    return null; // or a loading spinner component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
