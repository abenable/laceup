import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastComponent = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => {
  const baseStyles =
    "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 max-w-md backdrop-blur-sm";
  const typeStyles = {
    success:
      "bg-mono-dark/90 dark:bg-mono-light/90 text-mono-light dark:text-mono-dark border border-mono-light/10 dark:border-mono-dark/10",
    error:
      "bg-mono-dark/90 dark:bg-mono-light/90 text-mono-light dark:text-mono-dark border border-mono-light/10 dark:border-mono-dark/10",
    info: "bg-mono-dark/90 dark:bg-mono-light/90 text-mono-light dark:text-mono-dark border border-mono-light/10 dark:border-mono-dark/10",
    warning:
      "bg-mono-dark/90 dark:bg-mono-light/90 text-mono-light dark:text-mono-dark border border-mono-light/10 dark:border-mono-dark/10",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`} role="alert">
      <div className="flex items-start gap-2">
        <div className="flex-1">{message}</div>
        <button
          onClick={onClose}
          className="text-mono-light/80 dark:text-mono-dark/80 hover:text-mono-light dark:hover:text-mono-dark transition-colors"
          aria-label="Close toast"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
          {toasts.map((toast) => (
            <ToastComponent
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
