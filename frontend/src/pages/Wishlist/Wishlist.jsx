import React from "react";
import { Link } from "react-router-dom";

import {
  FaHeart,
  FaShoppingBag,
  FaTrash,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import "./Wishlist.css";


const Wishlist = () => {

  // =========================================
  // WISHLIST + CART
  // =========================================

  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useCart();


  // =========================================
  // REMOVE FROM WISHLIST
  // =========================================

  const handleRemove = (product) => {

    toggleWishlist(product);

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = (product) => {

    addToCart(product);

  };


  // =========================================
  // EMPTY WISHLIST
  // =========================================

  if (wishlist.length === 0) {

    return (

      <main className="wishlist-page">

        <section className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <FaHeart />
          </div>

          <p className="wishlist-eyebrow">
            YOUR COLLECTION
          </p>

          <h1>
            Your Wishlist Is Empty
          </h1>

          <p className="wishlist-empty-text">
            Save the pieces you love and
            come back to them whenever you like.
          </p>

          <Link
            to="/shop"
            className="wishlist-shop-button"
          >
            EXPLORE JEWELLERY
          </Link>

        </section>

      </main>

    );

  }


  // =========================================
  // WISHLIST PAGE
  // =========================================

  return (

    <main className="wishlist-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="wishlist-header">

        <p className="wishlist-eyebrow">
          YOUR COLLECTION
        </p>

        <h1>
          Wishlist
        </h1>

        <p>
          {wishlist.length}{" "}
          {wishlist.length === 1
            ? "piece"
            : "pieces"
          }{" "}
          saved for later
        </p>

      </section>


      {/* =====================================
          PRODUCTS
      ===================================== */}

      <section className="wishlist-container">

        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <article
              className="wishlist-card"
              key={product.id}
            >

              {/* IMAGE */}

              <div className="wishlist-image">

                <Link
                  to={`/product/${product.id}`}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </Link>


                {/* REMOVE */}

                <button
                  className="wishlist-remove"
                  onClick={() =>
                    handleRemove(product)
                  }
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <FaTrash />
                </button>

              </div>


              {/* DETAILS */}

              <div className="wishlist-details">

                <p className="wishlist-category">
                  {product.category}
                </p>

                <Link
                  to={`/product/${product.id}`}
                  className="wishlist-name"
                >
                  {product.name}
                </Link>

                <div className="wishlist-price">

                  <strong>
                    ₹
                    {Number(product.price).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {product.oldPrice && (

                    <del>
                      ₹
                      {Number(product.oldPrice).toLocaleString(
                        "en-IN"
                      )}
                    </del>

                  )}

                </div>


                {/* ADD TO BAG */}

                <button
                  className="wishlist-add-cart"
                  onClick={() =>
                    handleAddToCart(product)
                  }
                >

                  <FaShoppingBag />

                  ADD TO BAG

                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>

  );

};


export default Wishlist;