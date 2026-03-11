const ChatMessage = require("../models/chatMessage.model");
const notify = require("./notification.service"); // ADDED

// Room ID banana - booking se
const createRoomId = (bookingId) => {
  return `room_${bookingId}`;
};

// Message save karna MongoDB mein
const saveMessage = async (data) => {
  const message = await ChatMessage.create({
    roomId: data.roomId,
    senderId: data.senderId,
    receiverId: data.receiverId,
    message: data.message || "",
    fileUrl: data.fileUrl || null,
    fileType: data.fileType || "none",
    bookingType: data.bookingType,
  });

  // ✅ ADDED - Receiver ko notification bhejo
  await notify.notifyNewMessage(
    data.receiverId,
    data.senderName || "Someone"
  );

  return message;
};

// Purani chat history load karna
const getChatHistory = async (roomId) => {
  const messages = await ChatMessage.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("senderId", "name profilePic")
    .populate("receiverId", "name profilePic");
  return messages;
};

// Message ko read mark karna (blue tick)
const markAsRead = async (roomId, receiverId) => {
  await ChatMessage.updateMany(
    { roomId, receiverId, isRead: false },
    { isRead: true }
  );
};

// Unread messages count
const getUnreadCount = async (roomId, receiverId) => {
  const count = await ChatMessage.countDocuments({
    roomId,
    receiverId,
    isRead: false,
  });
  return count;
};

module.exports = {
  createRoomId,
  saveMessage,
  getChatHistory,
  markAsRead,
  getUnreadCount,
};