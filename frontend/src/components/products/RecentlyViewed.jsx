import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import products from "../../data/products";
import ProductCard from "./ProductCard";

import "./RecentlyViewed.css";

const STORAGE_KEY = "aurelia-recently-viewed";

const RecentlyViewed = ({ currentProduct }) => {
    const [recentIds, setRecentIds] = useState([]);

    // =========================================
    // LOAD RECENTLY VIEWED
    // =========================================

    useEffect(() => {
        try {
            const stored =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                ) || [];

            setRecentIds(stored);
        } catch (error) {
            console.error(
                "Unable to load recently viewed products:",
                error
            );

            setRecentIds([]);
        }
    }, []);

    // =========================================
    // SAVE CURRENT PRODUCT
    // =========================================

    useEffect(() => {
        if (!currentProduct) {
            return;
        }

        try {
            const stored =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                ) || [];

            // Remove current product if it already exists
            const filteredIds = stored.filter(
                (id) =>
                    Number(id) !==
                    Number(currentProduct.id)
            );

            // Put current product first
            const updatedIds = [
                currentProduct.id,
                ...filteredIds,
            ].slice(0, 6);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedIds)
            );

            setRecentIds(updatedIds);
        } catch (error) {
            console.error(
                "Unable to save recently viewed product:",
                error
            );
        }
    }, [currentProduct]);

    // =========================================
    // GET PRODUCTS
    // =========================================

    const recentlyViewed = useMemo(() => {
        if (!currentProduct) {
            return [];
        }

        return recentIds
            .map((id) =>
                products.find(
                    (product) =>
                        Number(product.id) === Number(id)
                )
            )
            .filter(Boolean)
            .filter(
                (product) =>
                    Number(product.id) !==
                    Number(currentProduct.id)
            )
            .slice(0, 4);
    }, [recentIds, currentProduct]);

    // Don't display section if there
    // aren't any previous products.

    if (recentlyViewed.length === 0) {
        return null;
    }

    return (
        <section className="recently-viewed-section">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="recently-viewed-header">

                <div>

                    <p className="recently-viewed-eyebrow">
                        YOUR JOURNEY
                    </p>

                    <h2>
                        Recently Viewed
                    </h2>

                    <p className="recently-viewed-description">
                        Continue exploring pieces
                        you've viewed recently.
                    </p>

                </div>

                <Link
                    to="/shop"
                    className="recently-viewed-shop-link"
                >
                    EXPLORE ALL
                    <FaArrowRight />
                </Link>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="recently-viewed-grid">

                {recentlyViewed.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}

            </div>

        </section>
    );
};

export default RecentlyViewed;