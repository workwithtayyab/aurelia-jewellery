import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

import { useProducts } from "../../Context/ProductContext";
import ProductCard from "../../components/products/ProductCard.jsx";

import "./Shop.css";

const Shop = () => {
   const { products } = useProducts();

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [material, setMaterial] = useState("All");

  const [priceRange, setPriceRange] = useState("All");

  const [sort, setSort] = useState("featured");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  // =========================================
  // SEARCH SUGGESTIONS
  // =========================================

  const searchSuggestions = useMemo(() => {
    if (!search.trim()) {
      return [];
    }

    const searchTerm =
      search.toLowerCase().trim();

    return products
      .filter((product) => {
        const searchableText = `
          ${product.name}
          ${product.category}
          ${product.material}
        `.toLowerCase();

        return searchableText.includes(searchTerm);
      })
      .slice(0, 5);
  }, [search]);

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // =========================================
    // SEARCH
    // =========================================

    if (search.trim()) {
      const searchTerm =
        search.toLowerCase().trim();

      result = result.filter((product) =>
        `
          ${product.name}
          ${product.category}
          ${product.material}
        `
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    // =========================================
    // CATEGORY
    // =========================================

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // =========================================
    // MATERIAL
    // =========================================

    if (material !== "All") {
      result = result.filter(
        (product) =>
          product.material === material
      );
    }

    // =========================================
    // PRICE
    // =========================================

    if (priceRange === "under10000") {
      result = result.filter(
        (product) => product.price < 10000
      );
    } else if (
      priceRange === "10000-25000"
    ) {
      result = result.filter(
        (product) =>
          product.price >= 10000 &&
          product.price <= 25000
      );
    } else if (
      priceRange === "25000-50000"
    ) {
      result = result.filter(
        (product) =>
          product.price > 25000 &&
          product.price <= 50000
      );
    } else if (
      priceRange === "above50000"
    ) {
      result = result.filter(
        (product) => product.price > 50000
      );
    }

    // =========================================
    // SORTING
    // =========================================

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    } else if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          Number(b.newArrival) -
          Number(a.newArrival)
      );
    }

    return result;
  }, [
    search,
    category,
    material,
    priceRange,
    sort,
  ]);

  // =========================================
  // CLEAR ALL FILTERS
  // =========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaterial("All");
    setPriceRange("All");
    setSort("featured");
  };

  // =========================================
  // CLEAR SEARCH
  // =========================================

  const clearSearch = () => {
    setSearch("");
  };

  // =========================================
  // ACTIVE FILTERS
  // =========================================

  const activeFilters = [];

  if (category !== "All") {
    activeFilters.push({
      type: "category",
      label: category,
    });
  }

  if (material !== "All") {
    activeFilters.push({
      type: "material",
      label: material,
    });
  }

  if (priceRange !== "All") {
    const priceLabels = {
      under10000: "Under ₹10,000",
      "10000-25000":
        "₹10,000 – ₹25,000",
      "25000-50000":
        "₹25,000 – ₹50,000",
      above50000: "Above ₹50,000",
    };

    activeFilters.push({
      type: "price",
      label: priceLabels[priceRange],
    });
  }

  // =========================================
  // REMOVE INDIVIDUAL FILTER
  // =========================================

  const removeFilter = (type) => {
    if (type === "category") {
      setCategory("All");
    }

    if (type === "material") {
      setMaterial("All");
    }

    if (type === "price") {
      setPriceRange("All");
    }
  };

  return (
    <main className="shop-page">

      {/* =================================
          SHOP HERO
      ================================= */}

      <section className="shop-hero">

        <p>
          THE COLLECTION
        </p>

        <h1>
          Jewellery
        </h1>

        <span>
          Discover pieces designed to become
          part of your story.
        </span>

      </section>


      {/* =================================
          SHOP CONTENT
      ================================= */}

      <section className="shop-content">

        {/* =================================
            SEARCH
        ================================= */}

        <div className="shop-search-wrapper">

          <div className="shop-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search jewellery..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="shop-search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}

          </div>


          {/* =================================
              SEARCH SUGGESTIONS
          ================================= */}

          {search.trim() && (
            <div className="search-suggestions">

              {searchSuggestions.length > 0 ? (
                <>

                  <div className="search-suggestions-header">

                    <span>
                      SEARCH RESULTS
                    </span>

                    <small>
                      {searchSuggestions.length}{" "}
                      {searchSuggestions.length === 1
                        ? "match"
                        : "matches"}
                    </small>

                  </div>


                  <div className="search-suggestions-list">

                    {searchSuggestions.map(
                      (product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="search-suggestion"
                        >

                          <div className="search-suggestion-image">

                            <img
                              src={product.image}
                              alt={product.name}
                            />

                          </div>


                          <div className="search-suggestion-info">

                            <span>
                              {product.category}
                            </span>

                            <h3>
                              {product.name}
                            </h3>

                            <strong>
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>


                          <FaArrowRight className="search-suggestion-arrow" />

                        </Link>
                      )
                    )}

                  </div>


                  {filteredProducts.length > 5 && (
                    <div className="search-see-all">

                      <span>
                        More products match your search
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          document
                            .querySelector(
                              ".shop-products"
                            )
                            ?.scrollIntoView({
                              behavior:
                                "smooth",
                            });
                        }}
                      >
                        VIEW ALL

                        <FaArrowRight />

                      </button>

                    </div>
                  )}

                </>
              ) : (

                <div className="search-no-results">

                  <FaSearch />

                  <div>

                    <strong>
                      No jewellery found
                    </strong>

                    <span>
                      Try another search term.
                    </span>

                  </div>

                </div>

              )}

            </div>
          )}

        </div>


        {/* =================================
            MOBILE FILTER BUTTON
        ================================= */}

        <button
          className="mobile-filter-button"
          onClick={() =>
            setMobileFilters(
              !mobileFilters
            )
          }
        >

          <FaSlidersH />

          FILTERS

        </button>


        {/* =================================
            SHOP LAYOUT
        ================================= */}

        <div
          className={`shop-layout ${
            mobileFilters
              ? "show-mobile-filters"
              : ""
          }`}
        >

          {/* =================================
              FILTER SIDEBAR
          ================================= */}

          <aside className="filter-sidebar">

            <div className="filter-header">

              <h2>
                Filters
              </h2>

              <button
                onClick={clearFilters}
              >
                CLEAR ALL
              </button>

            </div>


            {/* =================================
                CATEGORY
            ================================= */}

            <div className="filter-group">

              <h3>
                Category
              </h3>

              {[
                "All",
                "Rings",
                "Necklaces",
                "Earrings",
                "Bracelets",
              ].map((item) => (

                <label key={item}>

                  <input
                    type="radio"
                    name="category"
                    checked={
                      category === item
                    }
                    onChange={() =>
                      setCategory(item)
                    }
                  />

                  <span>
                    {item}
                  </span>

                </label>

              ))}

            </div>


            {/* =================================
                MATERIAL
            ================================= */}

            <div className="filter-group">

              <h3>
                Material
              </h3>

              {[
                "All",
                "Gold",
                "Silver",
                "Diamond",
                "Pearl",
              ].map((item) => (

                <label key={item}>

                  <input
                    type="radio"
                    name="material"
                    checked={
                      material === item
                    }
                    onChange={() =>
                      setMaterial(item)
                    }
                  />

                  <span>
                    {item}
                  </span>

                </label>

              ))}

            </div>


            {/* =================================
                PRICE
            ================================= */}

            <div className="filter-group">

              <h3>
                Price
              </h3>

              {[
                {
                  value: "All",
                  label: "All prices",
                },
                {
                  value: "under10000",
                  label:
                    "Under ₹10,000",
                },
                {
                  value:
                    "10000-25000",
                  label:
                    "₹10,000 – ₹25,000",
                },
                {
                  value:
                    "25000-50000",
                  label:
                    "₹25,000 – ₹50,000",
                },
                {
                  value:
                    "above50000",
                  label:
                    "Above ₹50,000",
                },
              ].map((item) => (

                <label
                  key={item.value}
                >

                  <input
                    type="radio"
                    name="price"
                    checked={
                      priceRange ===
                      item.value
                    }
                    onChange={() =>
                      setPriceRange(
                        item.value
                      )
                    }
                  />

                  <span>
                    {item.label}
                  </span>

                </label>

              ))}

            </div>

          </aside>


          {/* =================================
              PRODUCTS AREA
          ================================= */}

          <div className="shop-products">

            {/* =================================
                ACTIVE FILTERS
            ================================= */}

            {activeFilters.length > 0 && (

              <div className="active-filters">

                <div className="active-filters-heading">

                  <span>
                    FILTERED BY
                  </span>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    CLEAR ALL
                  </button>

                </div>


                <div className="active-filter-list">

                  {activeFilters.map(
                    (filter) => (

                      <button
                        type="button"
                        key={filter.type}
                        className="active-filter-chip"
                        onClick={() =>
                          removeFilter(
                            filter.type
                          )
                        }
                      >

                        <span>
                          {filter.label}
                        </span>

                        <FaTimes />

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


            {/* =================================
                TOOLBAR
            ================================= */}

            <div className="shop-toolbar">

              <p>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "piece"
                  : "pieces"}
              </p>


              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
              >

                <option value="featured">
                  Featured
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name: A–Z
                </option>

              </select>

            </div>


            {/* =================================
                PRODUCTS
            ================================= */}

            {filteredProducts.length > 0 ? (

              <div className="shop-grid">

                {filteredProducts.map(
                  (product) => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  )
                )}

              </div>

            ) : (

              <div className="no-products">

                <h2>
                  No jewellery found
                </h2>

                <p>
                  Try changing your filters
                  or search term.
                </p>

                <button
                  onClick={clearFilters}
                >
                  CLEAR FILTERS
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
};

export default Shop;