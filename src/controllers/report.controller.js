const reportService = require("../services/report.service");

/*

UPLOAD REPORT

*/
exports.uploadReport = async (req, res) => {
  try {
    const identifier = req.user.identifier;

    const report = await reportService.createReport(
      identifier,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      report,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/*

GET MY REPORTS

*/
exports.getMyReports = async (req, res) => {
  try {
    const identifier = req.user.identifier;

    const reports = await reportService.getUserReports(identifier);

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};