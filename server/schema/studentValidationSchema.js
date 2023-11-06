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

const studentHeaderMappings = {
  LRN: "lrn",
  "Last Name": "lastName",
  "First Name": "firstName",
  "Middle Name": "middleName",
  "Name Extension": "nameExtension",
  Gender: "gender",
  "Birth Date": "birthDate",
  Age: "age",
  "Is 4P's Beneficiary": "is4p",
  "Parent 1 Name": "parentName1",
  "Parent 1 Contact": "parentContact1",
  "Parent 2 Name": "parentName2",
  "Parent 2 Contact": "parentContact2",
  Address: "address",
};

const mapHeaderToSchemaKey = (header) => {
  const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
  return studentHeaderMappings[normalizedHeader] || header;
};

module.exports = {
  studentValidationSchema,
  mapHeaderToSchemaKey,
};
