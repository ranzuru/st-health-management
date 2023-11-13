const {
  studentValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/studentValidationSchema");
const StudentProfile = require("../models/StudentProfileSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");

const importStudents = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey);

  const studentProfiles = [];
  const errors = [];

  for (let rowData of data) {
    rowData.lrn = rowData.lrn != null ? String(rowData.lrn) : rowData.lrn;

    if (rowData.nameExtension === "null") {
      rowData.nameExtension = null;
    }
    if (rowData.is4p) {
      rowData.is4p = rowData.is4p.toLowerCase() === "yes";
    }
    try {
      const { value, error } = studentValidationSchema.validate(rowData, {
        abortEarly: false,
      });

      if (error) throw error;
      studentProfiles.push(value);
    } catch (validationError) {
      errors.push({
        lrn: rowData.lrn || "Unknown LRN",
        errors: validationError.details.map((detail) => detail.message),
      });
    }
  }

  if (studentProfiles.length > 0) {
    try {
      await StudentProfile.insertMany(studentProfiles, { ordered: false });
    } catch (dbError) {
      console.log("Caught BulkWriteError:", dbError); // Log 6
      if (dbError.name === "BulkWriteError" && dbError.code === 11000) {
        dbError.writeErrors.forEach((error) => {
          errors.push({
            lrn: error.op.lrn, // Changed 'row' to 'lrn'
            errors: [`Duplicate LRN found: ${error.op.lrn}`],
          });
        });
      } else {
        throw dbError;
      }
    }
  }

  return { studentProfiles, errors };
};

module.exports = importStudents;
