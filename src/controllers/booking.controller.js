// booking.controller.js
const {
    createBookingService,
    updateBookingStatusService,
    addMeetingLinkService,
    getMyBookingsService,
    getDoctorBookingsService,
  } = require("../services/booking.service");
  
  // ─────────────────────────────────────────
  // POST /api/booking/create
  // Patient - Naya appointment book karo
  // ─────────────────────────────────────────
  exports.createBooking = async (req, res) => {
    try {
      const booking = await createBookingService(req.user._id, req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  // ─────────────────────────────────────────
  // PATCH /api/booking/:id/status
  // Doctor/Admin - Status update karo
  // ─────────────────────────────────────────
  exports.updateBookingStatus = async (req, res) => {
    try {
      const { status, reason } = req.body;
      const booking = await updateBookingStatusService(
        req.params.id,
        status,
        reason
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  // ─────────────────────────────────────────
  // PATCH /api/booking/:id/meeting-link
  // Doctor - Online meeting link add karo
  // ─────────────────────────────────────────
  exports.addMeetingLink = async (req, res) => {
    try {
      const { meetingLink } = req.body;
      const booking = await addMeetingLinkService(req.params.id, meetingLink);
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  // ─────────────────────────────────────────
  // GET /api/booking/my
  // Patient - Apni saari bookings dekho
  // ─────────────────────────────────────────
  exports.getMyBookings = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const bookings = await getMyBookingsService(
        req.user._id,
        Number(page) || 1,
        Number(limit) || 10
      );
      res.json({ success: true, ...bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ─────────────────────────────────────────
  // GET /api/booking/doctor
  // Doctor - Apni saari bookings dekho
  // ─────────────────────────────────────────
  exports.getDoctorBookings = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const bookings = await getDoctorBookingsService(
        req.user._id,
        Number(page) || 1,
        Number(limit) || 10
      );
      res.json({ success: true, ...bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };