const StudentProfile = require("../models/StudentProfileSchema");
const ClassEnrollment = require("../models/ClassEnrollment");
const NutritionalStatus = require("../models/NutritionalStatusSchema");
const MedicalCheckup = require("../models/MedicalCheckupSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");
const {
  medicalCheckupValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/studentMedicalValidationSchema");
// Add any additional imports needed

const importStudentMedical = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey); // Adjust mapping as needed

  const checkups = [];
  const errors = [];

  for (let rowData of data) {
    rowData.lrn = rowData.lrn != null ? String(rowData.lrn) : rowData.lrn;
    if (rowData.ironSupplementation) {
      rowData.ironSupplementation =
        rowData.ironSupplementation.toLowerCase() === "yes";
    }
    if (rowData.deworming) {
      rowData.deworming = rowData.deworming.toLowerCase() === "yes";
    }
    try {
      const { value, error } = medicalCheckupValidationSchema.validate(
        rowData,
        {
          abortEarly: false,
        }
      );

      if (error) throw error;

      const student = await StudentProfile.findOne({
        lrn: value.lrn,
      });
      if (!student) {
        errors.push({
          lrn: value.lrn || "Unknown",
          errors: ["Invalid LRN"],
        });
        continue;
      }

      const classEnrollment = await ClassEnrollment.findOne({
        student: student._id,
      }).exec();

      if (!classEnrollment) {
        errors.push({
          lrn: value.lrn,
          errors: ["Student is not enrolled in any class"],
        });
        continue;
      }

      const latestNutrition = await NutritionalStatus.findOne({
        classEnrollment: classEnrollment._id,
      }).sort({ updatedAt: -1 });

      const newCheckup = new MedicalCheckup({
        ...value,
        classEnrollment: classEnrollment._id,
        nutritionalStatus: latestNutrition ? latestNutrition._id : null,
      });

      await newCheckup.save();
      checkups.push(newCheckup);
    } catch (e) {
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
  return { checkups, errors: displayedErrors, hasMoreErrors };
};

module.exports = importStudentMedical;
