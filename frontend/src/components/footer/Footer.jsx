import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
} from "react-icons/fa";

import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-main">

        <div className="footer-brand">

          <h2>AURELIA</h2>

          <p>
            Timeless jewellery created
            to celebrate life's beautiful moments.
          </p>

          <div className="social-icons">

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaPinterestP />
            </a>

          </div>

        </div>


        <div className="footer-column">

          <h3>SHOP</h3>

          <Link to="/shop">All Jewellery</Link>
          <Link to="/category/rings">Rings</Link>
          <Link to="/category/necklaces">Necklaces</Link>
          <Link to="/category/earrings">Earrings</Link>
          <Link to="/category/bracelets">Bracelets</Link>

        </div>


        <div className="footer-column">

          <h3>ABOUT</h3>

          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>

        </div>


        <div className="footer-column">

          <h3>HELP</h3>

          <Link to="/shipping">
            Shipping & Delivery
          </Link>

          <Link to="/returns">
            Returns
          </Link>

          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 Aurelia Jewellery. All rights reserved.
        </p>

        <p>
          Crafted with ❤️.
        </p>

      </div>

    </footer>
  );
};

export default Footer;