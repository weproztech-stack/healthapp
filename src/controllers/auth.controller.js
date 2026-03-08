const authService = require("../services/auth.service");

/*
   Send OTP
*/
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const result = await authService.sendOTP(phone);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
   Verify OTP + Login + Register (Ek hi step mein)
*/
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name, role } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const result = await authService.verifyOTP(phone, otp, name, role);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
   Register User (Protected)
*/
exports.register = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await authService.registerUser(userId, req.body);

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
   Get Current User
*/
exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await authService.getMe(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
   Logout
*/
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};