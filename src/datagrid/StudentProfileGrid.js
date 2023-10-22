import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import StudentProfileForm from "../modal/StudentProfileForm.js";
import axiosInstance from "../config/axios-instance";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const StudentsProfileGrid = () => {
  const [students, setStudents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDialogOpen = (lrn) => {
    setStudentIdToDelete(lrn);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setStudentIdToDelete(null);
    setDialogOpen(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("studentProfile/fetchStudent");
      const updatedStudents = response.data.map((student) => {
        return {
          ...student,
          id: student._id, // Assuming _id is the unique identifier for students
          name: `${student.lastName}, ${student.firstName} ${student.nameExtension}`,
          grade: student.classProfile ? student.classProfile.grade : "N/A",
          section: student.classProfile ? student.classProfile.section : "N/A",
        };
      });
      setStudents(updatedStudents);
    } catch (error) {
      console.error("An error occurred while fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onStudentUpdated = (updatedStudentData) => {
    const updatedStudent = updatedStudentData.student; // I'm assuming the updated student is available like this from your API response
    const updatedStudents = students.map((student) =>
      student.lrn === updatedStudent.lrn
        ? {
            ...updatedStudent,
            id: updatedStudent._id,
            name: `${updatedStudent.lastName}, ${updatedStudent.firstName} ${updatedStudent.nameExtension} `,
            grade: updatedStudent.classProfile
              ? updatedStudent.classProfile.grade
              : "N/A",
            section: updatedStudent.classProfile
              ? updatedStudent.classProfile.section
              : "N/A",
          }
        : student
    );
    setStudents(updatedStudents);
  };

  const addNewStudent = (newStudent) => {
    setStudents((prevStudent) => [...prevStudent, newStudent]);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "birthDate",
      headerName: "BirthDate",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.birthDate),
    },
    { field: "age", headerName: "Age", width: 75 },
    { field: "grade", headerName: "Grade Level", width: 150 },
    { field: "section", headerName: "Section", width: 150 },
    { field: "parentContact1", headerName: "Parent Contact", width: 150 },
    {
      field: "is4p",
      headerName: "4P's Member",
      width: 100,
      valueGetter: (params) => (params.row.is4p ? "Yes" : "No"),
    },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditStudent(params.row.lrn)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.lrn)}>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.lrn)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEditStudent = (lrn) => {
    const studentToEdit = students.find((student) => student.lrn === lrn);
    setSelectedStudent(studentToEdit);
    setFormOpen(true); // This would open the form dialog for editing
  };

  const handleDelete = () => {
    console.log(`Deactivating student with LRN:`, studentIdToDelete);
    if (studentIdToDelete) {
      axiosInstance
        .put(`studentProfile/updateStudent/${studentIdToDelete}`, {
          status: "Inactive",
        })
        .then((response) => {
          if (response.status === 200) {
            // Update the student status in your local state
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student.lrn === studentIdToDelete
                  ? { ...student, status: "Inactive" }
                  : student
              )
            );
          } else {
            console.error("Deactivating student failed:", response.statusText);
          }
        })
        .catch((error) => console.error("Deactivating student failed:", error));
    }
    handleDialogClose();
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const filteredStudents = students
    .filter(
      (student) =>
        (student?.id?.toString()?.includes(searchValue) ?? false) ||
        (student?.lrn?.toString()?.includes(searchValue) ?? false) ||
        (student?.name?.toLowerCase()?.includes(searchValue.toLowerCase()) ??
          false) ||
        (student?.gender?.toLowerCase()?.includes(searchValue.toLowerCase()) ??
          false) ||
        (student?.birthDate?.includes(searchValue) ?? false) ||
        (student?.age?.toString()?.includes(searchValue) ?? false) ||
        (student?.grade?.toLowerCase()?.includes(searchValue.toLowerCase()) ??
          false) ||
        (student?.section?.toLowerCase()?.includes(searchValue.toLowerCase()) ??
          false) ||
        (student?.contact?.toString()?.includes(searchValue) ?? false) ||
        (student?.is4p
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase()) ??
          false) ||
        (student?.status?.toLowerCase()?.includes(searchValue.toLowerCase()) ??
          false)
    )
    .filter((student) => student.status === "Enrolled") // Filter only active faculty
    .map((student) => ({
      ...student,
      id: student.lrn,
    }));

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-8">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            Add Student
          </Button>
          <div className="ml-2">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <DataGrid
          rows={filteredStudents}
          columns={columns}
          getRowId={(row) => row.lrn}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <StudentProfileForm
          open={formOpen}
          isEditing={!!selectedStudent}
          onStudentUpdated={onStudentUpdated}
          addNewStudent={addNewStudent}
          selectedStudent={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedStudent(null);
            handleModalClose();
          }}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentsProfileGrid;
