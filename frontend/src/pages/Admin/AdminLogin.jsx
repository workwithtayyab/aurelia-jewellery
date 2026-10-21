
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAdminAuth } from "../../Context/AdminAuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { login, isAdminLoggedIn, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Wait for the backend session check before redirecting
  if (loading) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <p>Checking admin session...</p>
        </section>
      </main>
    );
  }

  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        navigate("/admin", { replace: true });
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          AURELIA<span>.</span>
        </Link>

        <div className="admin-login-emblem">
          <FaLock />
        </div>

        <p className="admin-login-eyebrow">ADMINISTRATION</p>
        <h1>Welcome Back</h1>
        <p className="admin-login-description">
          Sign in to manage your jewellery store.
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="admin-email">Email Address</label>

          <div className="admin-login-input">
            <FaEnvelope />
            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={submitting}
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="admin-login-input">
            <FaLock />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
            />


            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              disabled={submitting}
            >
              <span
                key={showPassword ? "visible" : "hidden"}
                className="password-icon-transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </button>

          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={submitting}
          >
            {submitting ? "SIGNING IN..." : "SIGN IN TO DASHBOARD"}
          </button>
        </form>

        <p className="admin-login-footer">
          Secure access for Aurelia administrators
        </p>

        <Link to="/" className="admin-login-back">
          Back to Store
        </Link>
      </section>
    </main>
  );
};

export default AdminLogin;
