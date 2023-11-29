const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { TMS_Users } = require('../models');
const { db } = require('../models');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');

// Create User
/**
 * Create a user
 * @param {Object} record
 * @returns {Promise<TMS_Users>}
 */

const CreateNewUser = async (record) => {
  // Pre-validation
  const existsUser = await db.tms_users.findOne({
    where: {
      email: record.email,
    },
  });

  if (existsUser) {
    throw new Error('User already exists with the same email');
  }
  const existsUsername = await db.tms_logins.findOne({
    where: {
      username: record.username,
    },
  });
  if (existsUsername) {
    throw new Error('User already exists with the same username');
  }
  // Create role mapping in TMS_USER_ROLE_MAPPINGS table
  const role = await db.tms_master_roles.findOne({ where: { id: record.role_id } });
  if (role == null) throw new Error('Role does not exists');

  //  create shift mapping in TMS_USER_SHIFT_MAPPINGS table
  const shift = await db.tms_master_shifts.findOne({ where: { id: record.shift_id } });
  if (shift == null) throw new Error('Shift does not exists');

  // Create user in the "users" table
  const userRes = await db.tms_users.create({
    first_name: record.first_name,
    last_name: record.last_name,
    email: record.email,
    mobile_number: record.mobile_number,
    role_id: record.role_id,
    shift_id: record.shift_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const encPassword = await bcrypt.hash(record.password, 8);
  await db.tms_logins.create({
    user_id: userRes.dataValues.id,
    username: record.username,
    password: encPassword,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  await db.tms_user_role_mappings.create({
    user_id: userRes.dataValues.id,
    role_id: role.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  await db.tms_user_shift_mappings.create({
    user_id: userRes.dataValues.id,
    shift_id: shift.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    user: userRes.dataValues,
  };
};

const getUsers = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const getUsers = await db.tms_users.findAll({
    include: [{ model: db.tms_logins }],
    limit,
    offset,
  });
  return getUsers;
};

// get user by Id
const getUserById = async (id) => {
  const user = await db.tms_users.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// update User
const updateUser = async (id, updatedData) => {
  const user = await db.tms_users.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }

  user.first_name = updatedData.first_name;
  user.last_name = updatedData.last_name;
  user.role_id = updatedData.role_id;
  user.shift_id = updatedData.shift_id;
  user.mobile_number = updatedData.mobile_number;
  user.email = updatedData.email;
  user.updated_at = new Date().toISOString();

  // Update logins table
  const login = await db.tms_logins.findOne({ where: { user_id: id } });
  if (login) {
    login.username = updatedData.username;
    login.password = updatedData.password ? await bcrypt.hash(updatedData.password, 8) : login.password;
    login.updated_at = new Date().toISOString();
    await login.save();
  }

  await user.save();
  return user;
};

// delete  User
const deleteUser = async (userId) => {
  const user = await db.tms_users.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Delete the user from tms_users
  await db.tms_users.destroy({ where: { id: userId } });

  // Delete user from tms_logins
  await db.tms_logins.destroy({ where: { user_id: userId } });

  // Delete user from tms_user_role mappings
  await db.tms_user_role_mappings.destroy({ where: { user_id: userId } });

  // Delete user from tms_user_shift_mappings
  await db.tms_user_shift_mappings.destroy({ where: { user_id: userId } });

  return { message: 'User deleted successfully' };
};

module.exports = {
  CreateNewUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
