const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");

// Send OTP
router.post("/send-otp", authController.sendOTP);

// Verify OTP
router.post("/verify-otp", authController.verifyOTP);

// Register (Protected)
router.post("/register", protect, authController.register);

// Get Current User (Protected)
router.get("/me", protect, authController.getMe);

module.exports = router;