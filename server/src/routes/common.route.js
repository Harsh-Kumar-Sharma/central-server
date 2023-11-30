const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.controller');
const auth = require('../middlewares/auth');

router.get('/getAllMaster', auth('auth'), commonController.getAllMaster);

module.exports = router;
