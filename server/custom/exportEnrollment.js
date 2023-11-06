const ClassEnrollment = require("../models/ClassEnrollment"); // Make sure this path is correct
const { exportDataToExcel } = require("../utils/exportDataToExcel");
const moment = require("moment");


async function exportClassEnrollmentData(status) {
  // Assuming 'status' is passed as a parameter to this function now.
  const headers = [
    { title: "LRN", key: "lrn" },
    { title: "Name", key: "name" },
    { title: "Gender", key: "gender" },
    { title: "Birthday", key: "birthDate" },
    { title: "Age", key: "age" },
    { title: "Adviser", key: "faculty" },
    { title: "Grade", key: "grade" },
    { title: "Section", key: "section" },
    { title: "S.Y", key: "schoolYear" },
    { title: "Status", key: "status" },
  ];

  const query = status ? { status: new RegExp(status, "i") } : {};
  const enrollmentRecords = await ClassEnrollment.find(query)
    .populate("student")
    .populate({
      path: "classProfile",
      populate: {
        path: "faculty",
        model: "FacultyProfile",
      },
    })
    .populate("academicYear")
    .exec();

  const dataForExport = enrollmentRecords.map((record) => {
    const student = record.student;
    const classProfile = record.classProfile;
    const faculty = classProfile.faculty;
    const academicYear = record.academicYear;

    const name = `${student.lastName}, ${student.firstName}${
      student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
    }${student.nameExtension ? ` ${student.nameExtension}` : ""}`.trim();

    const facultyName = `${faculty.lastName}, ${faculty.firstName}${
      faculty.middleName ? ` ${faculty.middleName.charAt(0)}.` : ""
    }`.trim();

    const birthDate = moment(student.birthDate).format("MM/DD/YYYY");
    return {
      lrn: student.lrn,
      name: name,
      gender: student.gender,
      birthDate: birthDate,
      age: student.age,
      faculty: facultyName,
      grade: classProfile.grade,
      section: classProfile.section,
      schoolYear: academicYear.schoolYear,
      status: record.status,
    };
  });

  // Export the data to Excel
  const buffer = await exportDataToExcel(dataForExport, headers);

  // Return the buffer containing the Excel file data
  return buffer;
}

module.exports = exportClassEnrollmentData;
