const notificationService = require("../services/notification.service");

// Manual test notification bhejna (Admin use)
exports.sendTestNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    const result = await notificationService.sendToUser(userId, title, body);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Device token update (Frontend se call hoga login ke baad)
exports.updateDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    const userId = req.user._id;
    await notificationService.updateDeviceToken(userId, deviceToken);
    res.json({ success: true, message: "Device token updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};