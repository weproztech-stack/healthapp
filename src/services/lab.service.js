const Lab = require("../models/lab.model");
const Report = require("../models/report.model");
const notify = require("./notification.service");
const maps = require("./maps.service"); // ✅ ADDED

// ─────────────────────────────────────────
// NEARBY LABS SEARCH
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// LAB COLLECTOR STATUS + REAL ETA
// ─────────────────────────────────────────
const getLabStatus = async ({ labId, patientLat, patientLng }) => {
  const lab = await Lab.findById(labId);
  if (!lab) throw new Error("Lab not found");

  let etaText = lab.eta || "30-45 minutes";

  //  Real ETA Google Maps se calculate karo
  if (
    lab.collectorStatus === "busy" &&
    lab.collectorLocation &&
    patientLat &&
    patientLng
  ) {
    const eta = await maps.calculateETA({
      originLat: lab.collectorLocation.lat,
      originLng: lab.collectorLocation.lng,
      destLat: patientLat,
      destLng: patientLng,
    });
    etaText = eta.duration; // "25 mins"
  }

  return {
    labId,
    labName: lab.name,
    collectorStatus: lab.collectorStatus,
    eta: lab.collectorStatus === "busy" ? etaText : null,
    message:
      lab.collectorStatus === "free"
        ? "Collector is available"
        : `Collector is busy. ETA: ${etaText}`,
  };
};

// ─────────────────────────────────────────
// LAB REPORT UPLOAD + NOTIFICATION
// ─────────────────────────────────────────
const uploadLabReport = async ({
  bookingId,
  userId,
  reportUrl,
  reportName,
  testName,
}) => {
  const report = await Report.create({
    user: userId,
    labName: "Lab Partner",
    title: reportName || "Lab Report",
    fileUrl: reportUrl,
    reportDate: new Date(),
  });

  // ✅ Patient ko notify karo report ready hai
  await notify.notifyReportReady(
    userId,
    testName || reportName || "Lab Report"
  );

  return report;
};

module.exports = { searchNearbyLabs, getLabStatus, uploadLabReport };