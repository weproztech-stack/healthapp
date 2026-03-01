const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const dashboardController = require("./dashboard.controller");

/*
========================================
VALIDATION: ensure controller exists
========================================
*/
if (
  !dashboardController ||
  typeof dashboardController.getDashboardData !== "function"
) {
  throw new Error(
    "dashboard.controller.js must export getDashboardData function"
  );
}

/*
========================================
GET DASHBOARD DATA
GET /api/dashboard
========================================
*/
router.get(
  "/",
  protect,
  dashboardController.getDashboardData
);

/*
========================================
EXPORT ROUTER (CRITICAL)
========================================
*/
module.exports = router;