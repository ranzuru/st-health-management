import * as yup from "yup";

export const medicalCheckupValidation = yup.object().shape({
  dateOfExamination: yup.date().required("Date of Examination is required"),
  lrn: yup.string(),
  temperature: yup.string().required("Temperature is required"),
  bloodPressure: yup.string().required("Blood Pressure is required"),
  heartRate: yup.number().required("Heart Rate is required"),
  pulseRate: yup.number().required("Pulse Rate is required"),
  respiratoryRate: yup.number().required("Respiratory Rate is required"),
  visionScreeningLeft: yup
    .string()
    .required("Vision Screening Left is required"),
  visionScreeningRight: yup
    .string()
    .required("Vision Screening Right is required"),
  auditoryScreeningLeft: yup
    .string()
    .required("Auditory Screening Left is required"),
  auditoryScreeningRight: yup
    .string()
    .required("Auditory Screening Right is required"),
  skinScreening: yup.string().required("Skin Screening is required"),
  scalpScreening: yup.string().required("Scalp Screening is required"),
  eyesScreening: yup.string().required("Eyes Screening is required"),
  earScreening: yup.string().required("Ear Screening is required"),
  noseScreening: yup.string().required("Nose Screening is required"),
  mouthScreening: yup.string().required("Mouth Screening is required"),
  throatScreening: yup.string().required("Throat Screening is required"),
  neckScreening: yup.string().required("Neck Screening is required"),
  lungScreening: yup.string().required("Lung Screening is required"),
  heartScreening: yup.string().required("Heart Screening is required"),
  abdomen: yup.string().required("Abdomen is required"),
  deformities: yup.string().required("Deformities is required"),
  ironSupplementation: yup
    .boolean()
    .required("Iron Supplementation is required"),
  deworming: yup.boolean().required("Deworming is required"),
  menarche: yup.string().nullable(true).notRequired(),
  remarks: yup.string().nullable(true).notRequired(),
});
