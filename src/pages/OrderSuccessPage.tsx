import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/outline";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if accessed directly without an order
    const hasOrderData = localStorage.getItem("lastOrder");
    if (!hasOrderData) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cyber-light/50 dark:bg-cyber-dark/50">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-cyber-primary rounded-full">
          <CheckIcon className="w-8 h-8 text-cyber-light" />
        </div>

        <h1 className="text-3xl font-bold text-cyber-dark dark:text-cyber-light">
          Order Successful!
        </h1>

        <p className="text-cyber-muted">
          Thank you for your purchase. We'll send you an email with your order
          details shortly.
        </p>

        <div className="pt-6 space-y-4">
          <Link
            to="/"
            className="block w-full py-3 px-4 bg-cyber-primary text-cyber-light rounded-lg font-medium hover:bg-cyber-primary-hover transition-all duration-300"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="block w-full py-3 px-4 border border-cyber-primary/30 text-cyber-dark dark:text-cyber-light rounded-lg font-medium hover:bg-cyber-primary/10 transition-all duration-300"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
