
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.aurelia_admin_token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in to access this resource.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "aurelia-jewellery",
      audience: "aurelia-admin",
    });

    const admin = await Admin.findById(decoded.sub);

    if (!admin || !admin.isActive || admin.role !== "admin") {
      return res.status(401).json({
        message: "Admin session is no longer valid.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session. Please log in again.",
    });
  }
};

module.exports = { protectAdmin };
