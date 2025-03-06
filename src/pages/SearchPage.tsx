import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { kicksApi, type Sneaker } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { handleApiError } from "../services/errorUtils";
import { ShoppingBagIcon, CheckIcon } from "@heroicons/react/24/outline";
import Skeleton from "../components/Skeleton";
import Alert from "../components/Alert";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const searchSneakers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await kicksApi.getAllKicks();

        // Filter sneakers based on the query
        const filteredSneakers = response.data.data.filter(
          (sneaker: Sneaker) =>
            sneaker.name.toLowerCase().includes(query.toLowerCase()) ||
            (sneaker.description &&
              sneaker.description.toLowerCase().includes(query.toLowerCase()))
        );

        setSneakers(filteredSneakers);
      } catch (err) {
        const errorMessage = handleApiError(err);
        console.error("Error searching sneakers:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    searchSneakers();
  }, [query]);

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
    e.preventDefault(); // Prevent navigation when clicking the button
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
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light mb-2">
            <Skeleton variant="text" className="h-10 w-64" />
          </h1>
          <Skeleton variant="text" className="h-6 w-40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden bg-mono-light-800 dark:bg-mono-dark-800 border border-mono-light-400 dark:border-mono-dark-400"
              >
                <Skeleton
                  variant="rectangular"
                  className="aspect-square w-full"
                  animation="wave"
                />
                <div className="p-4 space-y-4">
                  <Skeleton variant="text" className="h-6 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton variant="text" className="h-5 w-1/4" />
                    <Skeleton
                      variant="rectangular"
                      className="h-10 w-32 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-mono-dark-600 dark:text-mono-light-600">
          {sneakers.length} {sneakers.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {sneakers.length === 0 && !error ? (
        <div className="text-center py-16 bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg">
          <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light mb-4">
            No results found
          </h2>
          <p className="text-mono-dark-600 dark:text-mono-light-600 mb-6">
            We couldn't find any products matching your search.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-medium hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
          {sneakers.map((sneaker) => (
            <Link
              to={`/sneaker/${sneaker.id}`}
              key={sneaker.id}
              className="group relative rounded-lg overflow-hidden bg-mono-light-800 dark:bg-mono-dark-800 hover:bg-mono-light-600 dark:hover:bg-mono-dark-600 border-2 border-mono-light-400 dark:border-mono-dark-400 transition-all duration-300 shadow-card hover:shadow-card-hover transform hover:scale-[1.02] sm:hover:scale-105"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={sneaker.image}
                  alt={sneaker.name}
                  className="w-full h-full object-cover transform group-hover:opacity-0 transition-all duration-500"
                />
                <img
                  src={sneaker.image}
                  alt={`${sneaker.name} alternate view`}
                  className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-mono-dark dark:text-mono-light font-semibold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2">
                  {sneaker.name}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-lg sm:text-xl font-bold text-mono-dark dark:text-mono-light">
                      UGX {parseFloat(sneaker.price).toFixed(2)}
                    </span>
                    {parseFloat(sneaker.price) >= 200 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm line-through text-mono-dark-600 dark:text-mono-light-600">
                          UGX {(parseFloat(sneaker.price) * 1.2).toFixed(2)}
                        </span>
                        <span className="text-xs px-2 py-0.5 sm:py-1 bg-red-500 text-white rounded-full">
                          -20%
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, sneaker)}
                    disabled={isInCart(sneaker.id)}
                    title={
                      isInCart(sneaker.id) ? "Added to cart" : "Add to cart"
                    }
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                      isInCart(sneaker.id)
                        ? "bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light border-mono-light-400 dark:border-mono-dark-400"
                        : "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark border-mono-dark dark:border-mono-light hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
                    } shadow-button hover:shadow-button-hover`}
                  >
                    {isInCart(sneaker.id) ? (
                      <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6" />
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

export default SearchPage;
