
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5001;

// Validate required environment variables.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "Set a strong JWT_SECRET in backend environment variables"
  );
}

if (!process.env.FRONTEND_URL) {
  throw new Error(
    "FRONTEND_URL is missing from backend environment variables"
  );
}

// Allow one or more frontend origins, comma separated.
const allowedOrigins = process.env.FRONTEND_URL.split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Render proxy and security settings.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Security headers.
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Resource-Policy": "cross-origin",
  });

  next();
});

// CORS configuration.
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Reject state-changing requests from unknown browser origins.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

app.use((req, res, next) => {
  const origin = req.get("origin");

  if (
    !SAFE_METHODS.has(req.method) &&
    origin &&
    !allowedOrigins.includes(origin)
  ) {
    return res.status(403).json({
      message: "Origin not allowed.",
    });
  }

  next();
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many contact requests. Please try again in 15 minutes.",
  },
});

// Parse request bodies and cookies.
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Basic API status endpoint.
app.get("/", (req, res) => {
  res.json({
    message: "Aurelia Jewellery API is running",
  });
});

// Render health check.

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  if (!connected) {
    connectDB().catch((error) => {
      console.error("Database reconnect failed:", error.message);
    });
  }

  return res.status(connected ? 200 : 503).json({
    message: "Aurelia backend health check",
    server: "running",
    database: connected ? "connected" : "disconnected",
  });
});

// Contact enquiries use Resend and do not require MongoDB.
app.use("/api/contact", contactLimiter, contactRoutes);
// Ensure MongoDB is connected before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      message: "Database unavailable",
    });
  }
});

// Existing API routes.
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Contact form route — sends enquiries through the contact route
// implemented in ./routes/contactRoutes.js.
// app.use("/api/contact", contactLimiter, contactRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Last-resort error handler.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    message:
      status >= 500
        ? "Something went wrong."
        : err.message,
  });
});

// Export the Express app for testing and deployment compatibility.
module.exports = app;

// Start the server when this file is executed directly.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });

  // Establish the database connection at startup.
  connectDB().catch((error) => {
    console.error(
      "Initial database connection failed:",
      error.message
    );
  });

  // Graceful shutdown for Render deployments.
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully...`);

    server.close(async () => {
      try {
        await mongoose.connection.close();
      } catch (error) {
        console.error(
          "Error closing MongoDB connection:",
          error.message
        );
      }

      process.exit(0);
    });

    // Force exit if shutdown gets stuck.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// Log unhandled promise rejections.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
