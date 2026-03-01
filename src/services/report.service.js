const Report = require("../models/report.model");
const User = require("../models/user.model");

/*
========================================
UPLOAD REPORT (Lab uploads)
========================================
*/
exports.createReport = async (identifier, data) => {

  const { title, fileUrl, labName, notes } = data;

  if (!title || !fileUrl || !labName) {
    throw new Error("title, fileUrl and labName are required");
  }

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const report = await Report.create({
    user: user._id,
    title,
    fileUrl,
    labName,
    notes: notes || null,
  });

  return report;
};


/*
========================================
GET USER REPORTS
========================================
*/
exports.getUserReports = async (identifier) => {

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const reports = await Report.find({ user: user._id })
    .sort({ createdAt: -1 });

  return reports;
};