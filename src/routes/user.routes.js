const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");

router.get("/me", protect, userController.getMe);
router.patch("/location", protect, userController.updateLocation);
router.get("/addresses", protect, userController.getAddresses);
router.post("/addresses", protect, userController.addAddress);
router.put("/addresses/:id", protect, userController.updateAddress);
router.delete("/addresses/:id", protect, userController.deleteAddress);
router.get("/orders", protect, userController.getOrders);
router.get("/payments", protect, userController.getPaymentHistory);

module.exports = router;
