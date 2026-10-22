
import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGem,
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeart,
  FaStar,
} from "react-icons/fa";

import "./Home.css";
import heroImage from "../../assets/products/seraphina-earrings.jpg";
import islaEarrings from "../../assets/products/isla-earrings.jpg";
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
    image: islaEarrings,
    link: "/shop?category=Earrings",
  },
  {
    name: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
  },
];

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
    name: "Isla Pearl Earrings",
    category: "Earrings",
    price: "₹14,999",
    oldPrice: "₹17,999",
    image:
      islaEarrings,
  }, ,
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

const Home = () => {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="hero-kicker-line" />
            THE ART OF FINE JEWELLERY
          </span>

          <h1>
            Elegance
            <br />
            <em>that lasts.</em>
          </h1>

          <p className="hero-description">
            Thoughtfully chosen jewellery for the moments
            that become part of your story.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="hero-button">
              EXPLORE COLLECTION <FaArrowRight />
            </Link>

            <Link to="/about" className="hero-secondary">
              OUR STORY
            </Link>
          </div>

          <div className="hero-trust">
            <span className="hero-trust-icon">
              <FaGem />
            </span>
            <div>
              <strong>Made to be treasured</strong>
              <span>Discover your signature piece</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src={heroImage}
              alt="Elegant Aurelia fine jewellery"
              className="hero-image"
            />
          </div>

          <div className="hero-image-caption">
            <span>THE SIGNATURE EDIT</span>
            <span>01 / 04</span>
          </div>

          <div className="hero-floating-note">
            <span className="hero-note-star">
              <FaStar />
            </span>
            <div>
              <strong>Everyday heirlooms</strong>
              <span>Timeless by design</span>
            </div>
          </div>

          <span className="hero-decoration">A</span>
        </div>

        <span className="hero-side-note">AURELIA · FINE JEWELLERY</span>
      </section>

      {/* BRAND STRIP */}
      <section className="brand-strip">
        <span>TIMELESS DESIGN</span>
        <i />
        <span>THOUGHTFUL DETAILS</span>
        <i />
        <span>EVERYDAY LUXURY</span>
      </section>

      {/* CATEGORIES */}
      <section className="category-section">
        <div className="section-heading">
          <p>FIND YOUR FAVOURITE</p>
          <h2>Pieces with <em>meaning.</em></h2>
          <span>
            Explore the details that make every look your own.
          </span>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
              />

              <span className="category-index">
                0{index + 1}
              </span>

              <div className="category-card-overlay">
                <div>
                  <h3>{category.name}</h3>
                  <span>
                    EXPLORE <FaArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="products-section">
        <div className="products-heading">
          <div className="section-heading section-heading-left">
            <p>THE LATEST EDIT</p>
            <h2>New <em>arrivals.</em></h2>
            <span>
              New favourites, waiting to be discovered.
            </span>
          </div>

          <Link to="/shop" className="text-link">
            VIEW ALL PIECES <FaArrowRight />
          </Link>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.id}>
              <Link
                to={`/shop`}
                className="product-image-wrapper"
                aria-label={`Explore ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />

                <span className="new-badge">THE EDIT</span>

                <span className="product-quick-link">
                  DISCOVER <FaArrowRight />
                </span>
              </Link>

              <div className="product-details">
                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>

                <div className="price-row">
                  <strong>{product.price}</strong>
                  <del>{product.oldPrice}</del>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/shop" className="view-all-button">
            DISCOVER ALL JEWELLERY <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="story-section">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85"
            alt="Fine jewellery in warm editorial lighting"
            loading="lazy"
          />
          <span className="story-image-label">
            THE AURELIA PHILOSOPHY
          </span>
        </div>

        <div className="story-content">
          <p>MORE THAN AN ACCESSORY</p>

          <h2>
            Beauty in
            <br />
            every <em>detail.</em>
          </h2>

          <div className="story-line" />

          <span>
            Jewellery can hold a memory, mark a milestone,
            or simply remind you of who you are. At Aurelia,
            we celebrate the meaning behind every piece.
          </span>

          <Link to="/about">
            DISCOVER OUR STORY <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* PROMISE */}
      <section className="promise-section">
        <div className="section-heading">
          <p>THE AURELIA DIFFERENCE</p>
          <h2>Thoughtful in <em>every way.</em></h2>
        </div>

        <div className="promise-grid">
          <div className="promise-card">
            <FaGem />
            <h3>Considered Design</h3>
            <p>
              Thoughtfully selected pieces with timeless appeal.
            </p>
          </div>

          <div className="promise-card">
            <FaShippingFast />
            <h3>Careful Delivery</h3>
            <p>
              Your order prepared for its journey to you.
            </p>
          </div>

          <div className="promise-card">
            <FaShieldAlt />
            <h3>Confident Shopping</h3>
            <p>
              An order experience designed with care.
            </p>
          </div>

          <div className="promise-card">
            <FaUndo />
            <h3>Here to Help</h3>
            <p>
              Support when you need assistance with your order.
            </p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <p>A LITTLE NOTE FROM AURELIA</p>
          <h2>Something beautiful <em>awaits.</em></h2>
          <span>
            Discover new collections, thoughtful inspiration,
            and the latest from our world.
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
            required
          />

          <button type="submit" aria-label="Join newsletter">
            JOIN <FaArrowRight />
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;
