const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.post('/generateReports', reportController.generateReports);
router.get('/getAllReports', reportController.getAllReports);
router.post('/getTransactionCount', reportController.getTransactionCount);
router.post('/getRevenueTransaction', reportController.getRevenueTransaction);
router.post('/getAvcTransactionCount', reportController.getAvcTransaction);
router.get('/deleteFile', reportController.deleteFile);
module.exports = router;
