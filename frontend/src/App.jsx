
import React, { useState } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// Shared components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import CartSidebar from "./components/cart/CartSidebar";

// Customer pages
import Home from "./pages/home/Home";
import Shop from "./pages/Shop/Shop";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import History from "./pages/History/History";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Account from "./pages/Account/Account";
import About from "./pages/About/About";

// Admin pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProducts from "./pages/Admin/AdminProducts";
import ProtectedAdminRoute from "./pages/Admin/ProtectedAdminRoute";



// ==========================================
// ANIMATED ROUTES
// ==========================================
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <Routes location={location}>
          {/* Customer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />
          <Route path="/about" element={<About />} />

          <Route path="/history" element={<History />} />

          <Route
            path="/order-details/:orderNumber"
            element={<OrderDetails />}
          />

          <Route path="/account" element={<Account />} />

          {/* Admin login: public route */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Protected admin routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />
            </Route>
          </Route>

          {/* 404 page */}
          <Route
            path="*"
            element={
              <main className="not-found-page">
                <h1>404</h1>
                <p>Sorry, this page could not be found.</p>
              </main>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ==========================================
// MAIN APP
// ==========================================
function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin");

  const [showCart, setShowCart] = useState(false);

  return (
    <>
      {/* Customer navigation */}
      {!isAdminRoute && (
        <Navbar setShowCart={setShowCart} />
      )}

      {/* Cart sidebar */}
      {!isAdminRoute && (
        <CartSidebar
          show={showCart}
          setShow={setShowCart}
        />
      )}

      {/* Animated page content */}
      <AnimatedRoutes />

      {/* Customer footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
