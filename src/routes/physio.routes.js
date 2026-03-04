
const express = require("express");
const router = express.Router();

const {
  searchPhysiosController,
  bookPhysioController,
  updatePhysioStatusController,
} = require("../controllers/physio.controller");

const protect = require("../middlewares/auth.middleware");

// Search nearby physios
router.get("/search", searchPhysiosController);

// Book a session (login required)
router.post("/book", protect, bookPhysioController);

// Update physio status - on the way (login required)
router.patch("/status", protect, updatePhysioStatusController);

module.exports = router;