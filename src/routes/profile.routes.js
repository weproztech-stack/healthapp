const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/profile.controller");

/* Profile */
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

/* Address */
router.post("/address", protect, addAddress);
router.get("/addresses", protect, getAddresses);
router.delete("/address/:id", protect, deleteAddress);
router.patch("/address/:id/default", protect, setDefaultAddress);

module.exports = router;