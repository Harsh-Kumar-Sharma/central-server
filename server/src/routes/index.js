const express = require('express');
const roleRoute = require('./role.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const report = require('./report.route');
const common = require('./common.route');
const dashboard = require('./dashboard.route')
const transaction = require('./transaction.route')


const router = express.Router();

router.use('/roles', roleRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/report', report);
router.use('/common', common);
router.use('/dashboard', dashboard);
router.use('/transaction', transaction);

module.exports = router;
