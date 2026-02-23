const User = require("../models/user.model");

exports.getDashboardData = async (identifier) => {
  // identifier = phone (from JWT)

  const user = await User.findOne({ phone: identifier });

  // Case 1: OTP verified but not registered yet
  if (!user) {
    return {
      profileCompleted: false,
      message: "Profile not completed",
    };
  }

  // Case 2: Registered user
  return {
    profileCompleted: true,
    user: user.toSafeObject(),
  };
};