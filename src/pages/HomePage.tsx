import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  ShoppingBagIcon,
  CheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import Alert from "../components/Alert";
import Skeleton from "../components/Skeleton";
import { withLoading } from "../components/withLoading";
import FeatureCard from "../components/FeatureCard";
import StarRating from "../components/StarRating";
import newArrival from "../assets/dunk_low.png";
import trending from "../assets/pegasus.jpeg";
import bestSeller from "../assets/superstart.png";
import img1 from "../assets/testmonials/img.jpg";
import img2 from "../assets/testmonials/img2.jpg";
import img3 from "../assets/testmonials/img3.jpg";

function HomePage() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery] = useState(""); // Keeping state for potential future use
  const { addToCart, cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        setError(null);
        const response = await kicksApi.getAllKicks();
        setSneakers(response.data.data);
      } catch (err) {
        const errorMessage = handleApiError(err);
        console.error("Error fetching sneakers:", err);
        setError(errorMessage);
        setSneakers([]);
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

  const filteredSneakers = sneakers.filter(
    (sneaker) =>
      sneaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sneaker.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-light dark:bg-mono-dark">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <Skeleton variant="text" className="h-16 w-3/4 mx-auto mb-4" />
            <Skeleton variant="text" className="h-6 w-2/4 mx-auto" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">{error}</Alert>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark">
      <div className="relative">
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold text-mono-dark dark:text-mono-light mb-6 tracking-tight leading-tight">
              Future of Footwear
            </h1>
            <p className="text-mono-dark-600 dark:text-mono-light-600 text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience the next generation of sneakers with our cutting-edge
              collection
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="#products"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 transform hover:scale-105 shadow-button hover:shadow-button-hover"
              >
                Shop Now
                <span className="ml-2 text-sm text-mono-light/70 dark:text-mono-dark/70">
                  Exclusive deals available!
                </span>
              </Link>
            </div>
          </div>

          {/* Featured Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "New Arrivals",
                path: "/category/new-arrivals",
                image: newArrival,
              },
              {
                title: "Trending Now",
                path: "/category/trending",
                image: trending,
              },
              {
                title: "Best Sellers",
                path: "/category/top-sellers",
                image: bestSeller,
              },
            ].map((collection) => (
              <Link
                key={collection.title}
                to={collection.path}
                className="relative group overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mono-dark/80 to-transparent" />
                </div>
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-mono-light">
                  {collection.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Search section removed */}

        {error && <Alert type="error">{error}</Alert>}

        {/* Products Grid */}
        <div
          id="products"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16"
        >
          {filteredSneakers.map((sneaker) => (
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
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={4} />
                  <span className="text-sm text-mono-dark-600 dark:text-mono-light-600">
                    (24)
                  </span>
                </div>
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

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-mono-dark dark:text-mono-light mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={TruckIcon}
              title="Free Shipping"
              description="Free shipping on all orders over $100"
            />
            <FeatureCard
              icon={ArrowPathIcon}
              title="Easy Returns"
              description="30-day easy return policy"
            />
            <FeatureCard
              icon={ShieldCheckIcon}
              title="100% Authentic"
              description="All products are guaranteed authentic"
            />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-mono-dark dark:text-mono-light mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                image: img1,
                text: "Best sneaker shopping experience ever! The quality is outstanding.",
                rating: 5,
              },
              {
                name: "Sarah Williams",
                image: img2,
                text: "Amazing selection and fast shipping. Will definitely shop here again!",
                rating: 5,
              },
              {
                name: "Mike Brown",
                image: img3, // updated image variable for Mike Brown
                text: "Great customer service and authentic products. Highly recommend!",
                rating: 4,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-mono-light-800 dark:bg-mono-dark-800 p-6 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-mono-dark dark:text-mono-light">
                      {testimonial.name}
                    </h3>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
                <p className="mt-4 text-mono-dark-600 dark:text-mono-light-600">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-mono-dark dark:text-mono-light mb-4">
            Get Exclusive Access
          </h2>
          <p className="text-mono-dark-600 dark:text-mono-light-600 mb-6">
            Subscribe to get exclusive discounts & early access to new drops!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 focus:border-mono-dark dark:focus:border-mono-light focus:outline-none text-mono-dark dark:text-mono-light"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-semibold hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 shadow-button hover:shadow-button-hover"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const WrappedHomePage = withLoading(HomePage);
export default WrappedHomePage;
