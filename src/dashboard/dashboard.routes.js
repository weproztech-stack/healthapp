const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const dashboardController = require("./dashboard.controller");


if (
  !dashboardController ||
  typeof dashboardController.getDashboardData !== "function"
) {
  throw new Error(
    "dashboard.controller.js must export getDashboardData function"
  );
}


router.get(
  "/",
  protect,
  dashboardController.getDashboardData
);


module.exports = router;