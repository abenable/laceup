import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import { useCart } from "../contexts/CartContext";
import { ShoppingBagIcon, CheckIcon } from "@heroicons/react/24/outline";
import Alert from "../components/Alert";
import Skeleton from "../components/Skeleton";

type CategoryType = "men" | "women" | "top-sellers";

interface ApiResponse {
  Kicks: number;
  data: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
  }>;
}

const CATEGORY_TITLES: Record<CategoryType, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  "top-sellers": "Top Sellers",
};

const CATEGORY_DESCRIPTIONS: Record<CategoryType, string> = {
  men: "Explore our premium collection of men's sneakers.",
  women: "Discover stylish and comfortable sneakers for women.",
  "top-sellers": "Shop our most popular and best-selling sneakers.",
};

const CategoryPage = () => {
  const { category } = useParams<{ category: CategoryType }>();
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await kicksApi.getAllKicks();
        const apiResponse = response.data as unknown as ApiResponse;

        let filteredSneakers: Sneaker[] = apiResponse.data.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          description: item.description,
          category: item.category,
          images: [item.image],
          sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
        }));

        // Filter by category
        if (category !== "top-sellers") {
          filteredSneakers = filteredSneakers.filter(
            (sneaker: Sneaker) => sneaker.category?.toLowerCase() === category
          );
        } else {
          // For top sellers, you might want to implement different logic
          // For now, let's show the most expensive items as "top sellers"
          filteredSneakers.sort((a: Sneaker, b: Sneaker) => b.price - a.price);
          filteredSneakers = filteredSneakers.slice(0, 6);
        }

        // Sort sneakers
        switch (sortBy) {
          case "price-asc":
            filteredSneakers.sort(
              (a: Sneaker, b: Sneaker) => a.price - b.price
            );
            break;
          case "price-desc":
            filteredSneakers.sort(
              (a: Sneaker, b: Sneaker) => b.price - a.price
            );
            break;
          case "newest":
            // In a real app, you'd sort by date
            // For now, we'll keep the default order
            break;
        }

        setSneakers(filteredSneakers);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSneakers();
  }, [category, sortBy]);

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
        price: sneaker.price,
        size: defaultSize,
        quantity: 1,
        image: sneaker.images[0],
      });
    } else {
      const cartItem = findItemInCart(sneaker.id);
      if (cartItem) {
        removeFromCart(sneaker.id, cartItem.size);
      }
    }
  };

  if (!category || !CATEGORY_TITLES[category as CategoryType]) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">Category not found</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light mb-4">
            {CATEGORY_TITLES[category as CategoryType]}
          </h1>
          <p className="text-mono-dark-600 dark:text-mono-light-600 max-w-2xl mx-auto">
            {CATEGORY_DESCRIPTIONS[category as CategoryType]}
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex justify-end mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light focus:border-mono-dark dark:focus:border-mono-light focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {error && (
          <Alert type="error" className="mb-8">
            {error}
          </Alert>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg overflow-hidden border-2 border-mono-light-400 dark:border-mono-dark-400"
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
                      className="h-10 w-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : sneakers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-mono-dark-600 dark:text-mono-light-600">
                No products found in this category.
              </p>
            </div>
          ) : (
            sneakers.map((sneaker) => (
              <div
                key={sneaker.id}
                className="group bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg overflow-hidden border-2 border-mono-light-400 dark:border-mono-dark-400 transition-all duration-300 hover:border-mono-dark dark:hover:border-mono-light shadow-card hover:shadow-card-hover"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={sneaker.images[0]}
                    alt={sneaker.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-mono-dark dark:text-mono-light font-semibold text-lg mb-2">
                    {sneaker.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-xl font-bold text-mono-dark dark:text-mono-light">
                        ${sneaker.price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, sneaker)}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isInCart(sneaker.id)
                          ? "bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light"
                          : "bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark hover:bg-mono-dark-800 dark:hover:bg-mono-light-800"
                      } border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover`}
                    >
                      {isInCart(sneaker.id) ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <ShoppingBagIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
