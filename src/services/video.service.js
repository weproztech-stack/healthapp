const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const axios = require("axios");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// ─────────────────────────────────────────
// 1. GENERATE RTC TOKEN - Doctor & Patient
// ─────────────────────────────────────────
const generateToken = (channelName, userId, role = "audience") => {
  if (!APP_ID || !APP_CERTIFICATE) {
    console.warn(" Agora not configured");
    return null;
  }

  const agoraRole = role === "host" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const expiryTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    userId,
    agoraRole,
    expiryTime
  );

  return token;
};

// ─────────────────────────────────────────
// 2. CREATE ROOM - Booking se room banao
// ─────────────────────────────────────────
const createRoom = (bookingId, doctorId, patientId) => {
  if (!APP_ID) {
    console.warn(" Agora not configured");
    return null;
  }

  const channelName = `call_${bookingId}`;

  // Doctor token (host - publish + subscribe)
  const doctorToken = generateToken(channelName, doctorId, "host");

  // Patient token (host - publish + subscribe)
  const patientToken = generateToken(channelName, patientId, "host");

  return {
    appId: APP_ID,
    channelName,
    doctorToken,
    patientToken,
    expiresIn: 3600, // seconds
    createdAt: new Date(),
  };
};

// ─────────────────────────────────────────
// 3. VALIDATE TOKEN - Expired check
// ─────────────────────────────────────────
const isTokenValid = (createdAt) => {
  const now = new Date();
  const diffSeconds = (now - new Date(createdAt)) / 1000;
  return diffSeconds < 3600; // 1 hour valid
};

// ─────────────────────────────────────────
// 4. REFRESH TOKEN - Token expire hone par
// ─────────────────────────────────────────
const refreshToken = (channelName, userId, role = "host") => {
  if (!APP_ID || !APP_CERTIFICATE) return null;

  const newToken = generateToken(channelName, userId, role);

  return {
    token: newToken,
    channelName,
    refreshedAt: new Date(),
    expiresIn: 3600,
  };
};

// ─────────────────────────────────────────
// 5. END CALL - Call end record karna
// ─────────────────────────────────────────
const endCall = (channelName, startTime) => {
  const endTime = new Date();
  const durationSeconds = startTime
    ? Math.floor((endTime - new Date(startTime)) / 1000)
    : 0;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return {
    channelName,
    endTime,
    durationSeconds,
    durationFormatted: `${minutes}m ${seconds}s`,
  };
};

// ─────────────────────────────────────────
// 6. CLOUD RECORDING - Start
// ─────────────────────────────────────────
const startRecording = async (channelName, uid, token) => {
  try {
    if (!APP_ID || !process.env.AGORA_CUSTOMER_ID || !process.env.AGORA_CUSTOMER_SECRET) {
      console.warn(" Agora Recording not configured");
      return null;
    }

    const credentials = Buffer.from(
      `${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`
    ).toString("base64");

    // Step 1 - Acquire resource
    const acquireRes = await axios.post(
      `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/acquire`,
      {
        cname: channelName,
        uid: uid.toString(),
        clientRequest: { resourceExpiredHour: 24 },
      },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resourceId = acquireRes.data.resourceId;

    // Step 2 - Start recording
    const startRes = await axios.post(
      `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`,
      {
        cname: channelName,
        uid: uid.toString(),
        clientRequest: {
          token,
          recordingConfig: {
            maxIdleTime: 30,
            streamTypes: 2, // Audio + Video
            channelType: 0,
            videoStreamType: 0,
            transcodingConfig: {
              height: 720,
              width: 1280,
              bitrate: 1500,
              fps: 24,
            },
          },
          storageConfig: {
            vendor: 1, // AWS S3
            region: 0,
            bucket: process.env.AWS_S3_BUCKET,
            accessKey: process.env.AWS_ACCESS_KEY,
            secretKey: process.env.AWS_SECRET_KEY,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      resourceId,
      sid: startRes.data.sid,
      channelName,
      startedAt: new Date(),
    };
  } catch (error) {
    console.error("Recording start error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────
// 7. CLOUD RECORDING - Stop
// ─────────────────────────────────────────
const stopRecording = async (channelName, uid, resourceId, sid) => {
  try {
    if (!APP_ID || !process.env.AGORA_CUSTOMER_ID) return null;

    const credentials = Buffer.from(
      `${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`
    ).toString("base64");

    const stopRes = await axios.post(
      `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`,
      {
        cname: channelName,
        uid: uid.toString(),
        clientRequest: {},
      },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      fileList: stopRes.data.serverResponse?.fileList || [],
      stoppedAt: new Date(),
    };
  } catch (error) {
    console.error(" Recording stop error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────
// 8. WAITING ROOM CHECK - Doctor online hai?
// ─────────────────────────────────────────
const getCallStatus = (channelName, activeRooms) => {
  const room = activeRooms?.[channelName];
  return {
    channelName,
    isActive: !!room,
    doctorJoined: room?.doctorJoined || false,
    patientJoined: room?.patientJoined || false,
    startTime: room?.startTime || null,
  };
};

module.exports = {
  createRoom,
  generateToken,
  refreshToken,
  isTokenValid,
  endCall,
  startRecording,
  stopRecording,
  getCallStatus,
};