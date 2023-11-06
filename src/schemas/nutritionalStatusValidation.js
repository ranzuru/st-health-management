import * as Yup from "yup";

export const nutritionalStatusValidationSchema = Yup.object().shape({
  dateMeasured: Yup.date().required("Date measured is required"),
  weightKg: Yup.number()
    .transform((value, originalValue) =>
      isNaN(originalValue) || originalValue === "" ? null : value
    )
    .positive("Weight must be positive")
    .max(150, "Weight cannot be more than 150 kg")
    .test("is-null", "Weight is required", (value) => value !== null),
  heightCm: Yup.number()
    .transform((value, originalValue) =>
      isNaN(originalValue) || originalValue === "" ? null : value
    )
    .positive("Height must be positive")
    .max(250, "Height cannot be more than 250 cm")
    .test("is-null", "Height is required", (value) => value !== null),
  BMI: Yup.number()
    .transform((value, originalValue) =>
      isNaN(originalValue) || originalValue === "" ? null : value
    )
    .positive("BMI must be positive")
    .test("is-null", "BMI is required", (value) => value !== null),
  BMIClassification: Yup.string()
    .required("BMI Classification is required")
    .oneOf(
      ["Severely Wasted", "Wasted", "Normal", "Overweight", "Obese"],
      "Invalid BMI Classification"
    ),
  heightForAge: Yup.string()
    .required("Height for Age is required")
    .oneOf(
      ["Severely Stunted", "Stunted", "Normal", "Tall"],
      "Invalid Height for Age classification"
    ),
  beneficiaryOfSBFP: Yup.boolean()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Beneficiary of SBFP is required"),
  measurementType: Yup.string().required("Measurement Type is required"),
  remarks: Yup.string().max(500, "Remarks cannot exceed 500 characters"),
});
