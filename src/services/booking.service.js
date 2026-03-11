const Booking = require("../models/booking.model");
const Doctor = require("../models/doctor.model");
const notify = require("./notification.service");

// ─────────────────────────────────────────
// BOOKING CREATE KARNA
// ─────────────────────────────────────────
const createBookingService = async (userId, bookingData) => {
  const { doctorId, mode, isEmergency, appointmentDate, appointmentTime, notes } = bookingData;

  // Doctor exist karta hai?
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  // Same slot already booked toh nahi?
  const existingBooking = await Booking.findOne({
    doctor: doctorId,
    appointmentDate,
    appointmentTime,
    status: { $in: ["pending", "confirmed"] },
  });
  if (existingBooking) throw new Error("This slot is already booked");

  // Fee calculate karo
  let totalFee = doctor.fee || 0;
  if (isEmergency) totalFee += doctor.emergencyFee || 200; // Emergency extra charge

  // Booking create karo
  const booking = await Booking.create({
    user: userId,
    doctor: doctorId,
    mode,
    isEmergency: isEmergency || false,
    appointmentDate,
    appointmentTime,
    notes: notes || "",
    totalFee,
    status: "pending",
  });

  // Patient ko notification bhejo
  await notify.notifyBookingConfirmed(
    userId,
    doctor.name,
    appointmentTime
  );

  return booking;
};

// ─────────────────────────────────────────
// BOOKING STATUS UPDATE (Doctor/Admin)
// ─────────────────────────────────────────
const updateBookingStatusService = async (bookingId, status, reason = null) => {
  const booking = await Booking.findById(bookingId).populate("doctor", "name");
  if (!booking) throw new Error("Booking not found");

  booking.status = status;
  if (reason) booking.cancellationReason = reason;
  await booking.save();

  //  Status ke hisaab se notification
  if (status === "confirmed") {
    await notify.notifyBookingConfirmed(
      booking.user,
      booking.doctor.name,
      booking.appointmentTime
    );
  } else if (status === "cancelled") {
    await notify.sendToUser(
      booking.user,
      " Booking Cancelled",
      `Your appointment with Dr. ${booking.doctor.name} has been cancelled. Reason: ${reason || "N/A"}`,
      { type: "BOOKING_CANCELLED" }
    );
  } else if (status === "completed") {
    await notify.sendToUser(
      booking.user,
      " Appointment Completed",
      `Your appointment with Dr. ${booking.doctor.name} is completed. Please rate your experience!`,
      { type: "BOOKING_COMPLETED" }
    );
  }

  return booking;
};

// ─────────────────────────────────────────
// ONLINE MEETING LINK ADD KARNA
// ─────────────────────────────────────────
const addMeetingLinkService = async (bookingId, meetingLink) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { meetingLink, status: "confirmed" },
    { new: true }
  ).populate("doctor", "name");

  if (!booking) throw new Error("Booking not found");

  //  Patient ko meeting link ki notification
  await notify.sendToUser(
    booking.user,
    "🎥 Meeting Link Ready!",
    `Your video consultation link is ready. Tap to join!`,
    { type: "MEETING_LINK_READY", meetingLink }
  );

  return booking;
};

// ─────────────────────────────────────────
// MY BOOKINGS (Patient)
// ─────────────────────────────────────────
const getMyBookingsService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ user: userId })
      .populate("doctor", "name speciality profilePic fee")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Booking.countDocuments({ user: userId }),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    count: bookings.length,
    data: bookings,
  };
};

// ─────────────────────────────────────────
// DOCTOR KI BOOKINGS (Doctor App)
// ─────────────────────────────────────────
const getDoctorBookingsService = async (doctorId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ doctor: doctorId })
      .populate("user", "name phone profilePic")
      .sort({ appointmentDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Booking.countDocuments({ doctor: doctorId }),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    count: bookings.length,
    data: bookings,
  };
};

module.exports = {
  createBookingService,
  updateBookingStatusService,
  addMeetingLinkService,
  getMyBookingsService,
  getDoctorBookingsService,
};