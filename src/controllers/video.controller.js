const videoService = require("../services/video.service");

// Create Room
const createRoom = async (req, res) => {
  try {
    const { bookingId, doctorId, patientId } = req.body;

    if (!bookingId || !doctorId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "bookingId, doctorId and patientId are required",
      });
    }

    const room = videoService.createRoom(bookingId, doctorId, patientId);

    return res.status(200).json({ success: true, room });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { channelName, userId, role } = req.body;
    const result = videoService.refreshToken(channelName, userId, role);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// End Call
const endCall = async (req, res) => {
  try {
    const { channelName, startTime } = req.body;
    const result = videoService.endCall(channelName, startTime);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Start Recording
const startRecording = async (req, res) => {
  try {
    const { channelName, uid, token } = req.body;
    const result = await videoService.startRecording(channelName, uid, token);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Stop Recording
const stopRecording = async (req, res) => {
  try {
    const { channelName, uid, resourceId, sid } = req.body;
    const result = await videoService.stopRecording(channelName, uid, resourceId, sid);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRoom,
  refreshToken,
  endCall,
  startRecording,
  stopRecording,
};