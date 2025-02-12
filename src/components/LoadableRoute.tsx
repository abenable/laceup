import { Suspense } from "react";
import PageLoader from "./PageLoader";

interface LoadableRouteProps {
  children: React.ReactNode;
}

const LoadableRoute = ({ children }: LoadableRouteProps) => {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

export default LoadableRoute;
