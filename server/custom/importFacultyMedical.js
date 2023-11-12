const FacultyProfile = require("../models/FacultyProfileSchema");
const AcademicYear = require("../models/AcademicYearSchema");
const FacultyCheckup = require("../models/FacultyCheckupSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");
const {
  facultyCheckupValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/facultyMedicalValidationSchema");
// Add any additional imports needed

const importFacultyMedical = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey); // Adjust mapping as needed

  const checkups = [];
  const errors = [];

  for (let rowData of data) {
    rowData.employeeId =
      rowData.employeeId != null
        ? String(rowData.employeeId)
        : rowData.employeeId;
    try {
      const { value, error } = facultyCheckupValidationSchema.validate(
        rowData,
        {
          abortEarly: false,
        }
      );

      if (error) throw error;

      const faculty = await FacultyProfile.findOne({
        employeeId: value.employeeId,
      });
      if (!faculty) {
        errors.push({
          employeeId: value.employeeId || "Unknown",
          errors: ["Invalid Faculty ID"],
        });
        continue;
      }

      const academicDetails = await AcademicYear.findOne({
        schoolYear: value.schoolYear,
      });
      if (!academicDetails) {
        errors.push({
          employeeId: value.employeeId,
          errors: ["Invalid School Year"],
        });
        continue;
      }

      const existingCheckup = await FacultyCheckup.findOne({
        facultyProfile: faculty._id,
        academicYear: academicDetails._id,
      });

      if (existingCheckup) {
        errors.push({
          employeeId: value.employeeId,
          errors: [
            "Checkup record for the given Faculty and Academic Year already exists",
          ],
        });
        continue;
      }

      const newCheckup = new FacultyCheckup({
        ...value,
        facultyProfile: faculty._id,
        academicYear: academicDetails._id,
      });

      await newCheckup.save();
      checkups.push(newCheckup);
    } catch (e) {
      errors.push({
        employeeId: rowData.employeeId || "Unknown Employee ID",
        errors: e.details
          ? e.details.map((detail) => detail.message)
          : [e.message],
      });
    }
  }

  const displayedErrors = errors.slice(0, 5);
  const hasMoreErrors = errors.length > 5;
  return { checkups, errors: displayedErrors, hasMoreErrors };
};

module.exports = importFacultyMedical;
