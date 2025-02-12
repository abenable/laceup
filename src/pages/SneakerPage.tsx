import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import Alert from "../components/Alert";

const AVAILABLE_SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

const SneakerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>();
  const { cartItems, addToCart } = useCart();
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSneaker = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error("Sneaker ID is required");
        const response = await kicksApi.getKickById(parseInt(id));
        setSneaker(response.data);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        if (errorMessage.includes("not found")) {
          setTimeout(() => navigate("/"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSneaker();
  }, [id, navigate]);

  const isInCart = cartItems.some(
    (item) =>
      item.id === sneaker?.id && (!selectedSize || item.size === selectedSize)
  );

  const handleAddToCart = () => {
    if (!selectedSize || !sneaker) return;
    addToCart({
      id: sneaker.id,
      name: sneaker.name,
      price: parseFloat(sneaker.price),
      size: selectedSize,
      quantity: 1,
      image: sneaker.image,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-lg overflow-hidden bg-mono-light-800 dark:bg-mono-dark-800 animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 bg-mono-light-800 dark:bg-mono-dark-800 rounded animate-pulse" />
            <div className="h-8 w-1/4 bg-mono-light-800 dark:bg-mono-dark-800 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-mono-light-800 dark:bg-mono-dark-800 rounded animate-pulse" />
              <div className="h-4 bg-mono-light-800 dark:bg-mono-dark-800 rounded animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sneaker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">{error || "Sneaker not found"}</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-lg overflow-hidden border border-mono-light-400 dark:border-mono-dark-400 bg-mono-light-800 dark:bg-mono-dark-800">
          <img
            src={sneaker.image}
            alt={sneaker.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light">
            {sneaker.name}
          </h1>
          <p className="text-2xl text-mono-dark-600 dark:text-mono-light-600">
            ${parseFloat(sneaker.price).toFixed(2)}
          </p>
          <p className="text-mono-dark-400 dark:text-mono-light-400">
            {sneaker.description}
          </p>

          {/* Category */}
          <div className="inline-block px-3 py-1 rounded-full bg-mono-light-800 dark:bg-mono-dark-800 text-mono-dark-600 dark:text-mono-light-600 text-sm">
            {sneaker.category}
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-mono-dark dark:text-mono-light font-semibold">
              Select Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-lg border-2 shadow-button hover:shadow-button-hover ${
                    selectedSize === size
                      ? "border-mono-dark dark:border-mono-light bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark"
                      : "border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light hover:border-mono-dark dark:hover:border-mono-light"
                  } transition-all duration-300`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart || !selectedSize}
            className={`w-full py-4 rounded-lg font-semibold border-2 shadow-button hover:shadow-button-hover transition-all duration-300 ${
              isInCart
                ? "bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light border-mono-light-400 dark:border-mono-dark-400 cursor-not-allowed"
                : !selectedSize
                ? "bg-mono-light-600 dark:bg-mono-dark-600 text-mono-dark dark:text-mono-light border-mono-light-600 dark:border-mono-dark-600 cursor-not-allowed"
                : "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark border-mono-dark dark:border-mono-light hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
            }`}
          >
            {isInCart
              ? "Added to Cart"
              : !selectedSize
              ? "Select a Size"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SneakerPage;
