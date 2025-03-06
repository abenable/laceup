import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { kicksApi, type Sneaker } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { handleApiError } from "../services/errorUtils";
import { ShoppingBagIcon, CheckIcon } from "@heroicons/react/24/outline";
import Alert from "../components/Alert";

const MenPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await kicksApi.getAllKicks();
        // Filter for men's sneakers
        setSneakers(
          response.data.data.filter(
            (sneaker) => sneaker.category.toLowerCase() === "men"
          )
        );
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  const isInCart = (sneakerId: number) => {
    return cartItems.some((item) => item.id === sneakerId);
  };

  const findItemInCart = (sneakerId: number) => {
    return cartItems.find((item) => item.id === sneakerId);
  };

  const handleAddToCart = (
    e: React.MouseEvent,
    sneaker: Sneaker,
    defaultSize = "US 9"
  ) => {
    e.preventDefault();
    if (!isInCart(sneaker.id)) {
      addToCart({
        id: sneaker.id,
        name: sneaker.name,
        price: parseFloat(sneaker.price),
        size: defaultSize,
        quantity: 1,
        image: sneaker.image,
      });
    } else {
      const cartItem = findItemInCart(sneaker.id);
      if (cartItem) {
        removeFromCart(sneaker.id, cartItem.size);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-mono-light-800 dark:bg-mono-dark-800 w-1/4 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg h-64"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light">
          Men's Sneakers
        </h1>
        <p className="mt-2 text-mono-dark-600 dark:text-mono-light-600">
          Discover our collection of men's sneakers
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {sneakers.length === 0 ? (
        <Alert type="info">No men's sneakers available right now.</Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sneakers.map((sneaker) => (
            <Link
              to={`/sneaker/${sneaker.id}`}
              key={sneaker.id}
              className="group relative rounded-lg overflow-hidden bg-mono-light-800 dark:bg-mono-dark-800 hover:bg-mono-light-600 dark:hover:bg-mono-dark-600 border-2 border-mono-light-400 dark:border-mono-dark-400 transition-all duration-300 shadow-card hover:shadow-card-hover"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={sneaker.image}
                  alt={sneaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-mono-dark dark:text-mono-light font-semibold text-lg mb-2">
                  {sneaker.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-mono-dark dark:text-mono-light">
                    UGX {parseFloat(sneaker.price).toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(e, sneaker)}
                    disabled={isInCart(sneaker.id)}
                    title={
                      isInCart(sneaker.id) ? "Added to cart" : "Add to cart"
                    }
                    className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                      isInCart(sneaker.id)
                        ? "bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light border-mono-light-400 dark:border-mono-dark-400"
                        : "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark border-mono-dark dark:border-mono-light hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
                    } shadow-button hover:shadow-button-hover`}
                  >
                    {isInCart(sneaker.id) ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      <ShoppingBagIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenPage;
