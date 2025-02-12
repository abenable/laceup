import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Skeleton from "../components/Skeleton";

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
        const { data } = await kicksApi.getKickById(id!);
        setSneaker(data);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        if (errorMessage.includes("not found")) {
          // Redirect to home page after 3 seconds if sneaker not found
          setTimeout(() => navigate("/"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSneaker();
    }
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
      price: sneaker.price,
      size: selectedSize,
      quantity: 1,
      image: sneaker.images[0],
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton
              variant="rectangular"
              className="aspect-square w-full"
              animation="wave"
            />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  className="aspect-square w-full"
                  animation="wave"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <Skeleton variant="text" className="h-10 w-3/4" />
            <Skeleton variant="text" className="h-8 w-1/4" />
            <Skeleton variant="text" count={3} className="w-full" />

            <div className="space-y-4">
              <Skeleton variant="text" className="h-6 w-1/4" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} variant="rectangular" className="h-12" />
                ))}
              </div>
            </div>

            <Skeleton variant="rectangular" className="h-14 w-full mt-8" />
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
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border border-mono-light-400 dark:border-mono-dark-400 bg-mono-light-800 dark:bg-mono-dark-800">
            <img
              src={sneaker.images[0]}
              alt={sneaker.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {sneaker.images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-mono-light-400 dark:border-mono-dark-400 hover:border-mono-dark dark:hover:border-mono-light cursor-pointer transition-all duration-300"
              >
                <img
                  src={img}
                  alt={`${sneaker.name} view ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light">
            {sneaker.name}
          </h1>
          <p className="text-2xl text-mono-dark-600 dark:text-mono-light-600">
            ${sneaker.price}
          </p>
          <p className="text-mono-dark-400 dark:text-mono-light-400">
            {sneaker.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-mono-dark dark:text-mono-light font-semibold">
              Select Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {sneaker.sizes.map((size) => (
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
