
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaBoxOpen,
  FaCheck,
  FaTrash,
  FaLock,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import "./Navbar.css";

const Navbar = ({ setShowCart }) => {
  // CART + WISHLIST
  const { cartCount, wishlistCount } = useCart();

  // LOCATION
  const location = useLocation();

  // MOBILE MENU
  const [menuOpen, setMenuOpen] = useState(false);

  // NOTIFICATION
  const [notification, setNotification] = useState(null);

  // CLOSE MOBILE MENU ON PAGE CHANGE
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // SHOW NOTIFICATION
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  // OPEN CART
  const handleCartClick = () => {
    if (setShowCart) {
      setShowCart(true);
    }
  };

  // WISHLIST CLICK
  const handleWishlistClick = () => {
    if (wishlistCount === 0) {
      showNotification("Your wishlist is empty", "removed");
    }
  };

  // ACTIVE LINK
  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  // HIDE CUSTOMER NAVBAR ON ADMIN PAGES
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            AURELIA<span>.</span>
          </Link>

          {/* DESKTOP / MOBILE NAVIGATION */}
          <nav
            className={`navbar-links ${
              menuOpen ? "navbar-links-open" : ""
            }`}
          >
            <Link to="/" className={isActive("/")}>
              HOME
            </Link>

            <Link to="/shop" className={isActive("/shop")}>
              SHOP
            </Link>

            <Link to="/about">OUR STORY</Link>

            <Link to="/contact" className={isActive("/contact")}>
              CONTACT
            </Link>

            {/* MY ORDERS */}
            <Link
              to="/history"
              className={`navbar-orders-link ${isActive("/history")}`}
            >
              <FaBoxOpen />
              <span>MY ORDERS</span>
            </Link>

            {/* ADMIN LOGIN */}
            <Link
              to="/admin/login"
              className="navbar-admin-link"
              aria-label="Open admin login"
            >
              <FaLock />
              <span>ADMIN LOGIN</span>
            </Link>
          </nav>

          {/* NAVBAR ACTIONS */}
          <div className="navbar-actions">
            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="navbar-icon"
              aria-label="Wishlist"
              onClick={handleWishlistClick}
            >
              <FaHeart />

              {wishlistCount > 0 && (
                <span className="navbar-count">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* ACCOUNT */}
            <Link
              to="/account"
              className="navbar-icon account-icon"
              aria-label="Account"
            >
              <FaUser />
            </Link>

            {/* CART */}
            <button
              type="button"
              className="navbar-icon cart-icon"
              onClick={handleCartClick}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <FaShoppingBag />

              {cartCount > 0 && (
                <span className="navbar-count">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              type="button"
              className="navbar-menu-button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATION */}
      {notification && (
        <div
          className={`navbar-notification ${
            notification.type === "removed"
              ? "notification-removed"
              : ""
          }`}
          role="status"
        >
          <div className="notification-icon">
            {notification.type === "removed" ? (
              <FaTrash />
            ) : (
              <FaCheck />
            )}
          </div>

          <div className="notification-content">
            <strong>
              {notification.type === "removed" ? "Notice" : "Success"}
            </strong>

            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
