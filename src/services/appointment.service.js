const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");

/*
BOOK APPOINTMENT
*/
exports.createAppointment = async (identifier, data) => {

  const {
    doctorName,
    doctorSpecialization,
    type,
    appointmentDate,
    notes,
  } = data;

  if (!doctorName || !doctorSpecialization || !type || !appointmentDate) {
    throw new Error("Required fields missing");
  }

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const appointment = await Appointment.create({
    user: user._id,
    doctorName,
    doctorSpecialization,
    type,
    appointmentDate,
    notes: notes || null,
  });

  return appointment;
};


/*
GET USER APPOINTMENTS
*/
exports.getUserAppointments = async (identifier) => {

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const appointments = await Appointment.find({ user: user._id })
    .sort({ appointmentDate: -1 });

  return appointments;
};