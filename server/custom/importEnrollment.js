const {
  enrollmentValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/classEnrollmentValidationSchema");
const ClassEnrollment = require("../models/ClassEnrollment");
const StudentProfile = require("../models/StudentProfileSchema");
const ClassProfile = require("../models/ClassProfileSchema");
const AcademicYear = require("../models/AcademicYearSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");
const { capitalizeFirstLetter } = require("../utils/stringHelpers");

const importClassEnrollments = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey);

  const enrollments = [];
  const errors = [];

  for (let rowData of data) {
    rowData.lrn = rowData.lrn.toString();
    rowData.grade = rowData.grade ? capitalizeFirstLetter(rowData.grade) : "";
    rowData.section = rowData.section
      ? capitalizeFirstLetter(rowData.section)
      : "";
    try {
      const { value, error } = enrollmentValidationSchema.validate(rowData, {
        abortEarly: false,
      });
      if (error) throw error;

      const student = await StudentProfile.findOne({ lrn: value.lrn });
      if (!student) {
        errors.push({
          lrn: value.lrn || "Unknown",
          errors: ["LRN does not exist"],
        });
        continue; // Skip to the next iteration
      }

      // Check if class details are valid
      const classDetails = await ClassProfile.findOne({
        grade: value.grade,
        section: value.section,
      });
      if (!classDetails) {
        errors.push({ lrn: value.lrn, errors: ["Invalid grade or section"] });
        continue; // Skip to the next iteration
      }

      // Check if academic year is valid
      const academicDetails = await AcademicYear.findOne({
        schoolYear: value.schoolYear,
      });
      if (!academicDetails) {
        errors.push({ lrn: value.lrn, errors: ["Invalid school year"] });
        continue; // Skip to the next iteration
      }

      // Check for existing enrollment records
      const existingEnrollment = await ClassEnrollment.findOne({
        student: student._id,
        classProfile: classDetails._id,
        academicYear: academicDetails._id,
      });

      if (existingEnrollment) {
        errors.push({
          lrn: value.lrn,
          errors: [
            "This student already has records for the given class and academic year",
          ],
        });
        continue;
      }

      // All checks passed, proceed to save new enrollment
      const newEnrollment = new ClassEnrollment({
        student: student._id,
        classProfile: classDetails._id,
        academicYear: academicDetails._id,
        ...value,
      });

      await newEnrollment.save();
      enrollments.push(newEnrollment);
    } catch (e) {
      // Catch validation errors from Joi and other exceptions
      errors.push({
        lrn: rowData.lrn || "Unknown LRN",
        errors: e.details
          ? e.details.map((detail) => detail.message)
          : [e.message],
      });
    }
  }
  const displayedErrors = errors.slice(0, 5);
  const hasMoreErrors = errors.length > 5;
  return { enrollments, errors: displayedErrors, hasMoreErrors };
};

module.exports = importClassEnrollments;
