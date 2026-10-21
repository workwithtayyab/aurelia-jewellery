import React, { useEffect, useState } from "react";

import {
    FaChevronLeft,
    FaChevronRight,
    FaExpand,
    FaTimes,
} from "react-icons/fa";

import "./ProductGallery.css";

const ProductGallery = ({ product }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);

    // =========================================
    // PRODUCT IMAGES
    // =========================================

    const images =
        product?.images?.length > 0
            ? product.images
            : product?.gallery?.length > 0
            ? product.gallery
            : [product?.image];

    // =========================================
    // RESET IMAGE WHEN PRODUCT CHANGES
    // =========================================

    useEffect(() => {
        setActiveImage(0);
        setShowFullscreen(false);
    }, [product?.id]);

    // =========================================
    // PREVIOUS IMAGE
    // =========================================

    const previousImage = () => {
        setActiveImage((current) =>
            current === 0
                ? images.length - 1
                : current - 1
        );
    };

    // =========================================
    // NEXT IMAGE
    // =========================================

    const nextImage = () => {
        setActiveImage((current) =>
            current === images.length - 1
                ? 0
                : current + 1
        );
    };

    // =========================================
    // KEYBOARD CONTROLS
    // =========================================

    useEffect(() => {
        if (!showFullscreen) {
            return;
        }

        const handleKeyboard = (event) => {
            if (event.key === "Escape") {
                setShowFullscreen(false);
            }

            if (event.key === "ArrowLeft") {
                previousImage();
            }

            if (event.key === "ArrowRight") {
                nextImage();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyboard
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyboard
            );

            document.body.style.overflow = "";
        };
    }, [showFullscreen, images.length]);

    if (!product) {
        return null;
    }

    return (
        <>
            <div className="product-gallery">

                {/* =====================================
                    THUMBNAILS
                ===================================== */}

                {images.length > 1 && (
                    <div className="product-gallery-thumbnails">

                        {images.map((image, index) => (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                className={`product-gallery-thumbnail ${
                                    activeImage === index
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveImage(index)
                                }
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} view ${
                                        index + 1
                                    }`}
                                />
                            </button>
                        ))}

                    </div>
                )}

                {/* =====================================
                    MAIN IMAGE
                ===================================== */}

                <div
                    className="product-gallery-main"
                    onClick={() =>
                        setShowFullscreen(true)
                    }
                >
                    <img
                        src={images[activeImage]}
                        alt={product.name}
                    />

                    {/* BADGE */}

                    {product.badge && (
                        <span className="gallery-badge">
                            {product.badge}
                        </span>
                    )}

                    {/* FULLSCREEN */}

                    <button
                        type="button"
                        className="gallery-expand"
                        onClick={(event) => {
                            event.stopPropagation();

                            setShowFullscreen(true);
                        }}
                        aria-label="View image fullscreen"
                    >
                        <FaExpand />
                    </button>

                    {/* PREVIOUS */}

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="gallery-arrow gallery-arrow-left"
                            onClick={(event) => {
                                event.stopPropagation();

                                previousImage();
                            }}
                            aria-label="Previous image"
                        >
                            <FaChevronLeft />
                        </button>
                    )}

                    {/* NEXT */}

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="gallery-arrow gallery-arrow-right"
                            onClick={(event) => {
                                event.stopPropagation();

                                nextImage();
                            }}
                            aria-label="Next image"
                        >
                            <FaChevronRight />
                        </button>
                    )}

                    {/* IMAGE COUNTER */}

                    {images.length > 1 && (
                        <span className="gallery-counter">
                            {activeImage + 1} / {images.length}
                        </span>
                    )}

                </div>

                {/* =====================================
                    MOBILE THUMBNAILS
                ===================================== */}

                {images.length > 1 && (
                    <div className="product-gallery-mobile-thumbnails">

                        {images.map((image, index) => (
                            <button
                                key={`${image}-mobile-${index}`}
                                type="button"
                                className={`product-gallery-thumbnail ${
                                    activeImage === index
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveImage(index)
                                }
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} view ${
                                        index + 1
                                    }`}
                                />
                            </button>
                        ))}

                    </div>
                )}

            </div>

            {/* =========================================
                FULLSCREEN VIEWER
            ========================================= */}

            {showFullscreen && (
                <div
                    className="gallery-lightbox"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowFullscreen(false);
                        }
                    }}
                >

                    {/* CLOSE */}

                    <button
                        type="button"
                        className="gallery-lightbox-close"
                        onClick={() =>
                            setShowFullscreen(false)
                        }
                        aria-label="Close fullscreen"
                    >
                        <FaTimes />
                    </button>

                    {/* IMAGE */}

                    <div className="gallery-lightbox-content">

                        <img
                            src={images[activeImage]}
                            alt={product.name}
                        />

                        {/* PREVIOUS */}

                        {images.length > 1 && (
                            <button
                                type="button"
                                className="lightbox-arrow lightbox-arrow-left"
                                onClick={previousImage}
                                aria-label="Previous image"
                            >
                                <FaChevronLeft />
                            </button>
                        )}

                        {/* NEXT */}

                        {images.length > 1 && (
                            <button
                                type="button"
                                className="lightbox-arrow lightbox-arrow-right"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <FaChevronRight />
                            </button>
                        )}

                    </div>

                    {/* COUNTER */}

                    {images.length > 1 && (
                        <span className="lightbox-counter">
                            {activeImage + 1} / {images.length}
                        </span>
                    )}

                </div>
            )}
        </>
    );
};

export default ProductGallery;