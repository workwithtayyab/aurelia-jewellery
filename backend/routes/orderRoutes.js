
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Order = require("../models/Order");
const User = require("../models/User");
const productCatalog = require("../data/productCatalog");
const { sendNewOrderNotification } = require("../services/emailService");

const router = express.Router();

const CUSTOMER_COOKIE = "aurelia_customer_token";
const JWT_ISSUER = "aurelia-jewellery";
const JWT_AUDIENCE = "aurelia-customer";

// ==========================================
// CUSTOMER AUTHORIZATION
// ==========================================
const protectCustomer = async (req, res, next) => {
  try {
    const token = req.cookies?.[CUSTOMER_COOKIE];

    if (!token) {
      return res.status(401).json({
        message: "Please log in to continue.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (
      decoded.role !== "customer" ||
      typeof decoded.sub !== "string" ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      return res.status(401).json({
        message: "Invalid customer authentication token.",
      });
    }

    const user = await User.findById(decoded.sub);

    if (!user || user.isActive === false || user.role !== "customer") {
      return res.status(401).json({
        message: "Customer account not found or inactive.",
      });
    }

    req.customer = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed. Please log in again.",
    });
  }
};

// ==========================================
// INPUT VALIDATION HELPERS
// ==========================================
const isNonEmptyString = (value, maxLength = 200) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const isValidEmail = (value) =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidPincode = (value) =>
  typeof value === "string" &&
  /^[0-9]{6}$/.test(value.trim());

const isValidPhone = (value) =>
  typeof value === "string" &&
  /^[+0-9() -]{7,20}$/.test(value.trim());

// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================
router.post("/", protectCustomer, async (req, res) => {
  try {
    const { customer, items } = req.body || {};

    // Validate customer details object.
    if (
      !customer ||
      typeof customer !== "object" ||
      Array.isArray(customer)
    ) {
      return res.status(400).json({
        message: "Customer details are required.",
      });
    }

    // Checkout email must match the logged-in account.
    if (
      typeof customer.email !== "string" ||
      customer.email.trim().toLowerCase() !==
        req.customer.email.trim().toLowerCase()
    ) {
      return res.status(400).json({
        message: "Checkout email must match your logged-in account.",
      });
    }

    // Validate required shipping fields.
    const requiredFields = [
      ["email", 254],
      ["firstName", 80],
      ["lastName", 80],
      ["address", 250],
      ["city", 100],
      ["state", 100],
      ["pincode", 6],
      ["phone", 20],
    ];

    for (const [field, maxLength] of requiredFields) {
      if (!isNonEmptyString(customer[field], maxLength)) {
        return res.status(400).json({
          message: `Please provide a valid ${field}.`,
        });
      }
    }

    if (!isValidEmail(customer.email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (!isValidPincode(customer.pincode)) {
      return res.status(400).json({
        message: "Please provide a valid 6-digit pincode.",
      });
    }

    if (!isValidPhone(customer.phone)) {
      return res.status(400).json({
        message: "Please provide a valid phone number.",
      });
    }

    if (
      customer.apartment !== undefined &&
      (typeof customer.apartment !== "string" ||
        customer.apartment.trim().length > 100)
    ) {
      return res.status(400).json({
        message: "Apartment or unit details are invalid.",
      });
    }

    // Validate cart items.
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50
    ) {
      return res.status(400).json({
        message: "Your order must contain between 1 and 50 items.",
      });
    }

    const cleanItems = [];
    const seenProductIds = new Set();

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return res.status(400).json({
          message: "One or more order items are invalid.",
        });
      }

      const rawId = item.id ?? item.productId;

      if (
        rawId === undefined ||
        rawId === null ||
        !["string", "number"].includes(typeof rawId)
      ) {
        return res.status(400).json({
          message: "A valid product ID is required.",
        });
      }

      const productId = String(rawId).trim();
      const quantity = Number(item.quantity);

      if (
        !productId ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return res.status(400).json({
          message: "One or more order items are invalid.",
        });
      }

      if (seenProductIds.has(productId)) {
        return res.status(400).json({
          message: "Duplicate products found. Please refresh your cart.",
        });
      }

      // Always use the backend catalog for product identity and price.
      const trustedProduct = productCatalog.get(productId);

      if (!trustedProduct) {
        return res.status(400).json({
          message: `Product ${productId} is unavailable. Please refresh your cart.`,
        });
      }

      seenProductIds.add(productId);

      const lineTotal = trustedProduct.price * quantity;

      if (!Number.isSafeInteger(lineTotal)) {
        return res.status(400).json({
          message: "An order item total is invalid.",
        });
      }

      cleanItems.push({
        productId: trustedProduct.id,
        name: trustedProduct.name,
        category: trustedProduct.category,
        // Image is display data only, not a trusted price source.
        image:
          typeof item.image === "string"
            ? item.image.trim().slice(0, 1000)
            : "",
        price: trustedProduct.price,
        quantity,
      });
    }

    // Calculate totals using trusted backend prices.
    const subtotal = cleanItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (!Number.isSafeInteger(subtotal) || subtotal <= 0) {
      return res.status(400).json({
        message: "The order total is invalid.",
      });
    }

    // Generate a unique order number.
    const orderNumber =
      `AUR-${Date.now()}-${new mongoose.Types.ObjectId()
        .toString()
        .slice(-6)
        .toUpperCase()}`;

    // Save the order in MongoDB.
    const order = await Order.create({
      orderNumber,
      customerId: req.customer._id,
      customer: {
        email: req.customer.email,
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        address: customer.address.trim(),
        apartment: (customer.apartment || "").trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        phone: customer.phone.trim(),
      },
      items: cleanItems,
      subtotal,
      total: subtotal,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      orderStatus: "Confirmed",
    });

    // Email failure must not undo a successfully saved order.
    let emailSent = false;

    try {
      await sendNewOrderNotification(order);
      emailSent = true;

      console.log(
        `Order notification accepted by Resend: ${order.orderNumber}`
      );
    } catch (emailError) {
      console.error(
        `Order ${order.orderNumber} was saved, but its email failed:`,
        emailError.message
      );
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      emailSent,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Unable to create your order.",
    });
  }
});

// ==========================================
// GET LOGGED-IN CUSTOMER'S ORDERS
// GET /api/orders
// ==========================================
router.get("/", protectCustomer, async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.customer._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      message: "Unable to fetch your orders.",
    });
  }
});

// ==========================================
// GET ONE ORDER BELONGING TO THE CUSTOMER
// GET /api/orders/:orderNumber
// ==========================================
router.get("/:orderNumber", protectCustomer, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      customerId: req.customer._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Fetch order details error:", error);

    return res.status(500).json({
      message: "Unable to fetch order details.",
    });
  }
});

module.exports = router;
