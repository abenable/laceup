import { ReactNode } from "react";

type AlertType = "error" | "success" | "info" | "warning";

interface AlertProps {
  type?: AlertType;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert = ({
  type = "info",
  children,
  onClose,
  className = "",
}: AlertProps) => {
  const baseStyles =
    "p-4 rounded-lg border-2 flex justify-between items-start shadow-button";
  const typeStyles = {
    error:
      "bg-mono-dark/10 dark:bg-mono-light/10 border-red-500/30 text-red-600 dark:text-red-400",
    success:
      "bg-mono-dark/10 dark:bg-mono-light/10 border-green-500/30 text-green-600 dark:text-green-400",
    info: "bg-mono-dark/10 dark:bg-mono-light/10 border-mono-dark/20 dark:border-mono-light/20 text-mono-dark dark:text-mono-light",
    warning:
      "bg-mono-dark/10 dark:bg-mono-light/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${className}`}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-mono-dark/10 dark:hover:bg-mono-light/10"
          aria-label="Close alert"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
