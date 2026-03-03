const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    mode: {
      type: String,
      enum: ["clinic", "online"],
      required: true,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    totalFee: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    meetingLink: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.index({
  doctor: 1,
  appointmentDate: 1,
  appointmentTime: 1,
  status: 1,
});

module.exports = mongoose.model("Booking", bookingSchema);