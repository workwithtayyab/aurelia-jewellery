
import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const values = [
  {
    number: "01",
    title: "Timeless Design",
    description:
      "Jewellery designed to transcend trends and become part of your most treasured moments.",
  },
  {
    number: "02",
    title: "Attention to Detail",
    description:
      "Every design is approached with care, from its delicate details to its final finish.",
  },
  {
    number: "03",
    title: "Made to Be Treasured",
    description:
      "We believe jewellery should feel personal, meaningful, and worth keeping for years to come.",
  },
];

const About = () => {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">THE AURELIA STORY</span>
          <h1>
            More than jewellery.
            <br />
            <em>A feeling that lasts.</em>
          </h1>
          <p>
            Thoughtfully chosen pieces, timeless elegance, and little
            details that make every moment feel special.
          </p>

          <Link to="/shop" className="about-button">
            Discover Our Collection <span>↗</span>
          </Link>
        </div>

        <div className="about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
            alt="Elegant gold jewellery collection"
          />
          <div className="about-image-caption">
            <span>THE ART OF ELEGANCE</span>
            <span>TIMELESS BY NATURE</span>
          </div>
        </div>

        <span className="about-hero-index">AURELIA — EST. 2026</span>
      </section>

      {/* Brand story */}
      <section className="about-story">
        <div className="about-story-label">
          <span className="about-eyebrow">OUR PHILOSOPHY</span>
          <span className="about-vertical-line" />
          <span className="about-small-text">BEAUTY IN THE DETAILS</span>
        </div>

        <div className="about-story-content">
          <h2>
            Some things are worn.
            <br />
            <em>Others are remembered.</em>
          </h2>

          <p>
            At Aurelia, we believe jewellery is more than an accessory.
            It is a reflection of who you are, a reminder of someone
            you love, and a way to celebrate the moments that matter.
          </p>

          <p>
            Our vision is to bring together refined aesthetics,
            thoughtful details, and versatile designs that feel just
            as special on an ordinary day as they do on life's biggest
            occasions.
          </p>

          <p>
            From a meaningful gift to a piece you choose just for
            yourself, every Aurelia experience begins with one simple
            idea: elegance should feel personal.
          </p>

          <Link to="/shop" className="about-text-link">
            Explore the collection <span>→</span>
          </Link>
        </div>
      </section>

      {/* Image banner */}
      <section className="about-banner">
        <img
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1800&q=85"
          alt="Close-up of delicate jewellery"
          loading="lazy"
        />

        <div className="about-banner-overlay">
          <span className="about-eyebrow">THE AURELIA PROMISE</span>
          <h2>
            Elegance is not about
            <br />
            being noticed.
            <br />
            <em>It's about being remembered.</em>
          </h2>
        </div>
      </section>

      {/* Brand values */}
      <section className="about-values">
        <div className="about-values-heading">
          <span className="about-eyebrow">WHAT WE BELIEVE</span>
          <h2>
            The details that
            <br />
            <em>define us.</em>
          </h2>
          <p>
            Our approach is simple: celebrate individuality, appreciate
            the details, and create an experience worth coming back to.
          </p>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article className="about-value-card" key={value.number}>
              <span className="about-value-number">{value.number}</span>
              <span className="about-value-divider" />
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="about-cta">
        <span className="about-eyebrow">FIND YOUR AURELIA</span>
        <h2>
          Your story.
          <br />
          <em>Your signature piece.</em>
        </h2>
        <p>
          Discover jewellery that complements your style and
          celebrates the moments that make you, you.
        </p>
        <Link to="/shop" className="about-button about-button-dark">
          Shop the Collection <span>↗</span>
        </Link>
      </section>
    </main>
  );
};

export default About;
