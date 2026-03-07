const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    address: { type: String, required: true },

    // Tests jo lab offer karta hai
    tests: [{ type: String }],

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isHomeCollection: { type: Boolean, default: true },
    homeCollectionFee: { type: Number, default: 0 },

    openTime: { type: String, default: "08:00" },
    closeTime: { type: String, default: "20:00" },

    // Sample collector ka status
    collectorStatus: {
      type: String,
      enum: ["free", "busy"],
      default: "free",
    },

    // ETA jab collector busy hoooooo
    eta: { type: String, default: null },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    profileImage: { type: String, default: null },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

labSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Lab", labSchema);