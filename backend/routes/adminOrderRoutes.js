const express = require("express");
const Order = require("../models/Order");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const ALLOWED_STATUSES = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ALLOWED_PAYMENT_STATUSES = ["Pending", "Paid", "Refunded"];

// GET /api/admin/orders
// Return all customer orders from MongoDB.
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin fetch orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});

// GET /api/admin/orders/stats
// Return order counts and revenue from MongoDB.
router.get("/stats", protectAdmin, async (req, res) => {
  try {
    const [
      totalOrders,
      processing,
      confirmed,
      shipped,
      delivered,
      cancelled,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "Processing" }),
      Order.countDocuments({ orderStatus: "Confirmed" }),
      Order.countDocuments({ orderStatus: "Shipped" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "Cancelled" } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        processing,
        confirmed,
        shipped,
        delivered,
        cancelled,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    console.error("Admin order stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order statistics.",
    });
  }
});

// PATCH /api/admin/orders/:orderNumber/status
// Persist a status change in MongoDB.
router.patch("/:orderNumber/status", protectAdmin, async (req, res) => {
  try {
    // Express 5 leaves req.body undefined when no body is sent.
    const { status } = req.body || {};

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      { $set: { orderStatus: status } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Admin update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
});

// PATCH /api/admin/orders/:orderNumber/payment-status
// Persist a payment status change in MongoDB.
router.patch("/:orderNumber/payment-status", protectAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body || {};

    if (!ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
        allowedPaymentStatuses: ALLOWED_PAYMENT_STATUSES,
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      { $set: { paymentStatus } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update payment status.",
    });
  }
});

module.exports = router;