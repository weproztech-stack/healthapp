const express = require("express");
const router = express.Router();
const {
  createOrGetRoom,
  getChatHistory,
  markMessagesRead,
  getUnreadCount,
} = require("../controllers/chat.controller");

const protect = require("../middlewares/auth.middleware"); // ✅ Fix

router.get("/room", protect, createOrGetRoom);
router.get("/history", protect, getChatHistory);
router.patch("/read", protect, markMessagesRead);
router.get("/unread", protect, getUnreadCount);

module.exports = router;