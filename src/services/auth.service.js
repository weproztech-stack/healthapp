

const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const generateToken = require("../utils/generateToken");
const axios = require("axios");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phone, otp) => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: "q",
        message: `Your OTP is ${otp}. Valid for 5 minutes.`,
        numbers: phone,
      },
    });
    console.log("SMS Response:", response.data);
  } catch (error) {
    console.error("SMS Error Full:", error.response?.data || error.message);
  }
};

exports.sendOTP = async (phone) => {
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ phone });
  await Otp.create({ phone, otp: otpCode, expiresAt });

  await sendSMS(phone, otpCode);

  return {
    message: "OTP sent successfully",
    otp: otpCode,
  };
};

exports.verifyOTP = async (phone, otp, name, role) => {
  const existingOTP = await Otp.findOne({ phone });

  if (!existingOTP) throw new Error("OTP not found");
  if (existingOTP.expiresAt < new Date()) throw new Error("OTP expired");
  if (existingOTP.otp !== otp) throw new Error("Invalid OTP");

  await Otp.deleteMany({ phone });

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      name: name || "",
      role: role || "patient",
      isVerified: true,
    });
  } else {
    if (name) user.name = name;
    if (role) user.role = role;
    await user.save();
  }

  const token = generateToken(user._id);

  return {
    message: "OTP verified successfully",
    token,
    user,
  };
};

exports.registerUser = async (userId, data) => {
  const { name, email, role, deviceToken } = data;
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");
  if (user.name) throw new Error("User already registered");

  user.name = name;
  user.email = email;
  user.role = role;
  user.deviceToken = deviceToken;
  await user.save();

  return { message: "User registered successfully", user };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};