import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaEye,
    FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import QuickView from "./QuickView";

import "./ProductCard.css";

const ProductCard = ({ product }) => {

    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
    } = useCart();

    const [showQuickView, setShowQuickView] =
        useState(false);

    const [added, setAdded] = useState(false);

    // =========================================
    // PRICE FORMAT
    // =========================================

    const formatPrice = (price) => {
        return `₹${Number(price).toLocaleString("en-IN")}`;
    };

    // =========================================
    // ADD TO BAG
    // =========================================

    const handleAddToCart = (event) => {
        event.preventDefault();
        event.stopPropagation();

        addToCart(product);

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1500);
    };

    // =========================================
    // WISHLIST
    // =========================================

    const handleWishlist = (event) => {
        event.preventDefault();
        event.stopPropagation();

        toggleWishlist(product);
    };

    // =========================================
    // QUICK VIEW
    // =========================================

    const handleQuickView = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setShowQuickView(true);
    };

    return (
        <>
            <article className="product-card">

                {/* =====================================
                    IMAGE
                ===================================== */}

                <div className="product-card-image">

                    <Link
                        to={`/product/${product.id}`}
                        className="product-image-link"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    </Link>

                    {/* BADGE */}

                    {product.badge && (
                        <span className="product-badge">
                            {product.badge}
                        </span>
                    )}

                    {/* WISHLIST */}

                    <button
                        type="button"
                        className={`product-wishlist ${
                            isInWishlist(product.id)
                                ? "active"
                                : ""
                        }`}
                        onClick={handleWishlist}
                        aria-label="Add to wishlist"
                    >
                        {isInWishlist(product.id) ? (
                            <FaHeart />
                        ) : (
                            <FaRegHeart />
                        )}
                    </button>

                    {/* QUICK VIEW */}

                    <button
                        type="button"
                        className="product-quick-view"
                        onClick={handleQuickView}
                    >
                        <FaEye />

                        <span>QUICK VIEW</span>
                    </button>

                </div>

                {/* =====================================
                    PRODUCT INFO
                ===================================== */}

                <div className="product-card-info">

                    <Link
                        to={`/product/${product.id}`}
                        className="product-card-name"
                    >
                        {product.name}
                    </Link>

                    <p className="product-card-category">
                        {product.category}
                    </p>

                    <div className="product-card-bottom">

                        <div className="product-card-price">

                            <strong>
                                {formatPrice(product.price)}
                            </strong>

                            {product.oldPrice && (
                                <span>
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}

                        </div>

                        <button
                            type="button"
                            className={`product-add-button ${
                                added ? "added" : ""
                            }`}
                            onClick={handleAddToCart}
                            aria-label="Add to bag"
                        >
                            <FaShoppingBag />

                            <span>
                                {added ? "ADDED" : "ADD"}
                            </span>
                        </button>

                    </div>

                </div>

            </article>

            {/* =========================================
                QUICK VIEW MODAL
            ========================================= */}

            <QuickView
                product={product}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </>
    );
};

export default ProductCard;