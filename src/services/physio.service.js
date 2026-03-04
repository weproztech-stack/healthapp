const Physio = require("../models/physio.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

/**
 * Search nearby physiotherapists
 */
const searchPhysios = async ({ latitude, longitude, radiusKm = 10 }) => {
  const radiusInMeters = radiusKm * 1000;

  const physios = await Physio.find({
    isActive: true,
    isVerified: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: radiusInMeters,
      },
    },
  }).select(
    "name specialization experience consultationFee emergencyFeeExtra profileImage location rating totalReviews isAvailableHome isAvailableOnline workingHours workingDays status"
  );

  return physios;
};

/**
 * Book a physiotherapy session
 */
const bookPhysio = async ({
  userId,
  physioId,
  mode,
  appointmentDate,
  appointmentTime,
  address,
  mapLocation,
  notes,
  isEmergency,
}) => {
  const physio = await Physio.findById(physioId);
  if (!physio) throw new Error("Physiotherapist not found");
  if (!physio.isActive || !physio.isVerified)
    throw new Error("Physiotherapist is not available");

  if (mode === "home" && !physio.isAvailableHome)
    throw new Error("Physiotherapist not available for home visits");
  if (mode === "online" && !physio.isAvailableOnline)
    throw new Error("Physiotherapist not available for online sessions");

  // Home visit ke liye address mandatory
  if (mode === "home" && (!address || !mapLocation)) {
    throw new Error("Address and map location are required for home visits");
  }

  let totalFee = physio.consultationFee;
  if (isEmergency) totalFee += physio.emergencyFeeExtra;

  const Booking = require("../models/booking.model");

  const booking = await Booking.create({
    user: userId,
    doctor: physioId,
    mode: mode === "home" ? "clinic" : "online",
    isEmergency: isEmergency || false,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    notes: notes || "",
    totalFee,
    status: "pending",
    address: address || null,
    mapLocation: mapLocation || null,
  });

  const populated = await booking.populate([
    { path: "doctor", select: "name specialization profileImage consultationFee" },
    { path: "user", select: "name email phone" },
  ]);

  return populated;
};

/**
 * Update physio status — On the way
 */
const updatePhysioStatus = async ({ physioId, status, bookingId }) => {
  const physio = await Physio.findByIdAndUpdate(
    physioId,
    { status },
    { new: true }
  );

  if (!physio) throw new Error("Physiotherapist not found");

  return {
    physioId,
    status: physio.status,
    message:
      status === "on_the_way"
        ? "Physiotherapist is on the way!"
        : `Status updated to ${status}`,
  };
};

module.exports = { searchPhysios, bookPhysio, updatePhysioStatus };