const Doctor = require("../models/doctor.model");
const Booking = require("../models/booking.model");
const { generateSlots } = require("../utils/slotHelper");

/**
 * Search doctors within radius by speciality & geolocation
 */
const searchDoctors = async ({ latitude, longitude, speciality, radiusKm = 10 }) => {
  const radiusInMeters = radiusKm * 1000;

  const query = {
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
  };

  if (speciality) {
    query.speciality = { $regex: speciality, $options: "i" };
  }

  const doctors = await Doctor.find(query).select(
    "name speciality qualification experience consultationFee emergencyFeeExtra profileImage clinicAddress location rating totalReviews isAvailableOnline isAvailableClinic workingHours workingDays"
  );

  return doctors;
};

/**
 * Get available 30-min slots for a doctor on a given date
 */
const getDoctorSlots = async ({ doctorId, date }) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  const targetDate = date ? new Date(date) : new Date();
  const dayOfWeek = targetDate.getDay();

  // Check if doctor works on this day
  if (!doctor.workingDays.includes(dayOfWeek)) {
    return {
      available: [],
      booked: [],
      message: "Doctor not available on this day",
    };
  }

  // Generate all 30-min slots
  const allSlots = generateSlots(
    doctor.workingHours.start,
    doctor.workingHours.end,
    30
  );

  // Get already booked slots for this date
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedAppointments = await Booking.find({
    doctor: doctorId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["pending", "confirmed"] },
  }).select("appointmentTime");

  const bookedTimes = bookedAppointments.map((b) => b.appointmentTime);

  const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

  return {
    doctorId,
    date: targetDate.toISOString().split("T")[0],
    workingHours: doctor.workingHours,
    available: availableSlots,
    booked: bookedTimes,
  };
};

/**
 * Book an appointment with a doctor
 */
const bookAppointment = async ({
  userId,
  doctorId,
  mode,
  isEmergency,
  appointmentDate,
  appointmentTime,
  notes,
}) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  if (!doctor.isActive || !doctor.isVerified)
    throw new Error("Doctor is not available");

  // Mode availability check
  if (mode === "clinic" && !doctor.isAvailableClinic)
    throw new Error("Doctor not available for clinic visits");
  if (mode === "online" && !doctor.isAvailableOnline)
    throw new Error("Doctor not available for online consultations");

  // Fee calculation
  let totalFee = doctor.consultationFee;
  if (isEmergency) totalFee += doctor.emergencyFeeExtra;

  // Double booking check
  const slotConflict = await Booking.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ["pending", "confirmed"] },
  });
  if (slotConflict)
    throw new Error("This slot is already booked. Please choose another.");

  // Create booking
  const booking = await Booking.create({
    user: userId,
    doctor: doctorId,
    mode,
    isEmergency: isEmergency || false,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    notes: notes || "",
    totalFee,
    status: "pending",
  });

  // Populate response
  const populated = await booking.populate([
    {
      path: "doctor",
      select: "name speciality profileImage clinicAddress consultationFee",
    },
    {
      path: "user",
      select: "name email phone",
    },
  ]);

  return populated;
};

module.exports = { searchDoctors, getDoctorSlots, bookAppointment };