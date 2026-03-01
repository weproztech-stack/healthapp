const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const supportController = require("../controllers/support.controller");

/*
========================================
CREATE SUPPORT TICKET
POST /api/support
========================================
*/
router.post("/", protect, supportController.createTicket);

/*
========================================
GET MY SUPPORT TICKETS
GET /api/support/my
========================================
*/
router.get("/my", protect, supportController.getMyTickets);

module.exports = router;