const Physio = require("../models/physio.model");
const notify = require("./notification.service");
const maps = require("./maps.service"); 

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

  await notify.notifyBookingConfirmed(userId, physio.name, appointmentTime);

  return populated;
};

const updatePhysioStatus = async ({
  physioId,
  status,
  bookingId,
  patientId,
  patientLat,  
  patientLng,  
}) => {
  const physio = await Physio.findByIdAndUpdate(
    physioId,
    { status },
    { new: true }
  );

  if (!physio) throw new Error("Physiotherapist not found");

  let etaText = "30 mins";

  //  Real ETA Google Maps se
  if (status === "on_the_way" && physio.location && patientLat && patientLng) {
    const eta = await maps.calculateETA({
      originLat: physio.location.coordinates[1],
      originLng: physio.location.coordinates[0],
      destLat: patientLat,
      destLng: patientLng,
    });
    etaText = eta.duration;
  }

  //  Patient ko notify karo real ETA ke saath
  if (status === "on_the_way" && patientId) {
    await notify.notifyPartnerOnTheWay(patientId, physio.name, etaText);
  }

  return {
    physioId,
    status: physio.status,
    eta: etaText,
    message:
      status === "on_the_way"
        ? `Physiotherapist is on the way! ETA: ${etaText}`
        : `Status updated to ${status}`,
  };
};

module.exports = { searchPhysios, bookPhysio, updatePhysioStatus };