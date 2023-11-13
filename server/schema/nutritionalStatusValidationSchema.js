const Joi = require("joi");

const nutritionalStatusValidationSchema = Joi.object({
  dateMeasured: Joi.date().required(),
  lrn: Joi.string().required(),
  weightKg: Joi.number().required(),
  heightCm: Joi.number().required(),
  BMI: Joi.number().required(),
  BMIClassification: Joi.string().required(),
  heightForAge: Joi.string().required(),
  beneficiaryOfSBFP: Joi.boolean().required(),
  measurementType: Joi.string().valid("PRE", "POST").required(),
  remarks: Joi.string().allow("", null), // Allows an empty string or null for optional remarks
});

const columnHeadersToSchemaKeys = {
  "Date Measured": "dateMeasured",
  LRN: "lrn",
  "Weight (kg)": "weightKg",
  "Height (cm)": "heightCm",
  BMI: "BMI",
  "BMI Classification": "BMIClassification",
  "Height for Age": "heightForAge",
  "Beneficiary of SBFP": "beneficiaryOfSBFP",
  "Measurement Type": "measurementType",
  Remarks: "remarks",
};

const mapHeaderToSchemaKey = (header) => {
  const normalizedHeader = header.trim();
  return columnHeadersToSchemaKeys[normalizedHeader] || header;
};

module.exports = {
  nutritionalStatusValidationSchema,
  mapHeaderToSchemaKey,
};
