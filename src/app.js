const express = require("express");
const cors = require("cors");

const app = express();

/*
========================================
MIDDLEWARE
========================================
*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function safeRequire(path, name) {
  try {
    const mod = require(path);

    if (typeof mod !== "function") {
      if (mod && typeof mod.router === "function") {
        console.log(` ${name}: extracted .router`);
        return mod.router;
      }
      if (mod && typeof mod.default === "function") {
        console.log(` ${name}: extracted .default`);
        return mod.default;
      }
      console.error(
        `${name} did not export a function (got ${typeof mod}). Check module.exports in ${path}`
      );
      return null;
    }

    console.log(` ${name}: loaded successfully`);
    return mod;
  } catch (err) {
    console.error(` ERROR loading ${name}:`, err.message);
    return null;
  }
}

/*
========================================
IMPORT ROUTES WITH DEBUG
========================================
*/
const dashboardRoutes   = safeRequire("./dashboard/dashboard.routes.js", "dashboardRoutes");
const authRoutes        = safeRequire("./routes/auth.routes.js",         "authRoutes");
const userRoutes        = safeRequire("./routes/user.routes.js",         "userRoutes");
const pharmacyRoutes    = safeRequire("./routes/pharmacy.routes.js",     "pharmacyRoutes");
const profileRoutes     = safeRequire("./routes/profile.routes.js",      "profileRoutes");
const paymentRoutes     = safeRequire("./routes/payment.routes.js",      "paymentRoutes");
const supportRoutes     = safeRequire("./routes/support.routes.js",      "supportRoutes");
const appointmentRoutes = safeRequire("./routes/appointment.routes.js",  "appointmentRoutes");
const reportRoutes      = safeRequire("./routes/report.routes.js",       "reportRoutes");

// ✅ Module 2 — Doctor Routes
const doctorRoutes      = safeRequire("./routes/doctor.routes.js",       "doctorRoutes");

/*
========================================
REGISTER ROUTES SAFELY
========================================
*/
if (dashboardRoutes)   app.use("/api/dashboard",    dashboardRoutes);
if (authRoutes)        app.use("/api/auth",          authRoutes);
if (userRoutes)        app.use("/api/user",          userRoutes);
if (pharmacyRoutes)    app.use("/api/pharmacy",      pharmacyRoutes);
if (profileRoutes)     app.use("/api/profile",       profileRoutes);
if (paymentRoutes)     app.use("/api/payments",      paymentRoutes);
if (supportRoutes)     app.use("/api/support",       supportRoutes);
if (appointmentRoutes) app.use("/api/appointments",  appointmentRoutes);
if (reportRoutes)      app.use("/api/reports",       reportRoutes);

// ✅ Module 2 — Doctor
if (doctorRoutes)      app.use("/api/dr",            doctorRoutes);

/*
========================================
BASE ROUTE
========================================
*/
app.get("/", (req, res) => {
  res.json({ message: "Healthcare Backend Running - NEW VERSION CHECK" });
});

/*
========================================
404 HANDLER
========================================
*/
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
========================================
GLOBAL ERROR HANDLER
========================================
*/
app.use((err, req, res, next) => {
  console.error(" Global Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;