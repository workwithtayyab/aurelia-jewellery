import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";


import {
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowLeft,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaStar,
  FaRegStar,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

import { useProducts } from "../../Context/ProductContext";
import { useCart } from "../../Context/CartContext";
import RelatedProducts from "../../components/products/RelatedProducts";
import RecentlyViewed from "../../components/products/RecentlyViewed";
import ProductGallery from "../../components/products/ProductGallery";

import "./Product.css";

const Product = () => {
  const { products } = useProducts();
  const { id } = useParams();


  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState(
    []
  );

  const [reviewName, setReviewName] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);

  // =========================================
  // FIND PRODUCT
  // =========================================

  const product = products.find(
    (item) => item.id === Number(id)
  );

  // =========================================
  // LOAD REVIEWS
  // =========================================

  useEffect(() => {
    if (!product) {
      return;
    }

    try {
      const savedReviews =
        localStorage.getItem(
          `aurelia-reviews-${product.id}`
        );

      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      );

      setReviews([]);
    }

    setReviewName("");
    setReviewRating(5);
    setReviewText("");
    setReviewSubmitted(false);
  }, [product]);

  // =========================================
  // PRODUCT DOESN'T EXIST
  // =========================================

  if (!product) {
    return (
      <main className="product-not-found">

        <h1>
          Product Not Found
        </h1>

        <p>
          Sorry, we couldn't find the jewellery
          you're looking for.
        </p>

        <Link
          to="/shop"
          className="back-shop-btn"
        >
          BACK TO SHOP
        </Link>

      </main>
    );
  }

  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(1, current - 1)
    );
  };

  // =========================================
  // ADD PRODUCT TO BAG
  // =========================================

  const addProductToBag = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // =========================================
  // WISHLIST
  // =========================================

  const wishlistActive =
    isInWishlist(product.id);

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  // =========================================
  // REVIEW STATISTICS
  // =========================================

  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        counts: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const counts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      if (counts[review.rating] !== undefined) {
        counts[review.rating]++;
      }
    });

    const totalRating = reviews.reduce(
      (total, review) =>
        total + Number(review.rating),
      0
    );

    return {
      average:
        totalRating / reviews.length,
      total: reviews.length,
      counts,
    };
  }, [reviews]);

  // =========================================
  // SUBMIT REVIEW
  // =========================================

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (
      !reviewName.trim() ||
      !reviewText.trim()
    ) {
      return;
    }

    const newReview = {
      id: Date.now(),

      name: reviewName.trim(),

      rating: Number(reviewRating),

      text: reviewText.trim(),

      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
    };

    const updatedReviews = [
      newReview,
      ...reviews,
    ];

    setReviews(updatedReviews);

    localStorage.setItem(
      `aurelia-reviews-${product.id}`,
      JSON.stringify(updatedReviews)
    );

    setReviewName("");
    setReviewRating(5);
    setReviewText("");

    setReviewSubmitted(true);

    setTimeout(() => {
      setReviewSubmitted(false);
    }, 3000);
  };

  // =========================================
  // DELETE REVIEW
  // =========================================

  const deleteReview = (reviewId) => {
    const updatedReviews =
      reviews.filter(
        (review) =>
          review.id !== reviewId
      );

    setReviews(updatedReviews);

    localStorage.setItem(
      `aurelia-reviews-${product.id}`,
      JSON.stringify(updatedReviews)
    );
  };

  // =========================================
  // RENDER STARS
  // =========================================

  const renderStars = (
    rating,
    size = "normal"
  ) => {
    return (
      <div
        className={`review-stars ${size}`}
        aria-label={`${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map(
          (star) =>
            star <= rating ? (
              <FaStar key={star} />
            ) : (
              <FaRegStar key={star} />
            )
        )}
      </div>
    );
  };

  return (
    <main className="product-page">

      <div className="product-container">

        {/* ==============================
            BACK TO SHOP
        ============================== */}

        <Link
          to="/shop"
          className="product-back"
        >
          <FaArrowLeft />
          <span>Back to Shop</span>
        </Link>


        {/* ==============================
            PRODUCT MAIN
        ============================== */}

        <section className="product-main">

          {/* PRODUCT IMAGE */}

          <div className="product-main">

            {/* PRODUCT GALLERY */}

            <ProductGallery product={product} />

            {/* PRODUCT DETAILS */}

            <div className="product-details">

              {/* keep everything you already have here */}

            </div>

          </div>


          {/* PRODUCT INFORMATION */}

          <div className="product-details">

            {/* CATEGORY */}

            <p className="detail-category">
              {product.category}
            </p>


            {/* NAME */}

            <h1>
              {product.name}
            </h1>


            {/* RATING */}

            <a
              href="#reviews"
              className="detail-rating"
            >

              <span>
                ★★★★★
              </span>

              <p>
                {reviewStats.total > 0
                  ? `${reviewStats.average.toFixed(
                    1
                  )} · ${reviewStats.total
                  } Reviews`
                  : "Be the first to review"}
              </p>

            </a>


            {/* PRICE */}

            <div className="detail-price">

              <strong>
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              <del>
                ₹
                {product.oldPrice.toLocaleString(
                  "en-IN"
                )}
              </del>

              <span className="discount">

                {Math.round(
                  ((product.oldPrice -
                    product.price) /
                    product.oldPrice) *
                  100
                )}
                % OFF

              </span>

            </div>


            {/* DESCRIPTION */}

            <p className="detail-description">
              {product.description}
            </p>


            {/* PRODUCT INFORMATION */}

            <div className="detail-info">

              <div className="detail-info-row">

                <span>
                  Material
                </span>

                <strong>
                  {product.material}
                </strong>

              </div>


              <div className="detail-info-row">

                <span>
                  Category
                </span>

                <strong>
                  {product.category}
                </strong>

              </div>

            </div>


            {/* QUANTITY */}

            <div className="quantity-section">

              <h3>
                Quantity
              </h3>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>

              </div>

            </div>


            {/* ACTION BUTTONS */}

            <div className="product-actions">

              <button
                type="button"
                className={`add-to-bag ${added ? "added" : ""
                  }`}
                onClick={
                  addProductToBag
                }
              >

                <FaShoppingBag />

                <span>
                  {added
                    ? "ADDED TO BAG"
                    : "ADD TO BAG"}
                </span>

              </button>


              <button
                type="button"
                className={`wishlist-button ${wishlistActive
                  ? "active"
                  : ""
                  }`}
                onClick={
                  handleWishlist
                }
                aria-label={
                  wishlistActive
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >

                <FaHeart />

              </button>

            </div>


            {/* BENEFITS */}

            <div className="product-benefits">

              <div className="benefit">

                <FaTruck />

                <div>

                  <strong>
                    Free Shipping
                  </strong>

                  <p>
                    Free delivery on orders
                    above ₹5,000
                  </p>

                </div>

              </div>


              <div className="benefit">

                <FaShieldAlt />

                <div>

                  <strong>
                    Authenticity Guaranteed
                  </strong>

                  <p>
                    Every piece is carefully
                    inspected
                  </p>

                </div>

              </div>


              <div className="benefit">

                <FaUndo />

                <div>

                  <strong>
                    Easy Returns
                  </strong>

                  <p>
                    7-day hassle-free returns
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==============================
            ABOUT THE PIECE
        ============================== */}

        <section className="product-description-section">

          <div>

            <span>
              ABOUT THE PIECE
            </span>

            <h2>
              Made to become part of your story.
            </h2>

          </div>


          <p>
            At AURELIA, every piece is designed
            with timeless elegance in mind. The{" "}
            <strong>
              {product.name}
            </strong>{" "}
            combines refined design with carefully
            selected materials to create jewellery
            you'll love wearing for years to come.
          </p>

        </section>


        {/* ==============================
            REVIEWS
        ============================== */}

        <section
          id="reviews"
          className="product-reviews-section"
        >

          {/* REVIEWS HEADER */}

          <div className="reviews-section-header">

            <div>

              <span>
                CUSTOMER FEEDBACK
              </span>

              <h2>
                Reviews & Ratings
              </h2>

            </div>

            <p>
              {reviewStats.total}{" "}
              {reviewStats.total === 1
                ? "Review"
                : "Reviews"}
            </p>

          </div>


          {/* REVIEW SUMMARY */}

          <div className="reviews-summary">

            <div className="review-average">

              <strong>
                {reviewStats.total > 0
                  ? reviewStats.average.toFixed(
                    1
                  )
                  : "—"}
              </strong>

              {reviewStats.total > 0
                ? renderStars(
                  Math.round(
                    reviewStats.average
                  ),
                  "large"
                )
                : (
                  <div className="empty-stars">
                    ☆☆☆☆☆
                  </div>
                )}

              <span>
                Based on{" "}
                {reviewStats.total}{" "}
                {reviewStats.total === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>


            {/* BREAKDOWN */}

            <div className="rating-breakdown">

              {[5, 4, 3, 2, 1].map(
                (rating) => {

                  const percentage =
                    reviewStats.total > 0
                      ? (
                        (reviewStats.counts[
                          rating
                        ] /
                          reviewStats.total) *
                        100
                      )
                      : 0;

                  return (
                    <div
                      className="rating-row"
                      key={rating}
                    >

                      <span>
                        {rating} ★
                      </span>

                      <div className="rating-bar">

                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <small>
                        {
                          reviewStats.counts[
                          rating
                          ]
                        }
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </div>


          {/* WRITE REVIEW */}

          <div className="write-review">

            <div className="write-review-header">

              <div>

                <span>
                  SHARE YOUR EXPERIENCE
                </span>

                <h3>
                  Write a Review
                </h3>

              </div>

              <FaStar />

            </div>


            {reviewSubmitted && (
              <div className="review-success">

                <FaCheck />

                <span>
                  Thank you! Your review has
                  been added.
                </span>

              </div>
            )}


            <form
              onSubmit={
                handleReviewSubmit
              }
            >

              {/* NAME */}

              <div className="review-form-group">

                <label htmlFor="review-name">
                  Your Name
                </label>

                <input
                  id="review-name"
                  type="text"
                  placeholder="Enter your name"
                  value={reviewName}
                  onChange={(event) =>
                    setReviewName(
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* RATING */}

              <div className="review-form-group">

                <label>
                  Your Rating
                </label>

                <div className="rating-selector">

                  {[1, 2, 3, 4, 5].map(
                    (rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={
                          rating <=
                            reviewRating
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setReviewRating(
                            rating
                          )
                        }
                        aria-label={`${rating} star rating`}
                      >
                        <FaStar />
                      </button>
                    )
                  )}

                </div>

              </div>


              {/* REVIEW */}

              <div className="review-form-group">

                <label htmlFor="review-text">
                  Your Review
                </label>

                <textarea
                  id="review-text"
                  rows="5"
                  placeholder="Tell us about your experience with this piece..."
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              <button
                type="submit"
                className="submit-review"
              >
                SUBMIT REVIEW
                <FaArrowRight />
              </button>

            </form>

          </div>


          {/* CUSTOMER REVIEWS */}

          <div className="customer-reviews">

            <div className="customer-reviews-heading">

              <span>
                WHAT OUR CUSTOMERS SAY
              </span>

              <h3>
                Customer Reviews
              </h3>

            </div>


            {reviews.length === 0 ? (

              <div className="no-reviews">

                <FaStar />

                <h4>
                  No reviews yet
                </h4>

                <p>
                  Be the first to share your
                  experience with this piece.
                </p>

              </div>

            ) : (

              <div className="review-list">

                {reviews.map((review) => (

                  <article
                    className="review-card"
                    key={review.id}
                  >

                    <div className="review-card-top">

                      <div className="reviewer-info">

                        <div className="reviewer-avatar">
                          {review.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {review.name}
                          </strong>

                          <span>
                            {review.date}
                          </span>

                        </div>

                      </div>


                      {renderStars(
                        review.rating
                      )}

                    </div>


                    <p className="review-text">
                      {review.text}
                    </p>


                    <button
                      type="button"
                      className="delete-review"
                      onClick={() =>
                        deleteReview(
                          review.id
                        )
                      }
                    >
                      <FaTrash />
                      DELETE
                    </button>

                  </article>


                ))}


              </div>


            )}

          </div>

        </section>

      </div>
      <RelatedProducts
        currentProduct={product}
      />
      <RecentlyViewed
        currentProduct={product}
      />

    </main>
  );
};

export default Product;