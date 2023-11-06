const StudentProfile = require("../models/StudentProfileSchema");
const { exportDataToExcel } = require("../utils/exportDataToExcel");
const moment = require("moment");

async function exportStudentProfile(status) {
  const headers = [
    { title: "LRN", key: "lrn" },
    { title: "Name", key: "formattedName" },
    { title: "Gender", key: "gender" },
    { title: "Birthday", key: "birthDate" },
    { title: "Age", key: "age" },
    { title: "4P's", key: "is4p" },
    { title: "Parent Name1", key: "parentName1" },
    { title: "Contact Number1", key: "parentContact1" },
    { title: "Parent Name2", key: "parentName2" },
    { title: "Contact Number2", key: "parentContact2" },
    { title: "Address", key: "address" },
    { title: "Status", key: "status" },
  ];

  const query = status ? { status: new RegExp(status, "i") } : {};
  const studentProfiles = await StudentProfile.find(query);

  const dataForExport = studentProfiles.map((student) => {
    const formattedName = `${student.firstName} ${
      student.middleName ? student.middleName + " " : ""
    }${student.lastName}`;

    const birthDate = student.birthDate
      ? moment(student.birthDate).format("MM/DD/YYYY")
      : "";

    return {
      lrn: student.lrn,
      formattedName: formattedName,
      gender: student.gender,
      birthDate: birthDate,
      age: student.age,
      is4p: student.is4p ? "Yes" : "No",
      parentName1: student.parentName1,
      parentContact1: student.parentContact1,
      parentName2: student.parentName2,
      parentContact2: student.parentContact2,
      address: student.address,
      status: student.status,
    };
  });

  const buffer = await exportDataToExcel(dataForExport, headers);
  return buffer;
}

module.exports = exportStudentProfile;
