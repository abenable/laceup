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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.checkAuth();
      console.log(response.message);
      if (response.status === "success" && response.user) {
        setUser(response.user);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
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
        setUser(response.user);
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
        setUser(response.user);
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
        setUser(response.user);
        navigate("/admin");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
