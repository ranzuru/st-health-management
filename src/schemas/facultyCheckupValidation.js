import * as yup from "yup";

export const facultyCheckupValidation = yup.object().shape({
  dateOfExamination: yup.date().required("Date of Examination is required"),
  employeeId: yup.string(),
  schoolYear: yup.string().required("School Year is required"),
  weightKg: yup
    .number()
    .positive("Weight must be positive")
    .required("Weight is required"),
  heightCm: yup
    .number()
    .positive("Height must be positive")
    .required("Height is required"),
  temperature: yup
    .number()
    .positive("Temperature must be positive")
    .required("Temperature is required"),
  bloodPressure: yup
    .string()
    .matches(/^\d{2,3}\/\d{2,3}$/, {
      message: "Invalid blood pressure format",
      excludeEmptyString: true,
    })
    .required("Blood Pressure is required"),
  heartRate: yup
    .number()
    .positive("Heart rate must be positive")
    .required("Heart rate is required"),
  pulseRate: yup
    .number()
    .positive("Pulse rate must be positive")
    .required("Pulse rate is required"),
  respiratoryRate: yup
    .number()
    .positive("Respiratory rate must be positive")
    .required("Respiratory rate is required"),
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
  remarks: yup.string().notRequired(),
});
