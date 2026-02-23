const dashboardService = require("./dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const identifier = req.user.identifier;

    const data = await dashboardService.getDashboardData(identifier);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};