
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaArrowRight,
} from "react-icons/fa";
import { FaGem } from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">
              <FaGem />
            </span>
            <span>
              AURELIA
              <small>FINE JEWELLERY</small>
            </span>
          </Link>

          <p className="footer-description">
            Timeless jewellery, thoughtfully crafted to celebrate
            your most beautiful moments. Discover elegance in
            every detail.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.pinterest.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <FaPinterestP />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div className="footer-column">
          <h3>EXPLORE</h3>
          <Link to="/shop">All Jewellery</Link>
          <Link to="/category/rings">Rings</Link>
          <Link to="/category/necklaces">Necklaces</Link>
          <Link to="/category/earrings">Earrings</Link>
          <Link to="/category/bracelets">Bracelets</Link>
        </div>

        {/* Company links */}
        <div className="footer-column">
          <h3>OUR WORLD</h3>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">Frequently Asked Questions</Link>
        </div>

        {/* Support links */}
        <div className="footer-column">
          <h3>CLIENT CARE</h3>
          <Link to="/shipping">Shipping & Delivery</Link>
          <Link to="/returns">Returns & Exchanges</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>

      {/* Brand message */}
      <div className="footer-note">
        <span className="footer-note-line" />
        <p>Elegance that lasts. Memories that shine.</p>
        <span className="footer-note-line" />
      </div>

      {/* Bottom bar */}

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Aurelia Jewellery.
          All rights reserved.
        </p>

        <p className="footer-credit">
          Designed &amp; Developed by{" "}
          <span>Mohd Tayyab Salmani</span>
        </p>

        <Link to="/" className="footer-back-top">
          Back to home <FaArrowRight />
        </Link>
      </div>

    </footer>
  );
};

export default Footer;
