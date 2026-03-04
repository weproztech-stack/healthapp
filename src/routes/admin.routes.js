const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  addProduct,
  updateStock,
  updateOrderStatus,
} = require("../controllers/pharmacy.controller");

// =====================
// ADMIN APIS
// =====================

// POST /api/admin/add-product — Naya product add karo
router.post("/add-product", protect, addProduct);

// PATCH /api/admin/update-stock — Stock update karo
router.patch("/update-stock", protect, updateStock);

// PATCH /api/admin/order-status — Order status update karo
router.patch("/order-status", protect, updateOrderStatus);

module.exports = router;
