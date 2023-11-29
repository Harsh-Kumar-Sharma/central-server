const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service.js');

// Create New User
const createNewUser = catchAsync(async (req, res) => {
  const users = await userService.CreateNewUser(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// get all users
const getUsers = catchAsync(async (req, res) => {
  const { page } = req.query;
  const getusers = await userService.getUsers(page);
  res.status(201).json({
    status: 'success',
    data: {
      getusers,
    },
  });
});

// get user by Id
const getUserById = catchAsync(async (req, res) => {
  const getuserbyid = await userService.getUserById(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      getuserbyid,
    },
  });
});

// update user
const updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// delete User
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await userService.deleteUser(userId);
  res.status(201).json({
    status: 'success',
    data: {
      user: deletedUser,
    },
  });
});

module.exports = {
  createNewUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
