const MedicalCheckup = require("../models/MedicalCheckupSchema");
const { exportDataToExcel } = require("../utils/exportDataToExcel");
const headers = require("../exportHeader/exportStudentMedicalHeader");
const moment = require("moment");
async function exportMedicalProfiles(status, filters) {
  function constructQueryObject(status, filters) {
    let query = status ? { status: new RegExp(status, "i") } : {};
    console.log("Initial Query:", query);

    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      if (!field || value === undefined || field.includes(".")) return;

      switch (operator) {
        case "contains":
          query[field] = new RegExp(value, "i");
          break;
        case "equals":
          query[field] = value;
          break;
        case "startsWith":
          query[field] = new RegExp("^" + value, "i");
          break;
        case "endsWith":
          query[field] = new RegExp(value + "$", "i");
          break;
        case "isEmpty":
          query[field] = "";
          break;
        case "isNotEmpty":
          query[field] = { $ne: "" };
          break;
        case "isAnyOf":
          if (Array.isArray(value)) {
            query[field] = { $in: value };
          }
          break;
        default:
          break;
      }
    });
    console.log("Constructed Query Object:", query);
    return query;
  }
  const query = constructQueryObject(status, filters);
  console.log("Final MongoDB Query:", query);
  const medicalProfiles = await MedicalCheckup.find(query)
    .populate({
      path: "classEnrollment",
      populate: {
        path: "student academicYear classProfile",
      },
    })
    .populate("nutritionalStatus");

  const filteredProfiles = medicalProfiles.filter((profile) => {
    return filters.every((filter) => {
      const { field, operator, value } = filter;
      if (!field.includes(".")) return true; // Skip top-level fields

      // Correctly handle nested fields
      const fieldParts = field.split(".");
      let nestedValue = profile;
      for (const part of fieldParts) {
        nestedValue = nestedValue ? nestedValue[part] : null;
      }
      console.log(
        `Filtering ${field} - Operator: ${operator}, Value: ${value}, Nested Value: ${nestedValue}`
      );
      console.log(`Applying filter on nested field - ${field}: ${nestedValue}`);
      switch (operator) {
        case "equals":
          return nestedValue === value;
        case "contains":
          return nestedValue && nestedValue.includes(value);
        case "startsWith":
          return nestedValue && nestedValue.startsWith(value);
        case "endsWith":
          return nestedValue && nestedValue.endsWith(value);
        case "isEmpty":
          return nestedValue === "";
        case "isNotEmpty":
          return nestedValue !== "";
        case "isAnyOf":
          return Array.isArray(value) && value.includes(nestedValue);
        default:
          console.log(`default: true`);
          return true;
      }
    });
  });

  const dataForExport = filteredProfiles.map((profile) => {
    const student = profile.classEnrollment.student;
    const academicYear = profile.classEnrollment.academicYear;
    const classProfile = profile.classEnrollment.classProfile;
    const nutritionalStatus = profile.nutritionalStatus;

    const formattedName = `${student.firstName} ${
      student.middleName ? student.middleName + " " : ""
    }${student.lastName}`;

    return {
      lrn: student.lrn,
      name: formattedName.trim(),
      age: student.age,
      gender: student.gender,
      birthDate: student.birthDate
        ? moment(student.birthDate).format("MM/DD/YYYY")
        : "",
      address: student.address,
      grade: classProfile.grade,
      section: classProfile.section,
      schoolYear: academicYear.schoolYear,
      heightCm: nutritionalStatus.heightCm,
      weightKg: nutritionalStatus.weightKg,
      BMI: nutritionalStatus.BMI,
      BMIClassification: nutritionalStatus.BMIClassification,
      heightForAge: nutritionalStatus.heightForAge,
      ironSupplementation: profile.ironSupplementation ? "Yes" : "No",
      dateOfExamination: moment(profile.dateOfExamination).format("YYYY-MM-DD"),
      deworming: profile.deworming ? "Yes" : "No",
      pulseRate: profile.pulseRate,
      temperature: profile.temperature,
      bloodPressure: profile.bloodPressure,
      heartRate: profile.heartRate,
      respiratoryRate: profile.respiratoryRate,
      visionScreeningLeft: profile.visionScreeningLeft,
      visionScreeningRight: profile.visionScreeningRight,
      auditoryScreeningLeft: profile.auditoryScreeningLeft,
      auditoryScreeningRight: profile.auditoryScreeningRight,
      scalpScreening: profile.scalpScreening,
      skinScreening: profile.skinScreening,
      eyesScreening: profile.eyesScreening,
      earScreening: profile.earScreening,
      noseScreening: profile.noseScreening,
      mouthScreening: profile.mouthScreening,
      neckScreening: profile.neckScreening,
      throatScreening: profile.throatScreening,
      lungScreening: profile.lungScreening,
      heartScreening: profile.heartScreening,
      abdomen: profile.abdomen,
      deformities: profile.deformities,
      menarche: profile.menarche,
      remarks: profile.remarks,
      status: profile.status,
    };
  });

  const buffer = await exportDataToExcel(dataForExport, headers);
  return buffer;
}
module.exports = {
  exportMedicalProfiles,
};
