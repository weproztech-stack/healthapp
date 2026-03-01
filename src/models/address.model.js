const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, isActive: 1 });

addressSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    label: this.label,
    fullName: this.fullName,
    phone: this.phone,
    addressLine1: this.addressLine1,
    addressLine2: this.addressLine2,
    city: this.city,
    state: this.state,
    pincode: this.pincode,
    landmark: this.landmark,
    isDefault: this.isDefault,
  };
};

module.exports = mongoose.model("Address", addressSchema);