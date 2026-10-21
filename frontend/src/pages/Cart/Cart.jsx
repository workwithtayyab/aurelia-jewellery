import React from "react";
import { Link } from "react-router-dom";

import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaLock,
  FaCheck,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import "./Cart.css";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const navigate = useNavigate();

  // =========================================
  // CART CONTEXT
  // =========================================

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();


  // =========================================
  // PRICE FORMAT
  // =========================================

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };


  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {

    return (

      <main className="cart-page">

        <section className="cart-empty">

          <p className="cart-eyebrow">
            YOUR SELECTION
          </p>

          <h1>
            Your Shopping Bag Is Empty
          </h1>

          <p>
            Discover beautiful jewellery designed
            to become part of your story.
          </p>

          <Link
            to="/shop"
            className="cart-continue-button"
          >
            EXPLORE JEWELLERY
          </Link>

        </section>

      </main>

    );

  }


  // =========================================
  // CART PAGE
  // =========================================

  return (

    <main className="cart-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="cart-header">

        <p className="cart-eyebrow">
          YOUR SELECTION
        </p>

        <h1>
          Shopping Bag
        </h1>

        <p className="cart-item-count">
          {cartCount}{" "}
          {cartCount === 1
            ? "piece"
            : "pieces"
          }{" "}
          in your bag
        </p>

      </section>


      {/* =====================================
          CART CONTENT
      ===================================== */}

      <section className="cart-container">


        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="cart-items-section">


          {/* TITLE + CLEAR CART */}

          <div className="cart-items-header">

            <h2>
              Your Items
            </h2>

            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              CLEAR CART
            </button>

          </div>


          {/* =====================================
              ITEMS
          ===================================== */}

          <div className="cart-items">

            {cart.map((item) => (

              <article
                className="cart-item"
                key={item.id}
              >


                {/* PRODUCT IMAGE */}

                <div className="cart-item-image">

                  <Link
                    to={`/product/${item.id}`}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </Link>

                </div>


                {/* PRODUCT DETAILS */}

                <div className="cart-item-details">

                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  {item.material && (

                    <p className="cart-item-material">
                      {item.material}
                    </p>

                  )}

                  <strong className="cart-item-price">
                    {formatPrice(item.price)}
                  </strong>

                </div>


                {/* QUANTITY */}

                <div className="cart-item-quantity">

                  <p>
                    QUANTITY
                  </p>

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>

                  </div>

                </div>


                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  <strong>
                    {formatPrice(
                      Number(item.price) *
                      item.quantity
                    )}
                  </strong>

                </div>


                {/* DELETE */}

                <button
                  className="cart-item-remove"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash />
                </button>

              </article>

            ))}

          </div>


          {/* =====================================
              CONTINUE SHOPPING
          ===================================== */}

          <Link
            to="/shop"
            className="continue-shopping"
          >

            <FaArrowLeft />

            <span>
              CONTINUE SHOPPING
            </span>

          </Link>

        </div>


        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

        <aside className="cart-summary">


          <p className="summary-eyebrow">
            ORDER SUMMARY
          </p>

          <h2>
            Your Order
          </h2>


          <div className="summary-divider" />


          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              {formatPrice(cartTotal)}
            </strong>

          </div>


          {/* SHIPPING */}

          <div className="summary-row">

            <span>
              Shipping
            </span>

            <strong>
              FREE
            </strong>

          </div>


          <p className="free-shipping-message">

            <FaCheck />

            Free shipping on your order

          </p>


          <div className="summary-divider" />


          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              {formatPrice(cartTotal)}
            </strong>

          </div>


          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            PROCEED TO CHECKOUT
          </button>


          {/* SECURITY */}

          <p className="secure-checkout">

            <FaLock />

            Secure & encrypted checkout

          </p>

        </aside>

      </section>

    </main >

  );

};


export default Cart;