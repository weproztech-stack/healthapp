const admin = require("../config/firebase");
const User = require("../models/user.model");

// ─────────────────────────────────────────
// SINGLE USER KO NOTIFICATION BHEJNA
// ─────────────────────────────────────────
exports.sendToUser = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.deviceToken) {
      console.log("No device token found for user:", userId);
      return null;
    }

    const message = {
      token: user.deviceToken,
      notification: { title, body },
      data: { ...data, click_action: "FLUTTER_NOTIFICATION_CLICK" },
      android: {
        priority: "high",
        notification: { sound: "default", channelId: "default" },
      },
      apns: {
        payload: { aps: { sound: "default", badge: 1 } },
      },
    };

    const response = await admin.messaging().send(message);
    console.log(" Notification sent:", response);
    return response;

  } catch (error) {
    console.error(" Notification error:", error.message);
    return null; // App crash nahi hogi notification fail pe
  }
};

// ─────────────────────────────────────────
// MULTIPLE USERS KO EK SAATH (Multicast)
// ─────────────────────────────────────────
exports.sendToMultiple = async (userIds, title, body, data = {}) => {
  try {
    const users = await User.find({
      _id: { $in: userIds },
      deviceToken: { $exists: true, $ne: null },
    });

    const tokens = users.map((u) => u.deviceToken).filter(Boolean);
    if (tokens.length === 0) return null;

    const message = {
      tokens,
      notification: { title, body },
      data,
      android: { priority: "high" },
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(` Sent: ${response.successCount}, Failed: ${response.failureCount}`);
    return response;

  } catch (error) {
    console.error("❌ Multicast error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────
// PREDEFINED NOTIFICATION TEMPLATES
// ─────────────────────────────────────────

// Booking confirm hone pe
exports.notifyBookingConfirmed = async (patientId, doctorName, appointmentTime) => {
  return exports.sendToUser(
    patientId,
    " Booking Confirmed!",
    `Your appointment with Dr. ${doctorName} is confirmed at ${appointmentTime}`,
    { type: "BOOKING_CONFIRMED" }
  );
};

// Doctor on the way (physio/home visit)
exports.notifyPartnerOnTheWay = async (patientId, partnerName, eta) => {
  return exports.sendToUser(
    patientId,
    " Partner On The Way!",
    `${partnerName} is heading to your location. ETA: ${eta} mins`,
    { type: "PARTNER_ON_WAY" }
  );
};

// Lab report ready
exports.notifyReportReady = async (patientId, testName) => {
  return exports.sendToUser(
    patientId,
    " Report Ready!",
    `Your ${testName} report is available. Tap to download.`,
    { type: "REPORT_READY" }
  );
};

// New chat message
exports.notifyNewMessage = async (receiverId, senderName) => {
  return exports.sendToUser(
    receiverId,
    " New Message",
    `${senderName} sent you a message`,
    { type: "NEW_MESSAGE" }
  );
};

// Order status update (pharmacy)
exports.notifyOrderStatus = async (userId, status, orderId) => {
  const messages = {
    Packed: " Your order has been packed and is ready for dispatch!",
    "Out for Delivery": " Your order is out for delivery!",
    Delivered: " Your order has been delivered. Enjoy!",
  };

  return exports.sendToUser(
    userId,
    `Order ${status}`,
    messages[status] || `Your order status: ${status}`,
    { type: "ORDER_UPDATE", orderId: orderId?.toString() }
  );
};

// DeviceToken update karna (login ke time)
exports.updateDeviceToken = async (userId, deviceToken) => {
  await User.findByIdAndUpdate(userId, { deviceToken });
  console.log(" Device token updated for:", userId);
};