import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { isValidationError, handleApiError } from "../services/errorUtils";
import { useToast } from "../components/Toast";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, error: authError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (authError && isValidationError(new Error(authError))) {
      showToast(authError, "error");
    }
  }, [authError, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords don't match");
      showToast("Passwords don't match", "error");
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      showToast("Password must be at least 6 characters long", "error");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
      });
      showToast("Account created successfully!", "success");
      navigate("/");
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
          Create Account
        </h1>

        {(validationError || authError) && (
          <Alert type="error">{validationError || authError}</Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center space-x-2">
          <span className="text-mono-dark-600 dark:text-mono-light-600">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="text-mono-dark dark:text-mono-light font-medium hover:text-mono-dark-600 dark:hover:text-mono-light-600 underline-offset-4 hover:underline"
          >
            Sign in here
          </Link>
        </p>

        <div className="separator">
          <span className="separator-text">Or register with</span>
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

export default RegisterPage;
