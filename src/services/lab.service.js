const Lab = require("../models/lab.model");
const Report = require("../models/report.model");

/**
 * Search nearby labs
 */
const searchNearbyLabs = async ({ latitude, longitude, radiusKm = 10 }) => {
  const radiusInMeters = radiusKm * 1000;

  const labs = await Lab.find({
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
    "name address phone email tests location rating totalReviews isHomeCollection homeCollectionFee openTime closeTime collectorStatus"
  );

  return labs;
};

/**
 * Get lab collector status + ETA
 */
const getLabStatus = async ({ labId }) => {
  const lab = await Lab.findById(labId);
  if (!lab) throw new Error("Lab not found");

  return {
    labId,
    labName: lab.name,
    collectorStatus: lab.collectorStatus,
    eta: lab.collectorStatus === "busy" ? lab.eta || "30-45 minutes" : null,
    message:
      lab.collectorStatus === "free"
        ? "Collector is available"
        : `Collector is busy. ETA: ${lab.eta || "30-45 minutes"}`,
  };
};

/**
 * Upload lab report (PDF)
 */
const uploadLabReport = async ({ bookingId, userId, reportUrl, reportName }) => {
  const report = await Report.create({
    user: userId,
    labName: "Lab Partner",
    title: reportName || "Lab Report",
    fileUrl: reportUrl,
    reportDate: new Date(),
  });

  return report;
};

module.exports = { searchNearbyLabs, getLabStatus, uploadLabReport };