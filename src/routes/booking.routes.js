// booking.routes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware"); 
const {
  createBooking,
  updateBookingStatus,
  addMeetingLink,
  getMyBookings,
  getDoctorBookings,
} = require("../controllers/booking.controller");

// Patient routes
router.post("/create", protect, createBooking);
router.get("/my", protect, getMyBookings);

// Doctor routes
router.get("/doctor", protect, getDoctorBookings);
router.patch("/:id/meeting-link", protect, addMeetingLink);

// Status update
router.patch("/:id/status", protect, updateBookingStatus);

module.exports = router;