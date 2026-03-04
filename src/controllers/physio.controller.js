const {
    searchPhysios,
    bookPhysio,
    updatePhysioStatus,
  } = require("../services/physio.service");
  const { successResponse, errorResponse } = require("../utils/responseHandler");
  
  /**
   * GET /api/physio/search
   */
  const searchPhysiosController = async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
  
      if (!latitude || !longitude) {
        return errorResponse(res, "latitude and longitude are required", 400);
      }
  
      const physios = await searchPhysios({
        latitude,
        longitude,
        radiusKm: radius ? parseFloat(radius) : 10,
      });
  
      return successResponse(res, "Physiotherapists fetched successfully", {
        count: physios.length,
        physios,
      });
    } catch (error) {
      return errorResponse(res, error.message || "Failed to search physios", 500);
    }
  };
  
  /**
   * POST /api/physio/book
   */
  const bookPhysioController = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const {
        physioId,
        mode,
        appointmentDate,
        appointmentTime,
        address,
        mapLocation,
        notes,
        isEmergency,
      } = req.body;
  
      if (!physioId || !mode || !appointmentDate || !appointmentTime) {
        return errorResponse(
          res,
          "physioId, mode, appointmentDate, and appointmentTime are required",
          400
        );
      }
  
      if (!["home", "online"].includes(mode)) {
        return errorResponse(res, "mode must be 'home' or 'online'", 400);
      }
  
      if (mode === "home" && (!address || !mapLocation)) {
        return errorResponse(
          res,
          "address and mapLocation are required for home visits",
          400
        );
      }
  
      const booking = await bookPhysio({
        userId,
        physioId,
        mode,
        appointmentDate,
        appointmentTime,
        address,
        mapLocation,
        notes,
        isEmergency,
      });
  
      return successResponse(res, "Physiotherapy session booked successfully", booking, 201);
    } catch (error) {
      return errorResponse(res, error.message || "Failed to book session", 500);
    }
  };
  
  /**
   * PATCH /api/physio/status
   */
  const updatePhysioStatusController = async (req, res) => {
    try {
      const { physioId, status, bookingId } = req.body;
  
      if (!physioId || !status) {
        return errorResponse(res, "physioId and status are required", 400);
      }
  
      if (!["available", "on_the_way", "busy"].includes(status)) {
        return errorResponse(
          res,
          "status must be 'available', 'on_the_way', or 'busy'",
          400
        );
      }
  
      const result = await updatePhysioStatus({ physioId, status, bookingId });
  
      return successResponse(res, result.message, result);
    } catch (error) {
      return errorResponse(res, error.message || "Failed to update status", 500);
    }
  };
  
  module.exports = {
    searchPhysiosController,
    bookPhysioController,
    updatePhysioStatusController,
  };