const Joi = require("joi");

const dengueValidationSchema = Joi.object({
  lrn: Joi.string().required("LRN is required."),
  dateOfOnset: Joi.date().required("Date of Onset is required."),
  dateOfAdmission: Joi.date().required("Date of Admission is required."),
  hospitalAdmission: Joi.string().required("Hospital Admission is required."),
  dateOfDischarge: Joi.date().required("Date of Discharge is required."),
});

const dengueHeaderMappings = {
  lrn: "lrn",
  "date of onset": "dateOfOnset",
  "date of admission": "dateOfAdmission",
  "hospital admission": "hospitalAdmission",
  "date of discharge": "dateOfDischarge",
};

const mapHeaderToSchemaKey = (header) => {
  const normalizedHeader = header.trim().toLowerCase();
  return dengueHeaderMappings[normalizedHeader] || header;
};

module.exports = {
  dengueValidationSchema,
  mapHeaderToSchemaKey,
};
