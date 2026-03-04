const {
    searchDoctors,
    getDoctorSlots,
    bookAppointment,
  } = require("../services/doctor.service");
  const { successResponse, errorResponse } = require("../utils/responseHandler");
  

  const searchDoctorsController = async (req, res) => {
    try {
      const { latitude, longitude, speciality, radius } = req.query;
  
      if (!latitude || !longitude) {
        return errorResponse(res, "latitude and longitude are required", 400);
      }
  
      const doctors = await searchDoctors({
        latitude,
        longitude,
        speciality,
        radiusKm: radius ? parseFloat(radius) : 10,
      });
  
      return successResponse(res, "Doctors fetched successfully", {
        count: doctors.length,
        doctors,
      });
    } catch (error) {
      return errorResponse(res, error.message || "Failed to search doctors", 500);
    }
  };
  
  const getDoctorSlotsController = async (req, res) => {
    try {
      const { id: doctorId } = req.params;
      const { date } = req.query;
  
      const slots = await getDoctorSlots({ doctorId, date });
  
      return successResponse(res, "Slots fetched successfully", slots);
    } catch (error) {
      return errorResponse(res, error.message || "Failed to fetch slots", 500);
    }
  };
  
 
  const bookAppointmentController = async (req, res) => {
    try {
      const userId = req.user._id; // auth middleware se aayega
  
      const {
        doctorId,
        mode,
        isEmergency,
        appointmentDate,
        appointmentTime,
        notes,
      } = req.body;
  
      // Validation
      if (!doctorId || !mode || !appointmentDate || !appointmentTime) {
        return errorResponse(
          res,
          "doctorId, mode, appointmentDate, and appointmentTime are required",
          400
        );
      }
  
      if (!["clinic", "online"].includes(mode)) {
        return errorResponse(res, "mode must be 'clinic' or 'online'", 400);
      }
  
      const booking = await bookAppointment({
        userId,
        doctorId,
        mode,
        isEmergency,
        appointmentDate,
        appointmentTime,
        notes,
      });
  
      return successResponse(res, "Appointment booked successfully", booking, 201);
    } catch (error) {
      return errorResponse(
        res,
        error.message || "Failed to book appointment",
        500
      );
    }
  };
  
  module.exports = {
    searchDoctorsController,
    getDoctorSlotsController,
    bookAppointmentController,
  };