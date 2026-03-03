const express = require("express");
const router = express.Router();

const {
  searchDoctorsController,
  getDoctorSlotsController,
  bookAppointmentController,
} = require("../controllers/doctor.controller");

const protect = require("../middlewares/auth.middleware");

router.get("/search", searchDoctorsController);
router.get("/slots/:id", getDoctorSlotsController);
router.post("/book", protect, bookAppointmentController);

module.exports = router;