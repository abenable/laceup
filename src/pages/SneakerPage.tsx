import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import Alert from "../components/Alert";

const SneakerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string>("");
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

  const isInCart = cartItems.some((item) => item.id === sneaker?.id);

  const handleAddToCart = () => {
    if (!sneaker) return;
    addToCart({
      id: sneaker.id,
      name: sneaker.name,
      price: parseFloat(sneaker.price),
      size: size || "Not specified",
      quantity: quantity,
      image: sneaker.image,
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
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
            UGX {parseFloat(sneaker.price).toFixed(2)}
          </p>
          <p className="text-mono-dark-400 dark:text-mono-light-400">
            {sneaker.description}
          </p>

          {/* Category */}
          <div className="inline-block px-3 py-1 rounded-full bg-mono-light-800 dark:bg-mono-dark-800 text-mono-dark-600 dark:text-mono-light-600 text-sm">
            {sneaker.category}
          </div>

          {/* Size Input */}
          <div className="space-y-4">
            <h3 className="text-mono-dark dark:text-mono-light font-semibold">
              Enter Your Size
            </h3>
            <input
              type="text"
              value={size}
              onChange={handleSizeChange}
              placeholder="e.g., US 9, EU 42"
              className="w-full px-4 py-2 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 bg-transparent text-mono-dark dark:text-mono-light focus:outline-none focus:border-mono-dark dark:focus:border-mono-light"
            />
          </div>

          {/* Quantity Selection */}
          <div className="space-y-4">
            <h3 className="text-mono-dark dark:text-mono-light font-semibold">
              Select Quantity
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 flex items-center justify-center text-mono-dark dark:text-mono-light hover:border-mono-dark dark:hover:border-mono-light transition-all duration-300"
              >
                <span className="text-xl">-</span>
              </button>
              <span className="text-xl font-medium text-mono-dark dark:text-mono-light">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 flex items-center justify-center text-mono-dark dark:text-mono-light hover:border-mono-dark dark:hover:border-mono-light transition-all duration-300"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`w-full py-4 rounded-lg font-semibold border-2 shadow-button hover:shadow-button-hover transition-all duration-300 ${
              isInCart
                ? "bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light border-mono-light-400 dark:border-mono-dark-400 cursor-not-allowed"
                : "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark border-mono-dark dark:border-mono-light hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
            }`}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SneakerPage;
