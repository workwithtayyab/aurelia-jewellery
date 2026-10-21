import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import products from "../../data/products";
import ProductCard from "./ProductCard";

import "./RelatedProducts.css";

const RelatedProducts = ({ currentProduct }) => {
    const relatedProducts = useMemo(() => {
        if (!currentProduct) {
            return [];
        }

        // =========================================
        // 1. PRODUCTS FROM SAME CATEGORY
        // =========================================

        const sameCategory = products.filter(
            (product) =>
                product.id !== currentProduct.id &&
                product.category === currentProduct.category
        );

        // =========================================
        // 2. OTHER PRODUCTS
        // =========================================

        const otherProducts = products.filter(
            (product) =>
                product.id !== currentProduct.id &&
                product.category !== currentProduct.category
        );

        // =========================================
        // 3. COMBINE
        // SAME CATEGORY FIRST
        // =========================================

        return [
            ...sameCategory,
            ...otherProducts,
        ].slice(0, 4);

    }, [currentProduct]);

    if (!currentProduct || relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="related-products-section">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="related-products-header">

                <div>
                    <p className="related-eyebrow">
                        CURATED FOR YOU
                    </p>

                    <h2>
                        You May Also Like
                    </h2>

                    <p className="related-description">
                        Discover more pieces selected to
                        complement your style.
                    </p>
                </div>

                <Link
                    to="/shop"
                    className="related-view-all"
                >
                    VIEW ALL JEWELLERY
                    <FaArrowRight />
                </Link>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="related-products-grid">

                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}

            </div>

        </section>
    );
};

export default RelatedProducts;