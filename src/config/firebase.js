const admin = require("firebase-admin");

if (!admin.apps.length) {
  // Sir se JSON milne tak placeholder
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    console.warn("  Firebase not configured yet - notifications disabled");
  }
}

module.exports = admin;