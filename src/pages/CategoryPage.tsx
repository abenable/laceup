import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { kicksApi, categoriesApi } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import { type Category, type Sneaker } from "../types";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
import { ShoppingBagIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const fetchCategoryAndSneakers = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) throw new Error("Category ID is required");

        const categoryId = parseInt(id);
        const [categoryResponse, sneakersResponse] = await Promise.all([
          categoriesApi.getCategoryById(categoryId),
          kicksApi.getAllKicks(),
        ]);

        setCategory(categoryResponse.data);
        // Filter sneakers by category
        setSneakers(
          sneakersResponse.data.data.filter(
            (sneaker) => sneaker.category === categoryResponse.data.name
          )
        );
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndSneakers();
  }, [id]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">{error || "Category not found"}</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-mono-dark-600 dark:text-mono-light-600">
            {category.description}
          </p>
        )}
      </div>

      {sneakers.length === 0 ? (
        <Alert type="info">No sneakers found in this category.</Alert>
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

export default CategoryPage;
