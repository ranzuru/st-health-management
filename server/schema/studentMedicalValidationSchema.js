const Joi = require("joi");

const medicalCheckupValidationSchema = Joi.object({
  dateOfExamination: Joi.date().required(),
  lrn: Joi.string(),
  temperature: Joi.number().required(),
  bloodPressure: Joi.string().required(),
  heartRate: Joi.number().required(),
  pulseRate: Joi.number().required(),
  respiratoryRate: Joi.number().required(),
  visionScreeningLeft: Joi.string().required(),
  visionScreeningRight: Joi.string().required(),
  auditoryScreeningLeft: Joi.string().required(),
  auditoryScreeningRight: Joi.string().required(),
  skinScreening: Joi.string().required(),
  scalpScreening: Joi.string().required(),
  eyesScreening: Joi.string().required(),
  earScreening: Joi.string().required(),
  noseScreening: Joi.string().required(),
  mouthScreening: Joi.string().required(),
  throatScreening: Joi.string().required(),
  neckScreening: Joi.string().required(),
  lungScreening: Joi.string().required(),
  heartScreening: Joi.string().required(),
  abdomen: Joi.string().required(),
  deformities: Joi.string().required(),
  ironSupplementation: Joi.boolean().required(),
  deworming: Joi.boolean().required(),
  menarche: Joi.string().allow("", null),
  remarks: Joi.string().allow("", null),
});

const columnHeadersToSchemaKeys = {
  "Date of Examination": "dateOfExamination",
  LRN: "lrn",
  Temperature: "temperature",
  "Blood Pressure": "bloodPressure",
  "Heart Rate": "heartRate",
  "Pulse Rate": "pulseRate",
  "Respiratory Rate": "respiratoryRate",
  "Vision Screening Left": "visionScreeningLeft",
  "Vision Screening Right": "visionScreeningRight",
  "Auditory Screening Left": "auditoryScreeningLeft",
  "Auditory Screening Right": "auditoryScreeningRight",
  "Skin Screening": "skinScreening",
  "Scalp Screening": "scalpScreening",
  "Eyes Screening": "eyesScreening",
  "Ear Screening": "earScreening",
  "Nose Screening": "noseScreening",
  "Mouth Screening": "mouthScreening",
  "Throat Screening": "throatScreening",
  "Neck Screening": "neckScreening",
  "Lung Screening": "lungScreening",
  "Heart Screening": "heartScreening",
  Abdomen: "abdomen",
  Deformities: "deformities",
  "Iron Supplementation": "ironSupplementation",
  Deworming: "deworming",
  Menarche: "menarche",
  Remarks: "remarks",
};

const mapHeaderToSchemaKey = (header) => {
  const normalizedHeader = header.trim();
  return columnHeadersToSchemaKeys[normalizedHeader] || header;
};

module.exports = {
  medicalCheckupValidationSchema,
  mapHeaderToSchemaKey,
};
