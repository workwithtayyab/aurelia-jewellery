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

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set a strong JWT_SECRET in backend environment variables");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is missing from backend environment variables");
}

// FRONTEND_URL can hold one or several origins, comma separated.
// Example: https://aurelia-jewellery-wheat-psi.vercel.app,http://localhost:5173
// Trailing slashes are stripped because browsers never send them in Origin.
const allowedOrigins = process.env.FRONTEND_URL.split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Render sits behind a proxy; needed for correct protocol/IP handling.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Basic hardening headers (this service only returns JSON).
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = curl, health checks, server-to-server calls.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Defence in depth against CSRF: cookies are SameSite=None in production,
// so reject any state-changing request that comes from an unknown origin.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

app.use((req, res, next) => {
  const origin = req.get("origin");

  if (
    !SAFE_METHODS.has(req.method) &&
    origin &&
    !allowedOrigins.includes(origin)
  ) {
    return res.status(403).json({ message: "Origin not allowed." });
  }

  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Public checks (placed BEFORE the DB middleware so they still respond
// when the database is down).
app.get("/", (req, res) => {
  res.json({ message: "Aurelia Jewellery API is running" });
});

// Liveness check for Render's "Health Check Path" (/api/health).
// It answers 200 as long as the process is up, so a brief database blip
// does not make Render restart a healthy server. The database state is
// reported in the body for humans and uptime monitors.
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  // If the connection dropped, start reconnecting in the background
  // without making the health check wait for it.
  if (!connected) {
    connectDB().catch((error) =>
      console.error("Database reconnect failed:", error.message)
    );
  }

  res.status(200).json({
    message: "Aurelia backend health check",
    server: "running",
    database: connected ? "connected" : "disconnected",
  });
});

// Ensure MongoDB is connected before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({ message: "Database unavailable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Last-resort error handler (e.g. malformed JSON bodies)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? "Something went wrong." : err.message,
  });
});

// Export the Express app (kept for compatibility).
module.exports = app;

// Start the server (Render and local dev both run `node server.js`).
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });

  // Connect to MongoDB immediately instead of waiting for the first request,
  // so the first customer does not pay the connection delay.
  connectDB().catch((error) =>
    console.error("Initial database connection failed:", error.message)
  );

  // Render sends SIGTERM on every deploy/restart: finish in-flight requests.
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully...`);

    server.close(async () => {
      try {
        await mongoose.connection.close();
      } catch (error) {
        console.error("Error closing MongoDB connection:", error.message);
      }
      process.exit(0);
    });

    // Force exit if something hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
