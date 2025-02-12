import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Alert from "./Alert";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-light/50 dark:bg-cyber-dark/50">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="p-6 bg-white dark:bg-cyber-dark rounded-lg border border-cyber-primary/20">
              <h2 className="text-2xl font-bold text-cyber-primary mb-4">
                Something went wrong
              </h2>
              <Alert type="error" className="mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </Alert>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-cyber-primary text-cyber-light rounded-lg hover:bg-cyber-primary-hover transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = "Page not found";
    } else {
      errorMessage = error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-light/50 dark:bg-cyber-dark/50">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="p-6 bg-white dark:bg-cyber-dark rounded-lg border border-cyber-primary/20">
          <h2 className="text-2xl font-bold text-cyber-primary mb-4">Oops!</h2>
          <Alert type="error" className="mb-4">
            {errorMessage}
          </Alert>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyber-primary text-cyber-light rounded-lg hover:bg-cyber-primary-hover transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
