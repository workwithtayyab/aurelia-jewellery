
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function resetAdminPassword() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.ADMIN_PASSWORD;

    if (!email || !newPassword) {
      throw new Error(
        "Set ADMIN_EMAIL and ADMIN_PASSWORD in your backend .env file."
      );
    }

    if (newPassword.length < 12) {
      throw new Error("Choose a password with at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!admin) {
      throw new Error(`Admin account not found for ${email}.`);
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    console.log(`Password reset successfully for ${email}.`);
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

resetAdminPassword();
