const Joi = require('@hapi/joi');

const filterObject = {
  body: Joi.object({
    fromDate: Joi.string().allow(''),
    toDate: Joi.string().allow(''),
    tagId: Joi.string().allow(''), // Allow empty string
    transactionId: Joi.string().allow(''), // Allow empty string
    plateNumber: Joi.string().allow(''),
    lane: Joi.string().allow(''),
    laneType: Joi.string().allow('All'),
    abnormality: Joi.string().allow('').allow('All'),
    paymentType: Joi.string().allow('').allow('All'),
    vehicleClass: Joi.number().allow('All'),
    avcClass: Joi.string().allow('').allow('All'),
    operater: Joi.string().allow('').allow('All'),
    paymentSubType: Joi.string().allow('All'),
    plazaCode: Joi.string()
  }),
};
const filterReportObject = {
  body: Joi.object({
    reportsId: Joi.array().items(Joi.number().integer().min(1)).required(),
    fromDate: Joi.string().required(),
    toDate: Joi.string().required(),
    duration: Joi.string(),
    tagId: Joi.string().allow(''), // Allow empty string
    transactionId: Joi.string().allow(''), // Allow empty string
    plateNumber: Joi.string().allow(''),
    lane: Joi.string().allow(''),
    laneType: Joi.string().allow('').allow('All'),
    abnormality: Joi.string().allow('').allow('All'),
    paymentType: Joi.string().allow('').allow('All'),
    vehicleClass: Joi.number().allow('All'),
    avcClass: Joi.string().allow('').allow('All'),
    operater: Joi.string().allow('').allow('All'),
    paymentSubType: Joi.string().allow('').allow('All'),
    loginUser: Joi.string().required(),
    collecterID: Joi.string(),
    shift: Joi.string(),
    cashierID: Joi.string(),
    plazaCode: Joi.string()
  }),
};

module.exports = {
  filterObject,
  filterReportObject,
};
