const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "physio", "lab", "admin"],
      default: "patient",
    },

    deviceToken: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);

/*
   
  Convert document to safe JSON 
*/

userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    role: this.role,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
  };
};

/*
   Static Reusable Method
  Find user by phone
*/

userSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone });
};

const User = mongoose.model("User", userSchema);

module.exports = User;