import React from "react";
import Loader from "./Loader";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2";

  const variantStyles = {
    primary:
      "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark border-mono-dark dark:border-mono-light hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 disabled:bg-mono-dark/50 dark:disabled:bg-mono-light/50",
    secondary:
      "bg-mono-dark-800 dark:bg-mono-light-800 text-mono-light dark:text-mono-dark border-mono-dark-800 dark:border-mono-light-800 hover:bg-mono-dark-600 dark:hover:bg-mono-light-600 disabled:bg-mono-dark-800/50 dark:disabled:bg-mono-light-800/50",
    outline:
      "border-mono-dark/30 dark:border-mono-light/30 text-mono-dark dark:text-mono-light hover:bg-mono-dark/10 dark:hover:bg-mono-light/10 disabled:border-mono-dark/20 dark:disabled:border-mono-light/20",
  };

  const sizeStyles = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3",
    large: "px-6 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${isLoading || disabled ? "cursor-not-allowed" : ""}
        border-2 shadow-button hover:shadow-button-hover
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader size="small" />}
      {isLoading ? loadingText || children : children}
    </button>
  );
};

export default LoadingButton;
