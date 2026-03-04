const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  getProductList,
  createOrder,
  getMyOrders,
} = require("../controllers/pharmacy.controller");

// =====================
// USER APIS
// =====================

// GET /api/pharmacy/list — All medicines & categories
router.get("/list", getProductList);

// POST /api/pharmacy/order — Place an order
router.post("/order", protect, createOrder);

// GET /api/pharmacy/orders/my — My orders
router.get("/orders/my", protect, getMyOrders);

module.exports = router;