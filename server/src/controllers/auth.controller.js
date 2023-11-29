const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const roleService = require('../services/role.service');

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.validateLogin({ username, password });

  const rolePermissions = await roleService.getPermissionByRoleId(user.role_id);

  const authTokens = await tokenService.generateAuthTokens(user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        ...user,
        permissions: rolePermissions,
      },
      tokens: authTokens,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  const { id } = req.body;
  await authService.logoutUser(id);
  res.sendStatus(httpStatus.OK);
});

module.exports = {
  login,
  logout,
};
