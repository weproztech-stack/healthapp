const mongoose = require("mongoose");

const pharmacyProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: "Clozety" },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: null },

    mrp: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },

    prescriptionRequired: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyProduct", pharmacyProductSchema);