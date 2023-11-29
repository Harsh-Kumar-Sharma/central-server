const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email().allow(''),
    mobile_number: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    role_id: Joi.number().required(),
    shift_id: Joi.number().required(),
  }),
};

module.exports = {
  createUser,
};
