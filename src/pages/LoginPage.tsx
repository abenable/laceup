import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import { isAuthError, handleApiError } from "../services/errorUtils";
import { useToast } from "../components/Toast";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, error: authError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authError && isAuthError(new Error(authError))) {
      showToast(authError, "error");
    }
  }, [authError, showToast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      const from = (location.state as any)?.from?.pathname || "/";
      showToast("Successfully logged in", "success");
      navigate(from);
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-mono-light/50 dark:bg-mono-dark/50">
      <div className="w-full max-w-md p-8 rounded-lg space-y-8 bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card">
        <h1 className="text-4xl font-bold text-center text-mono-dark dark:text-mono-light mb-2">
          Sign In
        </h1>

        {authError && <Alert type="error">{authError}</Alert>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark font-semibold rounded-lg 
              border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover
              transition-all duration-300 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size="small" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center space-x-2">
          <span className="text-mono-dark-600 dark:text-mono-light-600">
            Don't have an account?
          </span>
          <Link
            to="/register"
            className="text-mono-dark dark:text-mono-light font-medium hover:text-mono-dark-600 dark:hover:text-mono-light-600 underline-offset-4 hover:underline"
          >
            Create one here
          </Link>
        </p>

        <div className="separator">
          <span className="separator-text">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button disabled className="oauth-button">
            <FcGoogle className="text-xl" />
            <span>Google</span>
          </button>
          <button disabled className="oauth-button">
            <BsApple className="text-xl" />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
