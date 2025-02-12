import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ordersApi } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems,
        shipping: shippingDetails,
        subtotal,
        tax,
        shipping_fee: shipping,
        total,
      };

      await ordersApi.addOrder(orderData);
      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert type="info">
          Your cart is empty. Please add items before checking out.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-cyber-dark dark:text-cyber-light">
        Checkout
      </h1>

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-cyber-secondary/30 p-6 rounded-lg border border-cyber-primary/20">
            <h2 className="text-xl font-semibold mb-4 text-cyber-dark dark:text-cyber-light">
              Shipping Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-cyber-dark dark:text-cyber-light mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white dark:bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition text-cyber-dark dark:text-cyber-light"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-cyber-primary text-cyber-light rounded-lg font-semibold transition-all duration-300 ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-cyber-primary-hover"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="small" />
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-cyber-secondary/30 p-6 rounded-lg border border-cyber-primary/20">
            <h2 className="text-xl font-semibold mb-4 text-cyber-dark dark:text-cyber-light">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-cyber-dark dark:text-cyber-light">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cyber-dark dark:text-cyber-light">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cyber-dark dark:text-cyber-light">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-cyber-primary/20">
                <div className="flex justify-between text-lg font-semibold text-cyber-dark dark:text-cyber-light">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-cyber-secondary/30 p-6 rounded-lg border border-cyber-primary/20">
            <h3 className="font-semibold mb-4 text-cyber-dark dark:text-cyber-light">
              Order Items ({cartItems.length})
            </h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-cyber-dark dark:text-cyber-light font-medium">
                      {item.name}
                    </h4>
                    <p className="text-sm text-cyber-muted">
                      Size: {item.size} | Quantity: {item.quantity}
                    </p>
                    <p className="text-cyber-primary">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
