const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const appointmentController = require("../controllers/appointment.controller");


/*
Book appointment
POST /api/appointments
*/
router.post("/", protect, appointmentController.bookAppointment);


/*
Get my appointments
GET /api/appointments/my
*/
router.get("/my", protect, appointmentController.getMyAppointments);


module.exports = router;