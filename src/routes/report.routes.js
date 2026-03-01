const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const reportController = require("../controllers/report.controller");

/*
========================================
UPLOAD REPORT
POST /api/reports
========================================
*/
router.post("/", protect, reportController.uploadReport);

/*
========================================
GET MY REPORTS
GET /api/reports/my
========================================
*/
router.get("/my", protect, reportController.getMyReports);

module.exports = router;