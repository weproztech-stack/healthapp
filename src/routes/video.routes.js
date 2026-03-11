const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const videoController = require("../controllers/video.controller");

router.post("/room", protect, videoController.createRoom);
router.post("/token/refresh", protect, videoController.refreshToken);
router.post("/end", protect, videoController.endCall);
router.post("/recording/start", protect, videoController.startRecording);
router.post("/recording/stop", protect, videoController.stopRecording);

module.exports = router;