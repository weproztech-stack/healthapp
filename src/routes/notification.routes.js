// notification.routes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware"); 
const {
  sendTestNotification,
  updateDeviceToken,
} = require("../controllers/notification.controller");

router.patch("/device-token", protect, updateDeviceToken);
router.post("/test", protect, sendTestNotification);

module.exports = router;