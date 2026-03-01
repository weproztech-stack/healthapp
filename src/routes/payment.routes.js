const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

/*
========================================
PAYMENT ROUTES
========================================
*/

// Create new payment
router.post("/", protect, paymentController.createPayment);

// Get current user's payments
router.get("/my", protect, paymentController.getMyPayments);

// Get refunds of current user
router.get("/refunds", protect, paymentController.getMyRefunds);

module.exports = router;