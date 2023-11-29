const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
// Create user
router.post('/createNewUser', validate(userValidation.createUser), userController.createNewUser);
// get users
router.get('/getUsers', userController.getUsers);
// get user by ID
router.get('/getUserById/:id', userController.getUserById);
// update user
router.patch('/updateUser/:id', userController.updateUser);
// delete user;
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;
