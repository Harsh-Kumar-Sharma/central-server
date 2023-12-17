const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const validate = require('../middlewares/validate');
const transactionValidation = require('../validations/transaction.validation');

router.post('/getTransactions', validate(transactionValidation.filterObject), transactionController.getTransactions);
router.get('/getTransactionByTxnId/:id', transactionController.getTransactionByTXnId);
router.post('/tmsFilterReport/:page', validate(transactionValidation.filterObject), transactionController.filterTmsReport);
router.get('/getAllPaymentType', transactionController.getAllPaymentType);
router.get('/getAllPaymentSubType', transactionController.getAllPaymentSubType);
router.get('/getVehicleClass', transactionController.getAllVehicleClass);
router.post('/GetFilterMasterData/:page', transactionController.getMasterData)


module.exports = router;
