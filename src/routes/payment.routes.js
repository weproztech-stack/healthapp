const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

/*
========================================
PAYMENT ROUTES
========================================
*/

// Create new payment (Razorpay order banao)
router.post("/", protect, paymentController.createPayment);

// Verify payment (Frontend se signature verify)
router.post("/verify", protect, paymentController.verifyPayment);

// Process refund
router.post("/refund/:paymentId", protect, paymentController.processRefund);

// Get current user's payments
router.get("/my", protect, paymentController.getMyPayments);

// Get refunds of current user
router.get("/refunds", protect, paymentController.getMyRefunds);

module.exports = router;