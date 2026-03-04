const {
    searchNearbyLabs,
    getLabStatus,
    uploadLabReport,
  } = require("../services/lab.service");
  const { successResponse, errorResponse } = require("../utils/responseHandler");
  
  /**
   * GET /api/lab/nearby
   */
  const searchNearbyLabsController = async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
  
      if (!latitude || !longitude) {
        return errorResponse(res, "latitude and longitude are required", 400);
      }
  
      const labs = await searchNearbyLabs({
        latitude,
        longitude,
        radiusKm: radius ? parseFloat(radius) : 10,
      });
  
      return successResponse(res, "Nearby labs fetched successfully", {
        count: labs.length,
        labs,
      });
    } catch (error) {
      return errorResponse(res, error.message || "Failed to fetch labs", 500);
    }
  };
  
  /**
   * GET /api/lab/status/:id
   */
  const getLabStatusController = async (req, res) => {
    try {
      const { id: labId } = req.params;
  
      const status = await getLabStatus({ labId });
  
      return successResponse(res, "Lab status fetched successfully", status);
    } catch (error) {
      return errorResponse(res, error.message || "Failed to fetch lab status", 500);
    }
  };
  
  /**
   * POST /api/lab/upload
   */
  const uploadLabReportController = async (req, res) => {
    try {
      const { bookingId, userId, reportUrl, reportName } = req.body;
  
      if (!bookingId || !userId || !reportUrl) {
        return errorResponse(
          res,
          "bookingId, userId, and reportUrl are required",
          400
        );
      }
  
      const report = await uploadLabReport({
        bookingId,
        userId,
        reportUrl,
        reportName,
      });
  
      return successResponse(res, "Report uploaded successfully", report, 201);
    } catch (error) {
      return errorResponse(res, error.message || "Failed to upload report", 500);
    }
  };
  
  module.exports = {
    searchNearbyLabsController,
    getLabStatusController,
    uploadLabReportController,
  };