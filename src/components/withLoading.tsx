import { ComponentType, useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";

interface WithLoadingProps {
  isLoading?: boolean;
}

export const withLoading = <P extends object>(
  WrappedComponent: ComponentType<P>,
  loadingTimeout: number = 300
) => {
  return (props: P & WithLoadingProps) => {
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
      if (props.isLoading) {
        const timer = setTimeout(() => {
          startLoading();
        }, loadingTimeout);

        return () => {
          clearTimeout(timer);
          stopLoading();
        };
      } else {
        stopLoading();
      }
    }, [props.isLoading, startLoading, stopLoading]);

    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
