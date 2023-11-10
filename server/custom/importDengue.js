const DengueMonitoring = require("../models/DengueSchema");
const ClassEnrollment = require("../models/ClassEnrollment");
const StudentProfile = require("../models/StudentProfileSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel"); // ensure you have this utility function
const {
  dengueValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/dengueValidationSchema"); // ensure you define this schema

const importDengueRecords = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey); // Adjust if you have a specific mapping function
  const dengueRecords = [];
  const errors = [];

  for (let rowData of data) {
    rowData.lrn = rowData.lrn.toString();
    try {
      // Validate the rowData with your dengueValidationSchema, ensure you define this
      const { value, error } = dengueValidationSchema.validate(rowData, {
        abortEarly: false,
      });

      if (error) throw error;

      // Find the student using LRN
      const student = await StudentProfile.findOne({ lrn: value.lrn }).exec();
      if (!student) {
        errors.push({
          lrn: value.lrn || "Unknown LRN",
          errors: ["Invalid LRN or the student is not enrolled"],
        });
        continue; // Skip to the next iteration
      }

      // Find the class enrollment
      const classEnrollment = await ClassEnrollment.findOne({
        student: student._id,
      }).exec();

      if (!classEnrollment) {
        errors.push({
          lrn: value.lrn,
          errors: ["Student is not enrolled in any class"],
        });
        continue; // Skip to the next iteration
      }

      // Create new dengue record
      const newDengueRecord = new DengueMonitoring({
        ...value, // replace with your schema fields
        classEnrollment: classEnrollment._id,
      });

      await newDengueRecord.save();
      dengueRecords.push(newDengueRecord);
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
  return { dengueRecords, errors: displayedErrors, hasMoreErrors };
};

module.exports = importDengueRecords;
