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
   Verify OTP + Login
*/
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const result = await authService.verifyOTP(phone, otp);

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
  Register User (Optional - Profile Completion)
*/
exports.register = async (req, res) => {
    try {
      const identifier = req.user.identifier;
  
      const result = await authService.registerUser(identifier, req.body);
  
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
      const identifier = req.user.identifier;
  
      const user = await authService.getMe(identifier);
  
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