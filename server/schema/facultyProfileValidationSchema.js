const Joi = require("joi");

const facultyProfileValidationSchema = Joi.object({
  employeeId: Joi.string().required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  middleName: Joi.string().allow("", null),
  nameExtension: Joi.string().allow("", null),
  gender: Joi.string().required(),
  birthDate: Joi.date().required(),
  age: Joi.number().required(),
  email: Joi.string().required(),
  mobileNumber: Joi.number().required(),
  role: Joi.string().required(),
});

const columnHeadersToSchemaKeys = {
  "Employee ID": "employeeId",
  "Last Name": "lastName",
  "First Name": "firstName",
  "Middle Name": "middleName",
  "Name Extension": "nameExtension",
  Gender: "gender",
  "Birth Date": "birthDate",
  Age: "age",
  Email: "email",
  "Mobile Number": "mobileNumber",
  Role: "role",
};

const mapHeaderToSchemaKey = (header) => {
  const normalizedHeader = header.trim();
  return columnHeadersToSchemaKeys[normalizedHeader] || header;
};

module.exports = {
  facultyProfileValidationSchema,
  mapHeaderToSchemaKey,
};
