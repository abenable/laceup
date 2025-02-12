import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  authApi,
  type User,
  type LoginCredentials,
  type RegisterData,
  ApiError,
} from "../services/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
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
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await authApi.getCurrentUser();
        setUser(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem("token");
        }
        // Silent fail for initial auth check
      }
    }
    setLoading(false);
  };

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
    throw err; // Re-throw to allow components to handle the error
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const { data } = await authApi.login(credentials);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      handleError(err);
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      setError(null);
      const { data } = await authApi.register(registerData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      handleError(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
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
