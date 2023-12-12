const catchAsync = require('../utils/catchAsync');
const reportService = require('../services/report.service');

// Generate  Reports
const generateReports = catchAsync(async (req, res, next) => {
  const filterBody = req.body;
  await reportService.generateReports(filterBody);
  return res.status(200).json({
    data: true,
  });
});

const getAllReports = catchAsync(async (req, res) => {
  const allReports = await reportService.getAllReports();
  res.status(200).json({
    data: allReports,
  });
});



//get All Type Of Count Using This Controller
const getTransactionCount = catchAsync(async (req, res, next) => {
  const { reportType } = req.body;
  let data = null
  if (reportType === "PaymentType-Wise") {
    data = await reportService.getTransactionCount(req.body);
  }
  else if (reportType === "LaneAndDate-Wise") {
    data = await reportService.getCountLaneAndDateWise(req.body);
  }
  else {
    data = await reportService.getCountClassWiseAndDateWise(req.body);
  }

  res.status(200).json({
    status: 'sucess',
    data: data,
  });
});


const deleteFile = catchAsync(async (req, res) => {
  const allReports = await reportService.deleteFile();
  res.status(200).json({
    data: allReports,
  });
});
module.exports = {
  generateReports,
  getAllReports,
  getTransactionCount,
  deleteFile
};
