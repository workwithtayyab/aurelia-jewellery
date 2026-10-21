const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sessionCookieOptions: cookieOptions } = require("../utils/cookies");
const { loginLimiters, registerLimiter } = require("../middleware/rateLimit");

const router = express.Router();

const COOKIE_NAME = "aurelia_customer_token";
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 72;

// ==========================================
// PUBLIC USER DATA
// Never return password hashes to the frontend.
// ==========================================
const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

// ==========================================
// AUTHENTICATION CONFIGURATION
// ==========================================
const isValidEmail = (email) =>
  typeof email === "string" &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const createCustomerToken = (user) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET is not configured securely.");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: "customer",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      issuer: "aurelia-jewellery",
      audience: "aurelia-customer",
    }
  );
};

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================
router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (cleanName.length > 80) {
      return res.status(400).json({
        message: "Name must be 80 characters or fewer.",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    ) {
      return res.status(400).json({
        message: "Password must contain 12 to 72 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createCustomerToken(user);

    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Customer registration error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account right now.",
    });
  }
});

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================
router.post("/login", ...loginLimiters, async (req, res) => {
  try {
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

    if (
      !isValidEmail(email.trim()) ||
      password.length > PASSWORD_MAX_LENGTH
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || user.isActive === false) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role !== "customer") {
      return res.status(403).json({
        message: "Customer access required.",
      });
    }

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createCustomerToken(user);

    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(200).json({
      message: "Login successful.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Customer login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in right now.",
    });
  }
});

// ==========================================
// CURRENT CUSTOMER SESSION
// GET /api/auth/me
// ==========================================
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        message: "Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "aurelia-jewellery",
      audience: "aurelia-customer",
    });

    if (
      decoded.role !== "customer" ||
      typeof decoded.sub !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid customer session.",
      });
    }

    const user = await User.findById(decoded.sub);

    if (
      !user ||
      user.isActive === false ||
      user.role !== "customer"
    ) {
      res.clearCookie(COOKIE_NAME, cookieOptions());

      return res.status(401).json({
        message: "Your session is no longer valid.",
      });
    }

    return res.status(200).json({
      user: publicUser(user),
    });
  } catch (error) {
    res.clearCookie(COOKIE_NAME, cookieOptions());

    return res.status(401).json({
      message: "Your session is invalid or expired.",
    });
  }
});

// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());

  return res.status(200).json({
    message: "Logged out successfully.",
  });
});

module.exports = router;