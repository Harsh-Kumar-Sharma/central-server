const Joi = require('@hapi/joi');

const createRole = {
  body: Joi.object().keys({
    role_name: Joi.string().required(),
    modules: Joi.array().required()
    // .items(
    //   Joi.object().keys({
    //     module_id: Joi.number().integer().required(),
    //     module_permission: Joi.string().valid('R', 'RW').optional(),
    //     sub_modules: Joi.array()
    //       .items(
    //         Joi.object().keys({
    //           sub_module_id: Joi.number().integer().optional(),
    //           sub_module_permission: Joi.string().valid('R', 'RW').optional(),
    //         })
    //       )
    //       .default([]),
    //   })
    // ),
  }),
};

module.exports = {
  createRole,
};
