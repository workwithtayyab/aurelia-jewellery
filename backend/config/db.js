const mongoose = require("mongoose");

// Cache the in-flight connection so simultaneous requests share ONE
// connection attempt instead of each calling mongoose.connect().
let connectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  const state = mongoose.connection.readyState;

  // 1 = connected
  if (state === 1) {
    return mongoose.connection;
  }

  // 0 = disconnected (never connected, or the connection dropped)
  if (state === 0) {
    connectionPromise = null;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        // Fail in 10s (e.g. Atlas IP not whitelisted) instead of hanging.
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("MongoDB connected successfully");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null; // allow a retry on the next request
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;