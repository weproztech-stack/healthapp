const appointmentService = require("../services/appointment.service");


const bookAppointment = async (req, res) => {
  try {

    const identifier = req.user.identifier;

    const appointment = await appointmentService.createAppointment(
      identifier,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};



const getMyAppointments = async (req, res) => {

  try {

    const identifier = req.user.identifier;

    const appointments =
      await appointmentService.getUserAppointments(identifier);

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};



module.exports = {
  bookAppointment,
  getMyAppointments,
};