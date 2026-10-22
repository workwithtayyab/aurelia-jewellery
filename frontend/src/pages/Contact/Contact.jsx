import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
  FaInstagram,
  FaArrowRight,
  FaGem,
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Product enquiry",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setStatus("");
    setStatusType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");
    setStatusType("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "We couldn't send your message. Please try again."
        );
      }

      setStatus(
        data.message ||
          "Thank you for contacting Aurelia! Your enquiry has been submitted."
      );
      setStatusType("success");

      setFormData({
        name: "",
        email: "",
        subject: "Product enquiry",
        message: "",
      });
    } catch (error) {
      setStatus(
        error.message ||
          "Unable to connect to our server. Please try again later."
      );
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <span className="contact-eyebrow">
          <FaGem /> WE'RE HERE FOR YOU
        </span>

        <h1>
          We'd love to <em>hear</em> from you.
        </h1>

        <p>
          Questions about a piece, need help with an order,
          or simply want to say hello? We'd be delighted to help.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-details">
          <span className="contact-small-label">GET IN TOUCH</span>

          <h2>Every detail matters.</h2>

          <p className="contact-intro">
            At Aurelia, your experience matters as much as the
            jewellery you choose. Send us a message and we'll
            help you find what you're looking for.
          </p>

          <div className="contact-detail-item">
            <span className="contact-detail-icon">
              <FaEnvelope />
            </span>

            <div>
              <h3>Email us</h3>
              <p>For product and order enquiries</p>
              <a href="mailto:adminaurelia@gmail.com">
                adminaurelia@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-detail-item">
            <span className="contact-detail-icon">
              <FaPhoneAlt />
            </span>

            <div>
              <h3>Call us</h3>
              <p>Speak with our customer care team</p>
              <a href="tel:9321786207">9321786207</a>
            </div>
          </div>

          <div className="contact-detail-item">
            <span className="contact-detail-icon">
              <FaClock />
            </span>

            <div>
              <h3>Customer care</h3>
              <p>Monday – Saturday</p>
              <span className="contact-detail-placeholder">
                10 AM – 5 PM
              </span>
            </div>
          </div>

          <a
            className="contact-social-link"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
            Follow our world
            <FaArrowRight />
          </a>
        </div>

        <div className="contact-form-card">
          <span className="contact-small-label">SEND A MESSAGE</span>

          <h2>How can we help?</h2>

          <p className="contact-form-intro">
            Fill in the details below and tell us what's on your mind.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Your name</label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email address</label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject">
                What can we help with?
              </label>

              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option>Product enquiry</option>
                <option>Order status</option>
                <option>Shipping and delivery</option>
                <option>Returns and exchanges</option>
                <option>Other</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Your message</label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows={5}
                maxLength={5000}
                required
              />
            </div>

            <button
              className="contact-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send your message"}
              {!isSubmitting && <FaArrowRight />}
            </button>

            {status && (
              <p
                className={`contact-status ${statusType}`}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}

            <p className="contact-privacy-note">
              Your information will only be used to respond to your enquiry.
            </p>
          </form>
        </div>
      </section>

      <section className="contact-bottom-note">
        <span>—</span>
        <p>Thoughtfully chosen. Beautifully yours.</p>
        <span>—</span>
      </section>
    </main>
  );
};

export default Contact;