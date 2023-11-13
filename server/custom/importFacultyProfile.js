const FacultyProfile = require("../models/FacultyProfileSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");
const {
  facultyProfileValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/facultyProfileValidationSchema");

const importFacultyProfile = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey);

  const profiles = [];
  const errors = [];

  for (let rowData of data) {
    rowData.employeeId = rowData.employeeId.toString();
    if (rowData.nameExtension === "null" || !rowData.nameExtension) {
      rowData.nameExtension = "";
    }

    if (typeof rowData.email === "object" && rowData.email.text) {
      rowData.email = rowData.email.text;
    }

    if ("undefined" in rowData) {
      delete rowData.undefined;
    }
    try {
      // Assume facultyValidationSchema exists and validates faculty profile data
      const { value, error } = facultyProfileValidationSchema.validate(
        rowData,
        {
          abortEarly: false,
        }
      );
      if (error) {
        console.log("Validation error:", error.details);
        throw error;
      }

      const existingProfile = await FacultyProfile.findOne({
        email: value.email,
      });
      if (existingProfile) {
        errors.push({ email: value.email, errors: ["Email already exists"] });
        continue;
      }

      const existingIdProfile = await FacultyProfile.findOne({
        employeeId: value.employeeId,
      });
      if (existingIdProfile) {
        errors.push({
          employeeId: value.employeeId,
          errors: ["Employee ID already exists"],
        });
        continue;
      }

      // All checks passed, proceed to save new faculty profile
      const newProfile = new FacultyProfile(value);
      await newProfile.save();
      profiles.push(newProfile);
    } catch (e) {
      console.error("Error caught during import process:", e);
      errors.push({
        email: rowData.email || "Unknown Email",
        errors: e.details
          ? e.details.map((detail) => detail.message)
          : [e.message],
      });
    }
  }

  // Similar error handling as in importClassEnrollments
  const displayedErrors = errors.slice(0, 5);
  const hasMoreErrors = errors.length > 5;
  return { profiles, errors: displayedErrors, hasMoreErrors };
};

module.exports = importFacultyProfile;
