const catchAsync = require('../utils/catchAsync');
const roleService = require('../services/role.service');

//  create Role
const createRole = catchAsync(async (req, res, next) => {
  const role = await roleService.createRole(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      role,
    },
  });
});

// get roles
const getRoles = catchAsync(async (req, res, next) => {
  const allroles = await roleService.getRoles();
  res.status(201).json({
    status: 'success',
    data: {
      allroles,
    },
  });
});

// get role by id
const getRoleById = catchAsync(async (req, res, next) => {
  const roleById = await roleService.getRoleById(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      roleById,
    },
  });
});

//update role
const updateRole = catchAsync(async (req, res, next) => {
  const updatedRole = await roleService.updateRole(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      role: updatedRole,
    },
  });
});

// delete role
const deleteRole = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;
  const deletedRole = await roleService.deleteRole(roleId);
  res.status(200).json({
    status: 'success',
    data: {
      role: deletedRole,
    },
  });
});

const getPermissionByRoleId = catchAsync(async (req, res, next) => {
  const permissionRole = await roleService.getPermissionByRoleId(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      permissions: permissionRole,
    },
  });
});

const getAllModulesAndSubmodules = catchAsync(async (req, res, next) => {
  const getModulesandSubmodules = await roleService.getAllModulesAndSubmodules();
  res.status(200).json({
    status: 'success',
    data: {
      getModulesandSubmodules,
    },
  });
});
module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getPermissionByRoleId,
  getAllModulesAndSubmodules,
};
