const catchAsync = require('../utils/catchAsync');
const commonService = require('../services/common.service');

const getAllMaster = catchAsync(async (req, res, next) => {
  const masterData = await commonService.getAllMaster();
  res.status(200).json({
    status: 'success',
    data: masterData,
  });
});

module.exports = {
  getAllMaster,
};
