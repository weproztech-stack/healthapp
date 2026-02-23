const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const dashboardController = require("./dashboard.controller");

// GET /api/dashboard
router.get("/", protect, dashboardController.getDashboard);

module.exports = router;