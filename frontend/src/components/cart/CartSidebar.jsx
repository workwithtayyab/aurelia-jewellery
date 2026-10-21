import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";
import "./CartSidebar.css";

const CartSidebar = ({ show, setShow }) => {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  // Close sidebar
  const closeSidebar = () => {
    setShow(false);
  };

  // Format price in Indian currency
  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // Go to checkout
  const handleCheckout = () => {
    setShow(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {show && (
        <div
          className="cart-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`cart-sidebar ${
          show ? "cart-sidebar-open" : ""
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="cart-sidebar-header">
          <div>
            <p className="cart-sidebar-label">
              YOUR SELECTION
            </p>

            <h2>Shopping Bag</h2>
          </div>

          <button
            type="button"
            className="cart-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close shopping bag"
          >
            <FaTimes />
          </button>
        </div>

        {/* ================= CART COUNT ================= */}
        {cart.length > 0 && (
          <div className="cart-sidebar-count">
            {cartCount}{" "}
            {cartCount === 1 ? "item" : "items"} in your bag
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="cart-sidebar-content">
          {/* EMPTY CART */}
          {cart.length === 0 ? (
            <div className="sidebar-empty-cart">
              <div className="sidebar-empty-icon">
                <FaShoppingBag />
              </div>

              <h3>Your Bag Is Empty</h3>

              <p>
                Discover beautiful jewellery designed to
                become part of your story.
              </p>

              <Link
                to="/shop"
                className="sidebar-shop-button"
                onClick={closeSidebar}
              >
                EXPLORE JEWELLERY
              </Link>
            </div>
          ) : (
            /* CART ITEMS */
            <div className="sidebar-items">
              {cart.map((item) => (
                <article
                  className="sidebar-cart-item"
                  key={item.id}
                >
                  {/* Product Image */}
                  <div className="sidebar-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="sidebar-item-details">
                    <p className="sidebar-item-category">
                      {item.category}
                    </p>

                    <h3>{item.name}</h3>

                    <strong>
                      {formatPrice(item.price)}
                    </strong>

                    {/* Quantity Controls */}
                    <div className="sidebar-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <FaMinus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* Remove Product */}
                  <button
                    type="button"
                    className="sidebar-remove"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <FaTrash />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            {/* Subtotal */}
            <div className="sidebar-subtotal">
              <span>Subtotal</span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>
            </div>

            {/* Shipping Note */}
            <p className="sidebar-shipping-note">
              Shipping calculated at checkout.
            </p>

            {/* View Cart */}
            <Link
              to="/cart"
              className="sidebar-view-cart"
              onClick={closeSidebar}
            >
              VIEW SHOPPING BAG

              <FaArrowRight />
            </Link>

            {/* Checkout */}
            <button
              type="button"
              className="sidebar-checkout"
              onClick={handleCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;