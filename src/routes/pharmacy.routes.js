const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  createOrder,
  getMyOrders,
} = require("../controllers/pharmacy.controller");

/**
 * @route   POST /api/pharmacy/orders
 * @desc    Create new pharmacy order
 * @access  Private
 */
router.post("/orders", protect, createOrder);

/**
 * @route   GET /api/pharmacy/orders/my
 * @desc    Get logged-in user's orders
 * @access  Private
 */
router.get("/orders/my", protect, getMyOrders);

module.exports = router;