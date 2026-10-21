import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaTimes,
    FaHeart,
    FaRegHeart,
    FaStar,
    FaMinus,
    FaPlus,
    FaShoppingBag,
    FaTruck,
    FaShieldAlt,
    FaUndo,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import "./QuickView.css";

const QuickView = ({ product, isOpen, onClose }) => {
    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
    } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // =========================================
    // CLOSE WITH ESCAPE
    // =========================================

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // =========================================
    // LOCK BACKGROUND SCROLL
    // =========================================

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // =========================================
    // RESET WHEN PRODUCT CHANGES
    // =========================================

    useEffect(() => {
        setQuantity(1);
        setAdded(false);
    }, [product]);

    if (!isOpen || !product) {
        return null;
    }

    // =========================================
    // PRICE FORMAT
    // =========================================

    const formatPrice = (price) => {
        return `₹${Number(price).toLocaleString("en-IN")}`;
    };

    // =========================================
    // ADD TO CART
    // =========================================

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1800);
    };

    // =========================================
    // QUANTITY
    // =========================================

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const increaseQuantity = () => {
        setQuantity((current) => current + 1);
    };

    // =========================================
    // WISHLIST
    // =========================================

    const wishlistActive = isInWishlist(product.id);

    const handleWishlist = () => {
        toggleWishlist(product);
    };

    // =========================================
    // CLOSE WHEN CLICKING OVERLAY
    // =========================================

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="quick-view-overlay"
            onMouseDown={handleOverlayClick}
        >
            <div
                className="quick-view-modal"
                role="dialog"
                aria-modal="true"
                aria-label={`Quick view of ${product.name}`}
            >
                {/* =====================================
                    CLOSE BUTTON
                ===================================== */}

                <button
                    type="button"
                    className="quick-view-close"
                    onClick={onClose}
                    aria-label="Close quick view"
                >
                    <FaTimes />
                </button>

                {/* =====================================
                    IMAGE
                ===================================== */}

                <div className="quick-view-image">
                    <img
                        src={product.image}
                        alt={product.name}
                    />

                    {product.badge && (
                        <span className="quick-view-badge">
                            {product.badge}
                        </span>
                    )}
                </div>

                {/* =====================================
                    DETAILS
                ===================================== */}

                <div className="quick-view-details">

                    <p className="quick-view-category">
                        {product.category}
                    </p>

                    <h2>{product.name}</h2>

                    {/* RATING */}

                    <div className="quick-view-rating">
                        <span className="quick-stars">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </span>

                        <span className="quick-rating-text">
                            4.9 · 28 Reviews
                        </span>
                    </div>

                    {/* PRICE */}

                    <div className="quick-view-price">

                        <strong>
                            {formatPrice(product.price)}
                        </strong>

                        {product.oldPrice && (
                            <span>
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}

                    </div>

                    {/* DESCRIPTION */}

                    <p className="quick-view-description">
                        {product.description ||
                            "A timeless Aurelia piece crafted to add effortless elegance to your everyday style."}
                    </p>

                    {/* PRODUCT INFO */}

                    <div className="quick-view-info">

                        {product.material && (
                            <div className="quick-info-item">
                                <span>Material</span>
                                <strong>
                                    {product.material}
                                </strong>
                            </div>
                        )}

                        <div className="quick-info-item">
                            <span>Category</span>
                            <strong>
                                {product.category}
                            </strong>
                        </div>

                    </div>

                    {/* =====================================
                        QUANTITY
                    ===================================== */}

                    <div className="quick-view-purchase">

                        <div className="quick-quantity">

                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                aria-label="Decrease quantity"
                            >
                                <FaMinus />
                            </button>

                            <span>{quantity}</span>

                            <button
                                type="button"
                                onClick={increaseQuantity}
                                aria-label="Increase quantity"
                            >
                                <FaPlus />
                            </button>

                        </div>

                        <button
                            type="button"
                            className={`quick-add-button ${
                                added ? "added" : ""
                            }`}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingBag />

                            {added
                                ? "ADDED TO BAG"
                                : "ADD TO BAG"}
                        </button>

                        <button
                            type="button"
                            className={`quick-wishlist ${
                                wishlistActive ? "active" : ""
                            }`}
                            onClick={handleWishlist}
                            aria-label="Add to wishlist"
                        >
                            {wishlistActive ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}
                        </button>

                    </div>

                    {/* =====================================
                        BENEFITS
                    ===================================== */}

                    <div className="quick-view-benefits">

                        <div className="quick-benefit">
                            <FaTruck />

                            <div>
                                <strong>
                                    Complimentary Delivery
                                </strong>

                                <span>
                                    Free shipping on your order
                                </span>
                            </div>
                        </div>

                        <div className="quick-benefit">
                            <FaShieldAlt />

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>

                                <span>
                                    Safe & secure payments
                                </span>
                            </div>
                        </div>

                        <div className="quick-benefit">
                            <FaUndo />

                            <div>
                                <strong>
                                    Easy Returns
                                </strong>

                                <span>
                                    Simple return process
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* =====================================
                        VIEW FULL DETAILS
                    ===================================== */}

                    <Link
                        to={`/product/${product.id}`}
                        className="quick-view-details-link"
                        onClick={onClose}
                    >
                        VIEW FULL PRODUCT DETAILS
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default QuickView;