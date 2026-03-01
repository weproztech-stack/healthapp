const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    /*
    Patient
    */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
    Doctor info
    */
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },

    doctorSpecialization: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    Appointment type
    */
    type: {
      type: String,
      enum: ["ONLINE", "CLINIC"],
      required: true,
    },

    /*
    Appointment date & time
    */
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    /*
    Optional notes
    */
    notes: {
      type: String,
      default: null,
    },

    /*
    Status
    */
    status: {
      type: String,
      enum: ["BOOKED", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "BOOKED",
      index: true,
    },

    /*
    Meeting link (for ONLINE)
    */
    meetingLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ user: 1, createdAt: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;