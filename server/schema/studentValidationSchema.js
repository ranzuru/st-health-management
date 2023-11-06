const Joi = require("joi");

const studentValidationSchema = Joi.object({
  lrn: Joi.string().required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  middleName: Joi.string().allow("", null),
  nameExtension: Joi.string().allow("", null),
  gender: Joi.string().required(),
  birthDate: Joi.date().required(),
  age: Joi.number().integer().required(),
  is4p: Joi.boolean().required(),
  parentName1: Joi.string().required(),
  parentContact1: Joi.number().integer().required(),
  parentName2: Joi.string().allow("", null),
  parentContact2: Joi.number().integer().allow(null),
  address: Joi.string().required(),
});
module.exports = studentValidationSchema;
