import API_BASE_URL from "../../config";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaCheck, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../../Context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // The backend requires the checkout email to match the logged-in account,
  // so fill it in (and lock it) instead of letting a typo fail the order.
  const [accountEmail, setAccountEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAccountEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();
        const email = data?.user?.email;

        if (!cancelled && typeof email === "string" && email) {
          setAccountEmail(email);
          setFormData((previous) => ({ ...previous, email }));
        }
      } catch {
        // Not logged in or server unreachable: the form still works and
        // the order request reports any problem.
      }
    };

    loadAccountEmail();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save the order through the backend before clearing the cart.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            image:
              typeof item.image === "string" &&
              !item.image.startsWith("data:") &&
              item.image.length <= 500
                ? item.image
                : "",
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/account", {
            state: { returnTo: "/checkout" },
          });
          return;
        }

        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      if (!data.order) {
        throw new Error("The server did not return the created order.");
      }

      const order = data.order;

      // Clear the cart only after the backend confirms order creation.
      clearCart();

      sessionStorage.setItem(
        "aurelia-last-order",
        JSON.stringify(order)
      );

      navigate("/order-success", {
        state: { order },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      window.alert(
        error instanceof TypeError
          ? "We could not reach the server. Please check your connection and try again in a moment."
          : error.message || "Unable to place your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN")}`;

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <FaCheck />
          </div>

          <p className="checkout-eyebrow">CHECKOUT</p>

          <h1>Your Bag Is Empty</h1>

          <p>
            Add some beautiful jewellery before continuing to checkout.
          </p>

          <Link to="/shop" className="checkout-shop-button">
            EXPLORE JEWELLERY
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      {/* Header */}
      <section className="checkout-header">
        <p className="checkout-eyebrow">AURELIA</p>
        <h1>Checkout</h1>
        <p>Complete your order securely.</p>
      </section>

      {/* Checkout container */}
      <section className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Contact information */}
          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>01</span>
              <div>
                <p>CONTACT</p>
                <h2>Contact Information</h2>
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                readOnly={Boolean(accountEmail)}
                required
              />
            </div>
          </div>

          {/* Shipping address */}
          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>02</span>
              <div>
                <p>DELIVERY</p>
                <h2>Shipping Address</h2>
              </div>
            </div>

            <div className="checkout-fields-two">
              <div className="checkout-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                autoComplete="street-address"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="apartment">
                Apartment / Suite <span>Optional</span>
              </label>
              <input
                id="apartment"
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, etc."
                autoComplete="address-line2"
              />
            </div>

            <div className="checkout-fields-two">
              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  autoComplete="address-level1"
                  required
                />
              </div>
            </div>

            <div className="checkout-fields-two">
              <div className="checkout-field">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  title="Enter a valid 6-digit PIN code"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>03</span>
              <div>
                <p>PAYMENT</p>
                <h2>Payment Method</h2>
              </div>
            </div>

            <div className="payment-placeholder">
              <div className="payment-placeholder-icon">
                <FaLock />
              </div>

              <div>
                <strong>Cash on Delivery</strong>
                <p>
                  Pay when your jewellery is delivered.
                </p>
              </div>
            </div>
          </div>

          {/* Back to cart */}
          <Link to="/cart" className="checkout-back">
            <FaArrowLeft />
            Back to shopping bag
          </Link>

          {/* Mobile place order */}
          <button
            type="submit"
            className="checkout-place-order checkout-mobile-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </form>

        {/* Order summary */}
        <aside className="checkout-summary">
          <div className="checkout-summary-header">
            <div>
              <p>YOUR SELECTION</p>
              <h2>Order Summary</h2>
            </div>

            <span>
              {cartCount} {cartCount === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div
                className="checkout-summary-item"
                key={item.id}
              >
                <div className="checkout-summary-image">
                  <img src={item.image} alt={item.name} />
                  <span>{item.quantity}</span>
                </div>

                <div className="checkout-summary-details">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </div>

                <strong>
                  {formatPrice(
                    Number(item.price) * Number(item.quantity)
                  )}
                </strong>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="checkout-summary-totals">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>FREE</strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </div>

          {/* Desktop place order */}
          <button
            type="button"
            className="checkout-place-order checkout-desktop-button"
            disabled={isSubmitting}
            onClick={(event) => {
              const form = event.currentTarget
                .closest(".checkout-container")
                ?.querySelector(".checkout-form");

              form?.requestSubmit();
            }}
          >
            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>

          {/* Security */}
          <div className="checkout-security">
            <FaLock />
            <span>Secure & encrypted checkout</span>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Checkout;