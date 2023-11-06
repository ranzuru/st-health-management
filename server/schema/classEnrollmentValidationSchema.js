const Joi = require("joi");

const enrollmentValidationSchema = Joi.object({
  lrn: Joi.string().required(),
  grade: Joi.string().required(),
  section: Joi.string().required(),
  schoolYear: Joi.string().required(),
});

const headerMappings = {
  LRN: "lrn",
  Grade: "grade",
  Section: "section",
  "School Year": "schoolYear",
};

const mapHeaderToSchemaKey = (header) => {
  return headerMappings[header] || header;
};

module.exports = {
  enrollmentValidationSchema,
  mapHeaderToSchemaKey,
};
