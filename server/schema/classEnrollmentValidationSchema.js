const Joi = require("joi");

const enrollmentValidationSchema = Joi.object({
  lrn: Joi.string().required().messages({
    "string.base": `"LRN" should be a type of 'text'`,
    "string.empty": `"LRN" cannot be an empty field`,
    "any.required": `"LRN" is a required field`,
  }),
  schoolYear: Joi.string().required().messages({
    "string.base": `"School year" should be a type of 'text'`,
    "string.empty": `"School year" cannot be an empty field`,
    "any.required": `"School year" is a required field`,
  }),
  grade: Joi.string().required().messages({
    "string.base": `"Grade" should be a type of 'text'`,
    "string.empty": `"Grade" cannot be an empty field`,
    "any.required": `"Grade" is a required field`,
  }),
  section: Joi.string().required().messages({
    "string.base": `"Section" should be a type of 'text'`,
    "string.empty": `"Section" cannot be an empty field`,
    "any.required": `"Section" is a required field`,
  }),
});
module.exports = enrollmentValidationSchema;
