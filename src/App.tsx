import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ErrorBoundary, { RouteErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./components/Toast";
import { LoadingProvider } from "./contexts/LoadingContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";

// Lazy load pages with explicit typing
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({
    default: module.default,
  }))
);
const SneakerPage = lazy(() => import("./pages/SneakerPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsAndConditionsPage = lazy(
  () => import("./pages/TermsAndConditionsPage")
);
const AccountPage = lazy(() => import("./pages/AccountPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MenPage = lazy(() => import("./pages/MenPage"));
const WomenPage = lazy(() => import("./pages/WomenPage"));
const TrendingPage = lazy(() => import("./pages/TrendingPage"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LoadingProvider>
            <ToastProvider>
              <CartProvider>
                <div className="min-h-screen bg-cyber-light dark:bg-cyber-dark text-cyber-dark dark:text-cyber-light transition-colors duration-300 flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route
                          path="/"
                          element={<HomePage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/sneaker/:id"
                          element={<SneakerPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/cart"
                          element={<CartPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          }
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/order-success"
                          element={
                            <ProtectedRoute>
                              <OrderSuccessPage />
                            </ProtectedRoute>
                          }
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/register"
                          element={<RegisterPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/login"
                          element={<LoginPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/search"
                          element={<SearchPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        {/* New Routes */}
                        <Route
                          path="/about"
                          element={<AboutPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/contact"
                          element={<ContactPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/category/:category"
                          element={<CategoryPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute adminOnly>
                              <AdminPage />
                            </ProtectedRoute>
                          }
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/privacy-policy"
                          element={<PrivacyPolicyPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/terms"
                          element={<TermsAndConditionsPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute>
                              <AccountPage />
                            </ProtectedRoute>
                          }
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <SettingsPage />
                            </ProtectedRoute>
                          }
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/men"
                          element={<MenPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/women"
                          element={<WomenPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route
                          path="/trending"
                          element={<TrendingPage />}
                          errorElement={<RouteErrorBoundary />}
                        />
                        <Route path="*" element={<RouteErrorBoundary />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                <Analytics />
              </CartProvider>
            </ToastProvider>
          </LoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
