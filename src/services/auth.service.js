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
    otp: otpCode, // remove later in production
  };
};

/*
   VERIFY OTP → Generate Token Only
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

  const token = generateToken(phone);

  return {
    message: "OTP verified successfully",
    token,
  };
};

/*
   REGISTER USER (Protected Route)
*/
exports.registerUser = async (identifier, data) => {
  const { name, email, role, deviceToken } = data;

  // identifier is phone (from token)
  const existingUser = await User.findOne({ phone: identifier });

  if (existingUser) {
    throw new Error("User already registered");
  }

  const user = await User.create({
    name,
    phone: identifier,
    email,
    role,
    deviceToken,
    isVerified: true,
  });

  return {
    message: "User registered successfully",
    user,
  };
};

/*
   GET CURRENT USER
*/
exports.getMe = async (identifier) => {
  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};