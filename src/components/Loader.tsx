import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
  variant?: "spinner" | "pulse";
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  className = "",
  variant = "spinner",
}) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  if (variant === "pulse") {
    return (
      <div
        className={`inline-block ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div className="animate-pulse rounded-full bg-mono-dark dark:bg-mono-light">
          <div className={`${sizeClasses[size]}`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-block ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`animate-spin ${sizeClasses[size]} text-mono-dark dark:text-mono-light`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Loader;
