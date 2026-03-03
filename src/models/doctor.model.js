const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    speciality: { type: String, required: true },
    qualification: { type: String },
    experience: { type: Number, default: 0 }, // years mein
    consultationFee: { type: Number, default: 0 },
    emergencyFeeExtra: { type: Number, default: 200 },
    profileImage: { type: String },

    // Clinic location (geolocation)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    clinicAddress: { type: String },

    // Working hours
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },
    workingDays: {
      type: [Number], // 0=Sun, 1=Mon ... 6=Sat
      default: [1, 2, 3, 4, 5],
    },

    isAvailableOnline: { type: Boolean, default: true },
    isAvailableClinic: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    deviceToken: { type: String },
  },
  { timestamps: true }
);

// Geolocation index
doctorSchema.index({ location: "2dsphere" });
doctorSchema.index({ speciality: 1 });

module.exports = mongoose.model("Doctor", doctorSchema);