const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const validate = require('../middlewares/validate');
const roleValidation = require('../validations/role.validation');

// create role
router.post('/createRole', validate(roleValidation.createRole), roleController.createRole);
// get role
router.get('/getRoles', roleController.getRoles);
// get role by Id
router.get('/getRoleById/:id', roleController.getRoleById);
// update role
router.patch('/updateRole/:id', roleController.updateRole);
// delete role
router.delete('/deleteRole/:id', roleController.deleteRole);
// get Permission role Id
router.get('/getPermissionByRoleId/:id', roleController.getPermissionByRoleId);
// get all modules and sub_modules
router.get('/getAllModulesAndSubmodules', roleController.getAllModulesAndSubmodules);

module.exports = router;
