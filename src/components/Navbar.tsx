import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useLoading } from "../contexts/LoadingContext";
import {
  SunIcon,
  MoonIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useCallback } from "react";
import Skeleton from "./Skeleton";
import { kicksApi, type Sneaker } from "../services/api";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth()!;
  const { getItemCount } = useCart();
  const { isLoading } = useLoading();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Sneaker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement)[]>([]);
  const totalItems = getItemCount();
  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isDropdownOpen) return;

      const focusableElements = menuItemRefs.current.filter(Boolean);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    },
    [isDropdownOpen]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle search dropdown close
      if (
        searchResultsRef.current &&
        searchInputRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }

      // Handle dropdown close
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      // Handle mobile menu close
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add escape key handler
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        handleTabKey(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleTabKey]);

  useEffect(() => {
    if (totalItems > 0) {
      setIsCartUpdated(true);
      const timer = setTimeout(() => setIsCartUpdated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    if (isDropdownOpen) {
      menuItemRefs.current[0]?.focus();
    }
  }, [isDropdownOpen]);

  const handleThemeToggle = () => {
    setIsThemeTransitioning(true);
    toggleDarkMode();
    setTimeout(() => setIsThemeTransitioning(false), 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      searchSneakers(query);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const searchSneakers = async (query: string) => {
    try {
      const response = await kicksApi.getAllKicks();
      const allSneakers = response.data.data;

      // Filter sneakers based on the query
      const filteredSneakers = allSneakers
        .filter(
          (sneaker: Sneaker) =>
            sneaker.name.toLowerCase().includes(query.toLowerCase()) ||
            (sneaker.description &&
              sneaker.description.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5); // Limit to 5 results for dropdown

      setSearchResults(filteredSneakers);
      setIsSearching(false);
    } catch (error) {
      console.error("Error searching sneakers:", error);
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = (sneakerId: number) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    navigate(`/sneaker/${sneakerId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchDropdown(false);
    }
  };

  const CartBadge = () =>
    totalItems > 0 && (
      <span
        className={`
          absolute -top-1 -right-1 
          bg-mono-dark dark:bg-mono-light 
          text-mono-light dark:text-mono-dark 
          text-xs font-bold rounded-full 
          min-w-[20px] h-5 
          flex items-center justify-center px-1
          shadow-lg
          transition-transform duration-300
          ${isCartUpdated ? "scale-125" : "scale-100"}
        `}
      >
        {totalItems > 99 ? "99+" : totalItems}
      </span>
    );

  const renderNavLinks = () => (
    <div
      ref={mobileMenuRef}
      className={`
        md:flex items-center space-x-8 lg:space-x-12
        absolute md:relative top-full left-0 right-0
        flex flex-col md:flex-row space-y-4 md:space-y-0 
        p-6 md:p-0 bg-mono-light/95 dark:bg-mono-dark/95 
        border-b border-mono-light-400 dark:border-mono-dark-400 
        backdrop-blur-sm z-50
        transition-all duration-300 origin-top
        ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none md:opacity-100 md:scale-y-100 md:translate-y-0 md:pointer-events-auto"
        }
      `}
    >
      {isLoading ? (
        <>
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-20" />
        </>
      ) : (
        <>
          {[
            { to: "/trending", label: "Trending" },
            { to: "/men", label: "Men" },
            { to: "/women", label: "Women" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }: { isActive: boolean }) => `
                text-mono-dark dark:text-mono-light 
                hover:text-mono-dark-600 dark:hover:text-mono-light-600 
                transition-all duration-300
                relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]
                after:bg-mono-dark dark:after:bg-mono-light after:transition-all after:duration-300
                ${isActive ? "after:scale-x-100" : "after:scale-x-0"}
                ${isMobileMenuOpen ? "text-lg py-2" : ""}
              `}
            >
              {label}
            </NavLink>
          ))}
          {/* Show Sign In button in mobile menu */}
          {!user && (
            <div className="md:hidden pt-4 mt-4 border-t border-mono-light-400 dark:border-mono-dark-400 w-full">
              <Link
                to="/login"
                className="block w-full text-center py-3.5 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <nav
      className="backdrop-blur-md bg-mono-light/80 dark:bg-mono-dark/80 border-b border-mono-light-400 dark:border-mono-dark-400 sticky top-0 z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left section with Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-10 h-10 bg-mono-dark dark:bg-mono-light rounded-lg flex items-center justify-center">
                <span className="text-mono-light dark:text-mono-dark font-bold text-xl">
                  L
                </span>
              </div>
              <span className="text-mono-dark dark:text-mono-light text-xl font-bold tracking-wider hover:text-mono-dark-600 dark:hover:text-mono-light-600 transition-colors duration-300">
                LaceUp
              </span>
            </Link>
          </div>

          {/* Center section with Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center">
            {renderNavLinks()}
          </div>

          {/* Right section with Search and Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar */}
            <div className="max-w-[180px] mr-1 relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() =>
                      searchQuery.length >= 2 && setShowSearchDropdown(true)
                    }
                    placeholder="Search..."
                    className="w-full pr-8 pl-3 py-1.5 text-sm text-mono-dark dark:text-mono-light bg-mono-light dark:bg-mono-dark border border-mono-light-400 dark:border-mono-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-dark-600 dark:focus:ring-mono-light-600"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-mono-dark-600 dark:text-mono-light-600 hover:text-mono-dark dark:hover:text-mono-light transition-colors duration-300"
                    aria-label="Search"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchDropdown && (
                <div
                  ref={searchResultsRef}
                  className="absolute z-50 mt-1 w-72 max-h-80 overflow-auto bg-mono-light dark:bg-mono-dark border border-mono-light-400 dark:border-mono-dark-400 rounded-lg shadow-lg"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-mono-dark-600 dark:text-mono-light-600">
                      <Skeleton variant="text" className="h-5 w-full mb-2" />
                      <Skeleton variant="text" className="h-5 w-full mb-2" />
                      <Skeleton variant="text" className="h-5 w-3/4" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((sneaker) => (
                        <div
                          key={sneaker.id}
                          className="p-3 border-b border-mono-light-400 dark:border-mono-dark-400 last:border-b-0 hover:bg-mono-light-400 dark:hover:bg-mono-dark-400 cursor-pointer transition-colors duration-150 flex items-center"
                          onClick={() => handleSearchItemClick(sneaker.id)}
                        >
                          <div className="w-12 h-12 mr-3 overflow-hidden rounded">
                            <img
                              src={sneaker.image}
                              alt={sneaker.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-mono-dark dark:text-mono-light font-medium text-sm truncate">
                              {sneaker.name}
                            </p>
                            <p className="text-mono-dark-600 dark:text-mono-light-600 text-xs">
                              ${parseFloat(sneaker.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="p-2 text-center border-t border-mono-light-400 dark:border-mono-dark-400">
                        <button
                          onClick={() => {
                            navigate(
                              `/search?q=${encodeURIComponent(searchQuery)}`
                            );
                            setShowSearchDropdown(false);
                            setSearchQuery("");
                          }}
                          className="text-xs font-medium text-mono-dark-600 dark:text-mono-light-600 hover:text-mono-dark dark:hover:text-mono-light transition-colors duration-150"
                        >
                          See all results
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-mono-dark-600 dark:text-mono-light-600">
                      No results found for "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Cart with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-mono-dark dark:text-mono-light hover:text-mono-dark-600 dark:hover:text-mono-light-600 transition-all duration-300"
              aria-label={`Cart with ${totalItems} items`}
            >
              {isLoading ? (
                <Skeleton variant="circular" className="w-6 h-6" />
              ) : (
                <>
                  <ShoppingBagIcon className="h-6 w-6" />
                  <CartBadge />
                </>
              )}
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <Skeleton variant="circular" className="w-8 h-8" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsDropdownOpen(!isDropdownOpen)
                  }
                  className="flex items-center space-x-2 text-mono-dark dark:text-mono-light hover:text-mono-dark-600 dark:hover:text-mono-light-600 transition-all duration-300"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <UserCircleIcon className="h-8 w-8" />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-[50vw] max-w-md py-2 bg-mono-light dark:bg-mono-dark border border-mono-light-400 dark:border-mono-dark-400 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 origin-top-right ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="/account"
                    className="block w-full px-6 py-3 text-mono-dark dark:text-mono-light hover:bg-mono-dark/10 dark:hover:bg-mono-light/10 transition-all duration-300"
                    onClick={() => setIsDropdownOpen(false)}
                    role="menuitem"
                    tabIndex={0}
                    ref={(el) => {
                      if (el) menuItemRefs.current[0] = el;
                    }}
                  >
                    Account
                  </Link>
                  <Link
                    to="/settings"
                    className="block w-full px-6 py-3 text-mono-dark dark:text-mono-light hover:bg-mono-dark/10 dark:hover:bg-mono-light/10 transition-all duration-300"
                    onClick={() => setIsDropdownOpen(false)}
                    role="menuitem"
                    tabIndex={0}
                    ref={(el) => {
                      if (el) menuItemRefs.current[1] = el;
                    }}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        setIsDropdownOpen(false);
                        await logout();
                      } catch (err) {
                        console.error("Logout failed:", err);
                      }
                    }}
                    className="w-full text-left px-6 py-3 text-mono-dark dark:text-mono-light hover:bg-mono-dark/10 dark:hover:bg-mono-light/10 transition-all duration-300"
                    role="menuitem"
                    tabIndex={0}
                    ref={(el) => {
                      if (el) menuItemRefs.current[2] = el;
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={handleThemeToggle}
              disabled={isThemeTransitioning}
              className={`p-2 text-mono-dark dark:text-mono-light hover:text-mono-dark-600 dark:hover:text-mono-light-600 transition-all duration-300 ${
                isThemeTransitioning ? "opacity-50" : ""
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon
                  className={`h-6 w-6 ${
                    isThemeTransitioning ? "animate-spin" : ""
                  }`}
                />
              ) : (
                <MoonIcon
                  className={`h-6 w-6 ${
                    isThemeTransitioning ? "animate-spin" : ""
                  }`}
                />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative text-mono-dark dark:text-mono-light hover:text-mono-dark-600 dark:hover:text-mono-light-600"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu - displayed below the navbar */}
        <div className="md:hidden">{isMobileMenuOpen && renderNavLinks()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
