const { Server } = require("socket.io");
const chatService = require("../services/chat.service");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Production mein apna domain dalna
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // ─────────────────────────────────────────
    // 1. ROOM JOIN - Jab user chat screen khole
    // ─────────────────────────────────────────
    socket.on("joinRoom", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`👤 User ${userId} joined room: ${roomId}`);

      // Dusre user ko batao ke saamne wala aa gaya
      socket.to(roomId).emit("userJoined", { userId });
    });

    // ─────────────────────────────────────────
    // 2. MESSAGE SEND - Jab koi message bheje
    // ─────────────────────────────────────────
    socket.on("sendMessage", async (data) => {
      try {
        /*
          data = {
            roomId      : "room_123",
            senderId    : "userId1",
            receiverId  : "userId2",
            message     : "Hello doctor!",
            fileUrl     : null,
            fileType    : "none",
            bookingType : "doctor"
          }
        */

        // MongoDB mein save karo
        const savedMessage = await chatService.saveMessage(data);

        // Dono users ko message bhejo (sender + receiver)
        io.to(data.roomId).emit("newMessage", savedMessage);

        console.log(`💬 Message saved & sent in room: ${data.roomId}`);
      } catch (error) {
        // Sirf us socket ko error bhejo
        socket.emit("messageError", { error: error.message });
        console.error("Message error:", error.message);
      }
    });

    // ─────────────────────────────────────────
    // 3. TYPING INDICATOR - "typing..." dikhana
    // ─────────────────────────────────────────
    socket.on("typing", ({ roomId, userId }) => {
      // Sirf dusre user ko dikhao (sender ko nahi)
      socket.to(roomId).emit("userTyping", { userId });
    });

    socket.on("stopTyping", ({ roomId, userId }) => {
      socket.to(roomId).emit("userStoppedTyping", { userId });
    });

    // ─────────────────────────────────────────
    // 4. READ RECEIPT - Blue tick
    // ─────────────────────────────────────────
    socket.on("markRead", async ({ roomId, receiverId }) => {
      try {
        await chatService.markAsRead(roomId, receiverId);

        // Sender ko batao ke message read ho gaya (blue tick)
        socket.to(roomId).emit("messagesRead", { roomId });
      } catch (error) {
        console.error("markRead error:", error.message);
      }
    });

    // ─────────────────────────────────────────
    // 5. DISCONNECT - Jab user chat band kare
    // ─────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Kisi bhi file se io use karne ke liye
const getIO = () => {
  if (!io) throw new Error("Socket.io initialize nahi hua!");
  return io;
};

module.exports = { initSocket, getIO };