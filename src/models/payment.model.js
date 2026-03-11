const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Booking ID (doctor/lab/physio/pharmacy)
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Booking Type
    bookingType: {
      type: String,
      enum: ["doctor", "lab", "physio", "pharmacy", "other"],
      required: true,
    },

    // Amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
    },

    // Payment Method
    method: {
      type: String,
      enum: ["COD", "ONLINE", "UPI", "CARD", "NETBANKING"],
      default: "ONLINE",
    },

    // Razorpay Fields
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    // Payment Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Refund Fields
    refundStatus: {
      type: String,
      enum: ["none", "refunded", "partial"],
      default: "none",
    },

    refundId: {
      type: String,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundReason: {
      type: String,
      default: null,
    },

    refundAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;