const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    /*
    User reference
    */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
    Lab name
    */
    labName: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    Report title
    */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    File URL
    */
    fileUrl: {
      type: String,
      required: true,
    },

    /*
    Notes
    */
    notes: {
      type: String,
      default: null,
    },

    /*
    Report date
    */
    reportDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/*
Index for faster queries
*/
reportSchema.index({ user: 1, createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;