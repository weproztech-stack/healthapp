const chatService = require("../services/chat.service");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// GET /api/chat/room - Room ID banana booking se
const createOrGetRoom = async (req, res) => {
  try {
    const { bookingId } = req.query;

    if (!bookingId) {
      return errorResponse(res, "bookingId required hai", 400);
    }

    const roomId = chatService.createRoomId(bookingId);

    return successResponse(res, "Room ready hai", { roomId });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/chat/history - Purani chat load karna
const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return errorResponse(res, "roomId required hai", 400);
    }

    const messages = await chatService.getChatHistory(roomId);

    return successResponse(res, "Chat history mil gayi", { messages });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// PATCH /api/chat/read - Messages read mark karna (blue tick)
const markMessagesRead = async (req, res) => {
  try {
    const { roomId } = req.body;
    const receiverId = req.user._id; // JWT se aayega

    if (!roomId) {
      return errorResponse(res, "roomId required hai", 400);
    }

    await chatService.markAsRead(roomId, receiverId);

    return successResponse(res, "Messages read mark ho gaye");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/chat/unread - Unread count (notification badge)
const getUnreadCount = async (req, res) => {
  try {
    const { roomId } = req.query;
    const receiverId = req.user._id;

    const count = await chatService.getUnreadCount(roomId, receiverId);

    return successResponse(res, "Unread count", { unreadCount: count });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createOrGetRoom,
  getChatHistory,
  markMessagesRead,
  getUnreadCount,
};