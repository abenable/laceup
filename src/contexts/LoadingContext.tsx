import React, { createContext, useContext, useState, useCallback } from "react";
import PageLoader from "../components/PageLoader";

interface LoadingState {
  global: boolean;
  routes: Record<string, boolean>;
}

interface LoadingContextType {
  startLoading: (route?: string) => void;
  stopLoading: (route?: string) => void;
  isLoading: boolean;
  isRouteLoading: (route: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    global: false,
    routes: {},
  });

  const startLoading = useCallback((route?: string) => {
    setLoadingState((prev) => {
      if (route) {
        return {
          ...prev,
          routes: { ...prev.routes, [route]: true },
        };
      }
      return { ...prev, global: true };
    });
  }, []);

  const stopLoading = useCallback((route?: string) => {
    setLoadingState((prev) => {
      if (route) {
        const { [route]: _, ...restRoutes } = prev.routes;
        return {
          ...prev,
          routes: restRoutes,
        };
      }
      return { ...prev, global: false };
    });
  }, []);

  const isRouteLoading = useCallback(
    (route: string) => {
      return !!loadingState.routes[route];
    },
    [loadingState.routes]
  );

  const value = {
    startLoading,
    stopLoading,
    isLoading: loadingState.global,
    isRouteLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {loadingState.global && <PageLoader />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
