const express = require("express");
const router = express.Router();

const {
  searchNearbyLabsController,
  getLabStatusController,
  uploadLabReportController,
} = require("../controllers/lab.controller");

const protect = require("../middlewares/auth.middleware");

// Nearby labs search
router.get("/nearby", searchNearbyLabsController);

// Lab collector status + ETA
router.get("/status/:id", getLabStatusController);

// Upload lab report — Partner App (lab technician)
router.post("/upload", protect, uploadLabReportController);

module.exports = router;