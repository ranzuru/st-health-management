const NutritionalStatus = require("../models/NutritionalStatusSchema");
const StudentProfile = require("../models/StudentProfileSchema");
const ClassEnrollment = require("../models/ClassEnrollment");
const {
  nutritionalStatusValidationSchema,
  mapHeaderToSchemaKey,
} = require("../schema/nutritionalStatusValidationSchema");
const { parseExcelToJson } = require("../utils/importDataToExcel");

const importNutritionalStatuses = async (fileBuffer) => {
  const data = await parseExcelToJson(fileBuffer, mapHeaderToSchemaKey);

  const nutritionalStatuses = [];
  const errors = [];

  for (let rowData of data) {
    rowData.lrn = rowData.lrn.toString();

    if (rowData.beneficiaryOfSBFP) {
      rowData.beneficiaryOfSBFP =
        rowData.beneficiaryOfSBFP.toLowerCase() === "yes";
    }

    try {
      const { value, error } = nutritionalStatusValidationSchema.validate(
        rowData,
        {
          abortEarly: false,
        }
      );
      if (error) throw error;

      // Replace lrn with student ID in your nutritional status import context
      const student = await StudentProfile.findOne({ lrn: value.lrn }).exec();
      if (!student) {
        errors.push({ lrn: value.lrn, errors: ["Student LRN does not exist"] });
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

      const existingRecord = await NutritionalStatus.findOne({
        classEnrollment: classEnrollment._id,
        measurementType: value.measurementType,
      }).exec();

      if (existingRecord) {
        errors.push({
          lrn: value.lrn,
          errors: [
            "A record for this student and measurement type already exists",
          ],
        });
        continue;
      }

      const newNutritionalStatus = new NutritionalStatus({
        ...value,
        classEnrollment: classEnrollment._id, // Assign the classEnrollment ID from the found document
      });

      await newNutritionalStatus.save();
      nutritionalStatuses.push(newNutritionalStatus);
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
  return { nutritionalStatuses, errors: displayedErrors, hasMoreErrors };
};

module.exports = importNutritionalStatuses;
