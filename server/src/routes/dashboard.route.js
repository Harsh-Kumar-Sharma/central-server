const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller')

router.post('/getAllStatistics', dashboardController.getAllStatistics);

module.exports = router;