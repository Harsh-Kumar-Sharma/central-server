const express = require('express');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// login API
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);

// Restricted APIS
router.post('/session', auth('auth'), (req, res) => res.send(true));
module.exports = router;
