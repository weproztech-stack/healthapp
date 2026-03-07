const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true, // Fast search ke liye
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: null, // Photo/PDF ka Cloudinary link
    },
    fileType: {
      type: String,
      enum: ["image", "pdf", "none"],
      default: "none",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    bookingType: {
      type: String,
      enum: ["doctor", "physio", "lab"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);