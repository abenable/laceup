import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Loader from "../components/Loader";
import Skeleton from "../components/Skeleton";
import { withLoading } from "../components/withLoading";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handler for updating item quantity
  const handleQuantityUpdate = async (
    id: number,
    size: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    const itemKey = `${id}-${size}`;
    setUpdatingItemId(itemKey);
    try {
      await updateQuantity(id, size, newQuantity);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handler for removing items
  const handleRemoveItem = async (id: number, size: string) => {
    const itemKey = `${id}-${size}`;
    setUpdatingItemId(itemKey);
    try {
      await removeFromCart(id, size);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Simulate initial loading state to show skeletons
  setTimeout(() => setLoading(false), 500);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton variant="text" className="h-8 w-1/4" />
          <Skeleton variant="text" className="h-6 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-mono-light-800 dark:bg-mono-dark-800 rounded-xl border border-mono-light-400 dark:border-mono-dark-400"
            >
              <Skeleton
                variant="rectangular"
                className="w-28 h-28 rounded-lg"
                animation="wave"
              />
              <div className="flex-1 space-y-2 w-full">
                <Skeleton variant="text" className="h-6 w-3/4" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton variant="text" className="h-4 w-20" />
                  <Skeleton variant="text" className="h-4 w-20" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton
                  variant="rectangular"
                  className="w-32 h-10 rounded-lg"
                />
                <Skeleton variant="text" className="h-6 w-16" />
              </div>
            </div>
          ))}

          <div className="mt-8 bg-mono-light-800 dark:bg-mono-dark-800 rounded-xl p-6 border border-mono-light-400 dark:border-mono-dark-400">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4">
                <Skeleton variant="text" className="h-6 w-24" />
                <Skeleton variant="text" className="h-6 w-24" />
              </div>
              <Skeleton
                variant="rectangular"
                className="h-12 w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light">
          Shopping Cart
        </h1>
        <span className="text-mono-dark-600 dark:text-mono-light-600">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-mono-light-800 dark:bg-mono-dark-800 rounded-xl border-2 border-mono-light-400 dark:border-mono-dark-400 transition-all hover:border-mono-dark/30 dark:hover:border-mono-light/30 shadow-card hover:shadow-card-hover ${
                  updatingItemId === `${item.id}-${item.size}`
                    ? "opacity-70"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg shadow-button"
                  />
                  <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark text-sm rounded-full border-2 border-mono-light dark:border-mono-dark shadow-button">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-mono-dark dark:text-mono-light">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-mono-dark-600 dark:text-mono-light-600">
                    <p>Size: {item.size}</p>
                    <p className="font-medium text-mono-dark dark:text-mono-light">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 self-end sm:self-center">
                  {updatingItemId === `${item.id}-${item.size}` ? (
                    <div className="p-2">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center bg-mono-light-600 dark:bg-mono-dark-600 rounded-lg overflow-hidden shadow-button border-2 border-mono-light-400 dark:border-mono-dark-400">
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              item.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2 text-mono-dark dark:text-mono-light hover:bg-mono-light-400 dark:hover:bg-mono-dark-400 transition-colors border-r border-mono-light-400 dark:border-mono-dark-400"
                          aria-label="Decrease quantity"
                          disabled={updatingItemId !== null}
                        >
                          -
                        </button>
                        <span className="w-12 text-center py-2 font-medium text-mono-dark dark:text-mono-light">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              item.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 text-mono-dark dark:text-mono-light hover:bg-mono-light-400 dark:hover:bg-mono-dark-400 transition-colors border-l border-mono-light-400 dark:border-mono-dark-400"
                          aria-label="Increase quantity"
                          disabled={updatingItemId !== null}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="text-sm text-mono-dark-600 dark:text-mono-light-600 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-button hover:shadow-button-hover hover:border-red-500 dark:hover:border-red-400"
                        disabled={updatingItemId !== null}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 bg-mono-light-800 dark:bg-mono-dark-800 rounded-xl p-6 border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-mono-light-400 dark:border-mono-dark-400">
                  <span className="text-mono-dark-600 dark:text-mono-light-600">
                    Subtotal
                  </span>
                  <span className="text-lg font-medium text-mono-dark dark:text-mono-light">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-4 text-center bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-medium hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-mono-light-800 dark:bg-mono-dark-800 rounded-xl border border-mono-light-400 dark:border-mono-dark-400">
          <p className="text-mono-dark-600 dark:text-mono-light-600 mb-6 text-lg">
            Your cart is empty
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-medium hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default withLoading(CartPage);
