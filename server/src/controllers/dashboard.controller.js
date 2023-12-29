const catchAsync = require('../utils/catchAsync');
const dashboardService = require('../services/dashboard.service');
const { duration } = require('moment-timezone');

const getAllStatistics = catchAsync(async (req, res, next) => {
  const plazaWiseCountExit = await dashboardService.plazaWiseCountExit(req.body);
  const plazaWiseCountEntry = await dashboardService.plazaWiseCountEntry(req.body);
  const plazaWiseCount = await dashboardService.plazaWiseCount(req.body);
  const merageTransaction = await dashboardService.merageTransaction(req.body);
  const merageTransactionVehicle = await dashboardService.merageTransactionVehicle(req.body);
  const apiFetchStatus = await dashboardService.apiFetchStatus();
  const getRevenueData = await dashboardService.getRevenueData(req.body);
  return res.status(200).json({
    status: 'success',
    plazaWiseCountEntry: plazaWiseCountEntry,
    plazaWiseCountExit: plazaWiseCountExit,
    plazaWiseCount: plazaWiseCount,
    merageTransaction: merageTransaction,
    merageTransactionVehicle: merageTransactionVehicle,
    apiFetchStatus: apiFetchStatus,
    getRevenueData: getRevenueData
  });
});
module.exports = {
  getAllStatistics
}