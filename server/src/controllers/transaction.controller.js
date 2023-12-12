const catchAsync = require('../utils/catchAsync');
const transactionService = require('../services/transaction.service');
const path = require('path');
const fs = require('fs');

// get Transactions
const getTransactions = catchAsync(async (req, res) => {
  const { page } = req.query;
  const { transactions, totalCount } = await transactionService.getTransactions(req.body, page);
  const limit = 10;
  const totalPages = Math.floor((totalCount + limit - 1) / limit);
  res.status(200).json({
    data: {
      totalCount,
      totalPages,
      transactions,
    },
  });
});

// get transaction by TxnId
const getTransactionByTXnId = catchAsync(async (req, res, next) => {
  const laneTransId = req.params.id;
  const transaction = await transactionService.getTransactionByTXnId(laneTransId);
  res.status(201).json({
    data: {
      transaction,
    },
  });
});



// Filter for Reports
const filterTmsReport = catchAsync(async (req, res, next) => {
  const { page } = req.params;
  const filterBody = req.body;
  const filterReport = await transactionService.tmsFillterReport(filterBody, page);
  return res.status(200).json({
    data: filterReport.data,
    totalCount: filterReport.totalCount
  });
});

// Get All Payment Type
const getAllPaymentType = catchAsync(async (req, res, next) => {
  const allPaymentType = await transactionService.getAllPaymentType();
  res.status(201).json({
    status: 'success',
    data: {
      allPaymentType,
    },
  });
});

// Get All subPayment Type
const getAllPaymentSubType = catchAsync(async (req, res, next) => {
  const allPaymentSubType = await transactionService.getAllPaymentSubType();
  res.status(201).json({
    status: 'success',
    data: {
      allPaymentSubType,
    },
  });
});



// Get All Payment Type
const getAllVehicleClass = catchAsync(async (req, res, next) => {
  const vehicleClass = await transactionService.getAllVehicleClass();
  res.status(201).json({
    status: 'success',
    data: {
      vehicleClass,
    },
  });
});






module.exports = {
  getAllVehicleClass,
  getTransactions,
  getTransactionByTXnId,
  filterTmsReport,
  getAllPaymentType,
  getAllPaymentSubType
};
