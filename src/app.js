
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function safeRequire(path, name) {
  try {
    const mod = require(path);
    if (typeof mod !== "function") {
      if (mod && typeof mod.router === "function") return mod.router;
      if (mod && typeof mod.default === "function") return mod.default;
      console.error(`${name} did not export a function`);
      return null;
    }
    console.log(`${name}: loaded successfully`);
    return mod;
  } catch (err) {
    console.error(`ERROR loading ${name}:`, err.message);
    return null;
  }
}

const dashboardRoutes   = safeRequire("./dashboard/dashboard.routes.js", "dashboardRoutes");
const authRoutes        = safeRequire("./routes/auth.routes.js",         "authRoutes");
const userRoutes        = safeRequire("./routes/user.routes.js",         "userRoutes");
const pharmacyRoutes    = safeRequire("./routes/pharmacy.routes.js",     "pharmacyRoutes");
const profileRoutes     = safeRequire("./routes/profile.routes.js",      "profileRoutes");
const paymentRoutes     = safeRequire("./routes/payment.routes.js",      "paymentRoutes");
const supportRoutes     = safeRequire("./routes/support.routes.js",      "supportRoutes");
const appointmentRoutes = safeRequire("./routes/appointment.routes.js",  "appointmentRoutes");
const reportRoutes      = safeRequire("./routes/report.routes.js",       "reportRoutes");
const doctorRoutes      = safeRequire("./routes/doctor.routes.js",       "doctorRoutes");
const physioRoutes      = safeRequire("./routes/physio.routes.js",       "physioRoutes");
const labRoutes         = safeRequire("./routes/lab.routes.js",          "labRoutes");
const adminRoutes       = safeRequire("./routes/admin.routes.js",        "adminRoutes");
const chatRoutes        = safeRequire("./routes/chat.routes.js",         "chatRoutes"); // ✅ NAYA

if (dashboardRoutes)   app.use("/api/dashboard",    dashboardRoutes);
if (authRoutes)        app.use("/api/auth",          authRoutes);
if (userRoutes)        app.use("/api/user",          userRoutes);
if (pharmacyRoutes)    app.use("/api/pharmacy",      pharmacyRoutes);
if (profileRoutes)     app.use("/api/profile",       profileRoutes);
if (paymentRoutes)     app.use("/api/payments",      paymentRoutes);
if (supportRoutes)     app.use("/api/support",       supportRoutes);
if (appointmentRoutes) app.use("/api/appointments",  appointmentRoutes);
if (reportRoutes)      app.use("/api/reports",       reportRoutes);
if (doctorRoutes)      app.use("/api/dr",            doctorRoutes);
if (physioRoutes)      app.use("/api/physio",        physioRoutes);
if (labRoutes)         app.use("/api/lab",           labRoutes);
if (adminRoutes)       app.use("/api/admin",         adminRoutes);
if (chatRoutes)        app.use("/api/chat",          chatRoutes); // ✅ NAYA

app.get("/", (req, res) => {
  res.json({ message: "Healthcare Backend Running" });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;