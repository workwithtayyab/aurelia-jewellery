import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGem,
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeart,
} from "react-icons/fa";

import "./Home.css";

import heroImage from "../../assets/products/seraphina-earrings.jpg";
// ==============================
// CATEGORIES
// ==============================

const categories = [
  {
    name: "Rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Earrings",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
  },
];


// ==============================
// PRODUCTS
// ==============================

const products = [
  {
    id: 1,
    name: "Celeste Gold Ring",
    category: "Rings",
    price: "₹24,999",
    oldPrice: "₹29,999",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "Élan Pearl Necklace",
    category: "Necklaces",
    price: "₹18,499",
    oldPrice: "₹22,999",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "Luna Gold Earrings",
    category: "Earrings",
    price: "₹12,999",
    oldPrice: "₹15,999",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "Serene Gold Bracelet",
    category: "Bracelets",
    price: "₹21,999",
    oldPrice: "₹25,999",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85",
  },
];


// ==============================
// HOME
// ==============================

const Home = () => {
  return (
    <main className="home">

      {/* =================================
          HERO
      ================================= */}

      <section className="hero">

        <img
          src={heroImage}
          alt="Aurelia Jewellery Collection"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="hero-label">
            THE NEW COLLECTION
          </p>

          <h1>
            Timeless
            <br />
            Elegance
          </h1>

          <p className="hero-description">
            Jewellery designed to celebrate
            your most beautiful moments.
          </p>

          <Link
            to="/shop"
            className="hero-button"
          >
            SHOP COLLECTION
            <FaArrowRight />
          </Link>

        </div>

      </section>


      {/* =================================
          CATEGORY SECTION
      ================================= */}

      <section className="category-section">

        <div className="section-heading">

          <p>DISCOVER</p>

          <h2>
            Shop By Category
          </h2>

          <span>
            Find the perfect piece for every occasion.
          </span>

        </div>


        <div className="category-grid">

          {categories.map((category) => (

            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="category-card"
            >

              <img
                src={category.image}
                alt={category.name}
              />

              <div className="category-card-overlay">

                <h3>
                  {category.name}
                </h3>

                <span>
                  Explore
                  <FaArrowRight />
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =================================
          NEW ARRIVALS
      ================================= */}

      <section className="products-section">

        <div className="section-heading">

          <p>JUST ARRIVED</p>

          <h2>
            New Arrivals
          </h2>

          <span>
            Discover our latest jewellery creations.
          </span>

        </div>


        <div className="product-grid">

          {products.map((product) => (

            <article
              className="product-card"
              key={product.id}
            >

              <div className="product-image-wrapper">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <span className="new-badge">
                  NEW
                </span>

                <button
                  className="wishlist-button"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <FaHeart />
                </button>

              </div>


              <div className="product-details">

                <p className="product-category">
                  {product.category}
                </p>

                <h3>
                  {product.name}
                </h3>

                <div className="price-row">

                  <strong>
                    {product.price}
                  </strong>

                  <del>
                    {product.oldPrice}
                  </del>

                </div>

              </div>

            </article>

          ))}

        </div>


        <div className="view-all-container">

          <Link
            to="/shop"
            className="view-all-button"
          >
            VIEW ALL JEWELLERY
            <FaArrowRight />
          </Link>

        </div>

      </section>


      {/* =================================
          LUXURY STORY
      ================================= */}

      <section className="story-section">

        <div className="story-image">

          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85"
            alt="Luxury jewellery"
          />

        </div>


        <div className="story-content">

          <p>
            OUR PHILOSOPHY
          </p>

          <h2>
            Beauty
            <br />
            in Every Detail
          </h2>

          <div className="story-line"></div>

          <span>
            At Aurelia, we believe jewellery is more
            than an accessory. It is a reflection of
            who you are, the moments you cherish,
            and the stories you carry with you.
          </span>

          <Link to="/about">
            DISCOVER OUR STORY
            <FaArrowRight />
          </Link>

        </div>

      </section>


      {/* =================================
          PROMISE
      ================================= */}

      <section className="promise-section">

        <div className="section-heading">

          <p>THE AURELIA PROMISE</p>

          <h2>
            Made With You In Mind
          </h2>

        </div>


        <div className="promise-grid">

          <div className="promise-card">

            <FaGem />

            <h3>
              Exceptional Quality
            </h3>

            <p>
              Beautiful materials and thoughtful
              craftsmanship in every piece.
            </p>

          </div>


          <div className="promise-card">

            <FaShippingFast />

            <h3>
              Secure Delivery
            </h3>

            <p>
              Carefully packaged and delivered
              safely to your doorstep.
            </p>

          </div>


          <div className="promise-card">

            <FaShieldAlt />

            <h3>
              Secure Shopping
            </h3>

            <p>
              Shop confidently with secure
              payments and protected orders.
            </p>

          </div>


          <div className="promise-card">

            <FaUndo />

            <h3>
              Easy Returns
            </h3>

            <p>
              A simple and convenient return
              experience whenever you need it.
            </p>

          </div>

        </div>

      </section>


      {/* =================================
          NEWSLETTER
      ================================= */}

      <section className="newsletter-section">

        <div className="newsletter-content">

          <p>
            STAY CONNECTED
          </p>

          <h2>
            Join Our World
          </h2>

          <span>
            Get early access to new collections,
            exclusive offers and jewellery inspiration.
          </span>

        </div>


        <form
          className="newsletter-form"
          onSubmit={(event) => event.preventDefault()}
        >

          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email address"
          />

          <button type="submit">
            JOIN
          </button>

        </form>

      </section>

    </main>
  );
};

export default Home;