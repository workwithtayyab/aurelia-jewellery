import API_BASE_URL from "../../config";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { useCart } from "../../Context/CartContext";
import "./Account.css";

const API_URL = `${API_BASE_URL}/api/auth`;

const Account = () => {
  // Only use CartContext for the wishlist and shopping bag.
  // Orders will be loaded from the authenticated customer's backend later.
  const { wishlistCount = 0, cartCount = 0 } = useCart();

  // Checkout / order history send guests here with a place to return to.
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo =
    typeof location.state?.returnTo === "string" &&
    location.state.returnTo.startsWith("/") &&
    !location.state.returnTo.startsWith("//")
      ? location.state.returnTo
      : null;

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Start empty so a new customer never sees shared/sample orders.
  const [orders] = useState([]);

  // Check whether the customer already has a valid backend session.
  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Customer session check failed:", err);
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Customer login and registration.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }

      if (password.length < 12 || password.length > 72) {
        setError("Password must contain 12 to 72 characters.");
        return;
      }

      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/login" : "/register";

      const payload =
        mode === "login"
          ? { email: email.trim(), password }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
            };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to continue. Please try again.");
        return;
      }

      setUser(data.user);
      setPassword("");
      setConfirmPassword("");

      if (returnTo) {
        navigate(returnTo, { replace: true });
        return;
      }

      setNotice(
        mode === "login"
          ? "Welcome back to Aurelia."
          : "Your Aurelia account has been created."
      );
    } catch (err) {
      console.error("Customer authentication failed:", err);
      setError(
        "We could not reach the server. Please check your connection and try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Customer logout.
  const handleLogout = async () => {
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Unable to log out. Please try again.");
        return;
      }

      setUser(null);
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setNotice("You have been logged out.");
    } catch (err) {
      console.error("Customer logout failed:", err);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const latestOrder = orders.length > 0 ? orders[0] : null;

  if (checkingSession) {
    return (
      <main className="account-page">
        <section className="account-hero">
          <p className="account-eyebrow">AURELIA</p>
          <h1>My Account</h1>
          <p>Checking your account...</p>
        </section>
      </main>
    );
  }

  // Guest login and registration screen.
  if (!user) {
    return (
      <main className="account-page">
        <section className="account-hero">
          <p className="account-eyebrow">AURELIA</p>
          <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p>
            {mode === "login"
              ? "Sign in to access your Aurelia space."
              : "Join Aurelia and keep your favourites close."}
          </p>
        </section>

        <section className="account-container">
          <div className="customer-auth-card">
            <div className="customer-auth-emblem">
              <FaUser />
            </div>

            <p className="account-eyebrow">
              {mode === "login" ? "CUSTOMER ACCESS" : "JOIN AURELIA"}
            </p>

            <h2>
              {mode === "login" ? "Sign In" : "Create Your Account"}
            </h2>

            <p className="customer-auth-description">
              {mode === "login"
                ? "Sign in to view your orders and saved jewellery."
                : "Create an account to access your personal Aurelia space."}
            </p>

            {notice && (
              <p className="customer-auth-notice" role="status">
                {notice}
              </p>
            )}

            {error && (
              <p className="customer-auth-error" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="customer-auth-form">
              {mode === "register" && (
                <>
                  <label htmlFor="customer-name">Full Name</label>
                  <div className="customer-auth-input">
                    <FaUser />
                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      maxLength={80}
                      required
                      disabled={submitting}
                    />
                  </div>
                </>
              )}

              <label htmlFor="customer-email">Email Address</label>
              <div className="customer-auth-input">
                <FaEnvelope />
                <input
                  id="customer-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={submitting}
                />
              </div>

              <label htmlFor="customer-password">Password</label>
              <div className="customer-auth-input">
                <FaLock />
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    mode === "register"
                      ? "Create a password (12+ characters)"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  maxLength={72}
                  required
                  disabled={submitting}
                />

                <button
                  type="button"
                  className="customer-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={submitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {mode === "register" && (
                <>
                  <label htmlFor="customer-confirm-password">
                    Confirm Password
                  </label>
                  <div className="customer-auth-input">
                    <FaLock />
                    <input
                      id="customer-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      maxLength={72}
                      required
                      disabled={submitting}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="customer-auth-submit"
                disabled={submitting}
              >
                {submitting
                  ? "PLEASE WAIT..."
                  : mode === "login"
                    ? "SIGN IN"
                    : "CREATE ACCOUNT"}
                {!submitting && <FaArrowRight />}
              </button>
            </form>

            <div className="customer-auth-switch">
              {mode === "login" ? (
                <>
                  <span>New to Aurelia?</span>
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    disabled={submitting}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    disabled={submitting}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            <Link to="/shop" className="customer-auth-back">
              Continue shopping <FaArrowRight />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Logged-in customer dashboard.
  return (
    <main className="account-page">
      <section className="account-hero">
        <p className="account-eyebrow">AURELIA</p>
        <h1>My Account</h1>
        <p>Welcome to your Aurelia space.</p>
      </section>

      <section className="account-container">
        <div className="account-profile">
          <div className="account-profile-icon">
            <FaUser />
          </div>

          <div className="account-profile-info">
            <span>CUSTOMER</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <button
            type="button"
            className="customer-logout-button"
            onClick={handleLogout}
            disabled={submitting}
          >
            <FaSignOutAlt /> {submitting ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        {notice && (
          <p className="customer-auth-notice" role="status">
            {notice}
          </p>
        )}

        {error && (
          <p className="customer-auth-error" role="alert">
            {error}
          </p>
        )}

        <div className="account-actions">
          <Link to="/history" className="account-action-card">
            <div className="account-action-icon">
              <FaBoxOpen />
            </div>
            <div className="account-action-content">
              <span>ORDERS</span>
              <h3>My Orders</h3>
              <p>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>
            <FaArrowRight className="account-action-arrow" />
          </Link>

          <Link to="/wishlist" className="account-action-card">
            <div className="account-action-icon">
              <FaHeart />
            </div>
            <div className="account-action-content">
              <span>SAVED</span>
              <h3>Wishlist</h3>
              <p>
                {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
              </p>
            </div>
            <FaArrowRight className="account-action-arrow" />
          </Link>

          <Link to="/cart" className="account-action-card">
            <div className="account-action-icon">
              <FaShoppingBag />
            </div>
            <div className="account-action-content">
              <span>BAG</span>
              <h3>Shopping Bag</h3>
              <p>
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>
            <FaArrowRight className="account-action-arrow" />
          </Link>
        </div>

        <section className="account-section">
          <div className="account-section-heading">
            <div>
              <span>YOUR PURCHASES</span>
              <h2>Recent Order</h2>
            </div>

            {orders.length > 0 && (
              <Link to="/history" className="account-view-all">
                VIEW ALL <FaArrowRight />
              </Link>
            )}
          </div>

          {!latestOrder ? (
            <div className="account-no-orders">
              <div className="account-no-orders-icon">
                <FaBoxOpen />
              </div>
              <h3>No Orders Yet</h3>
              <p>
                Your Aurelia purchases will appear here after you place an
                order.
              </p>
              <Link to="/shop" className="account-shop-button">
                EXPLORE JEWELLERY <FaArrowRight />
              </Link>
            </div>
          ) : (
            <div className="account-recent-order">
              <div className="account-order-header">
                <div>
                  <span>ORDER NUMBER</span>
                  <h3>{latestOrder.orderNumber}</h3>
                </div>
                <div className="account-order-status">
                  <FaCheckCircle />
                  {latestOrder.orderStatus || "Confirmed"}
                </div>
              </div>

              <div className="account-order-meta">
                <div>
                  <FaCalendarAlt />
                  <div>
                    <span>ORDER DATE</span>
                    <strong>{latestOrder.orderDate}</strong>
                  </div>
                </div>

                <div>
                  <FaShoppingBag />
                  <div>
                    <span>ITEMS</span>
                    <strong>
                      {latestOrder.items?.length || 0}{" "}
                      {latestOrder.items?.length === 1 ? "item" : "items"}
                    </strong>
                  </div>
                </div>

                <div>
                  <div className="account-order-total">
                    <span>TOTAL</span>
                    <strong>{formatPrice(latestOrder.total)}</strong>
                  </div>
                </div>
              </div>

              <div className="account-order-products">
                {latestOrder.items?.slice(0, 3).map((item, index) => (
                  <div
                    className="account-order-product"
                    key={item.id || `${item.name}-${index}`}
                  >
                    <div className="account-product-image">
                      <img src={item.image} alt={item.name} />
                      <span>{item.quantity}</span>
                    </div>
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="account-order-footer">
                <Link
                  to={`/order-details/${latestOrder.orderNumber}`}
                  state={{ order: latestOrder }}
                  className="account-view-order"
                >
                  VIEW ORDER DETAILS <FaArrowRight />
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="account-shopping">
          <div>
            <p>DISCOVER SOMETHING BEAUTIFUL</p>
            <h2>Find Your Next Favourite Piece</h2>
          </div>
          <Link to="/shop" className="account-shopping-button">
            SHOP COLLECTION <FaArrowRight />
          </Link>
        </section>
      </section>
    </main>
  );
};

export default Account;