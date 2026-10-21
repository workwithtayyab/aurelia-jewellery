const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { protectAdmin } = require("../middleware/authMiddleware");
const { sessionCookieOptions: cookieOptions } = require("../utils/cookies");
const { loginLimiters } = require("../middleware/rateLimit");

const router = express.Router();

const COOKIE_NAME = "aurelia_admin_token";

// ==========================================
// ADMIN LOGIN
// POST /api/admin/auth/login
// ==========================================
router.post("/login", ...loginLimiters, async (req, res) => {
  try {
    // Express 5 leaves req.body undefined when no body is sent.
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET is not configured securely.");
    }

    const token = jwt.sign(
      { sub: admin._id.toString(), role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        issuer: "aurelia-jewellery",
        audience: "aurelia-admin",
      }
    );

    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.json({
      message: "Login successful.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({
      message: "Unable to log in right now.",
    });
  }
});

// ==========================================
// CURRENT ADMIN SESSION
// GET /api/admin/auth/me
// ==========================================
router.get("/me", protectAdmin, (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

// ==========================================
// ADMIN LOGOUT
// POST /api/admin/auth/logout
// ==========================================
router.post("/logout", (req, res) => {
  // Must use the same sameSite/secure/path as when the cookie was set,
  // otherwise the browser will not remove it.
  res.clearCookie(COOKIE_NAME, cookieOptions());

  res.json({ message: "Logged out successfully." });
});

module.exports = router;