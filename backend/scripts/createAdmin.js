
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function createAdmin() {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Check MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env"
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters.");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists:", email);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await Admin.create({
      name: "Store Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created:", email);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
