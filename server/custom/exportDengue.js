const DengueMonitoring = require("../models/DengueSchema"); // Make sure this path is correct
const { exportDataToExcel } = require("../utils/exportDataToExcel");
const moment = require("moment");

async function exportDengueMonitoringData(status) {
  // Assuming 'status' is passed as a parameter to this function now.
  const headers = [
    { title: "LRN", key: "lrn" },
    { title: "Name", key: "name" },
    { title: "Gender", key: "gender" },
    { title: "Birthday", key: "birthDate" },
    { title: "Age", key: "age" },
    { title: "Address", key: "address" },
    { title: "Grade", key: "grade" },
    { title: "Section", key: "section" },
    { title: "S.Y", key: "schoolYear" },
    { title: "Date of Onset", key: "dateOfOnset" },
    { title: "Date of Admission", key: "dateOfAdmission" },
    { title: "Hospital Admission", key: "hospitalAdmission" },
    { title: "Date of Discharge", key: "dateOfDischarge" },
    { title: "Status", key: "status" },
  ];

  const query = status ? { status: new RegExp(status, "i") } : {};
  const dengueRecords = await DengueMonitoring.find(query)
    .populate({
      path: "classEnrollment",
      populate: {
        path: "student",
        model: "StudentProfile",
      },
    })
    .populate({
      path: "classEnrollment",
      populate: {
        path: "classProfile",
        model: "ClassProfile",
      },
    })
    .populate({
      path: "classEnrollment",
      populate: {
        path: "academicYear",
        model: "AcademicYear",
      },
    })
    .exec();

  const dataForExport = dengueRecords.map((record) => {
    const enrollment = record.classEnrollment;
    const student = enrollment.student;
    const classProfile = enrollment.classProfile;
    const academicYear = enrollment.academicYear;

    const name = `${student.lastName}, ${student.firstName}${
      student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
    }${student.nameExtension ? ` ${student.nameExtension}` : ""}`.trim();

    const birthDate = moment(student.birthDate).format("MM/DD/YYYY");
    const formatMomentDate = (date) => {
      return date ? moment(date).format("MM/DD/YYYY") : "N/A";
    };
    return {
      lrn: student.lrn,
      name: name,
      gender: student.gender,
      birthDate: birthDate,
      age: student.age,
      address: student.address,
      grade: classProfile.grade,
      section: classProfile.section,
      schoolYear: academicYear.schoolYear,
      dateOfOnset: formatMomentDate(record.dateOfOnset),
      dateOfAdmission: formatMomentDate(record.dateOfAdmission),
      hospitalAdmission: record.hospitalAdmission,
      dateOfDischarge: formatMomentDate(record.dateOfDischarge),
      status: record.status,
    };
  });

  // Export the data to Excel
  const buffer = await exportDataToExcel(dataForExport, headers);

  // Return the buffer containing the Excel file data
  return buffer;
}

module.exports = exportDengueMonitoringData;
