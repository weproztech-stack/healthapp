const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    specialization: { type: String, default: "General Physiotherapy" },
    experience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    emergencyFeeExtra: { type: Number, default: 0 },
    profileImage: { type: String, default: null },

    isAvailableHome: { type: Boolean, default: true },
    isAvailableOnline: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    // Live tracking
    status: {
      type: String,
      enum: ["available", "on_the_way", "busy"],
      default: "available",
    },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    workingDays: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" },
    },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

physioSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Physio", physioSchema);