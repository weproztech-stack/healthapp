const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const generateToken = require("../utils/generateToken");

/*
   Generate Random 6-digit OTP
*/
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/*
   SEND OTP
*/
exports.sendOTP = async (phone) => {
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ phone });

  await Otp.create({
    phone,
    otp: otpCode,
    expiresAt,
  });

  return {
    message: "OTP sent successfully",
    otp: otpCode, // remove in production
  };
};

/*
   VERIFY OTP → Find/Create User → Generate Token (FIXED)
*/
exports.verifyOTP = async (phone, otp) => {
  const existingOTP = await Otp.findOne({ phone });

  if (!existingOTP) {
    throw new Error("OTP not found");
  }

  if (existingOTP.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (existingOTP.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await Otp.deleteMany({ phone });

  // 🔥 Find or create user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      isVerified: true,
    });
  }

  // 🔥 IMPORTANT FIX → generate token using user._id
  const token = generateToken(user._id);

  return {
    message: "OTP verified successfully",
    token,
    user,
  };
};

/*
   REGISTER USER (Protected Route)
*/
exports.registerUser = async (userId, data) => {
  const { name, email, role, deviceToken } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.name) {
    throw new Error("User already registered");
  }

  user.name = name;
  user.email = email;
  user.role = role;
  user.deviceToken = deviceToken;

  await user.save();

  return {
    message: "User registered successfully",
    user,
  };
};

/*
   GET CURRENT USER
*/
exports.getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};