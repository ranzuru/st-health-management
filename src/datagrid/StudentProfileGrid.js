import { useState, useEffect, useCallback } from "react";
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
import { Tabs, Tab } from "@mui/material";

import CustomGridToolbar from "../utils/CustomGridToolbar.js";
import StatusCell from "../components/StatusCell.js";
import StudentInfoDialog from "../constants/studentInfoDialog.js";
import { ReinstateStudent } from "../components/StudentActions/ReinstateStudent.js";
import { HardDeleteStudent } from "../components/StudentActions/HardDeleteStudent.js";
import CustomSnackbar from "../components/CustomSnackbar.js";

const StudentsProfileGrid = () => {
  const [students, setStudents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentType, setCurrentType] = useState("Active");
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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

  const studentStatusColors = {
    Active: {
      bgColor: "#DFF0D8",
      textColor: "#4CAF50",
      borderColor: "#4CAF50",
    },
    Archived: {
      bgColor: "#FEEBC8",
      textColor: "#FF9800",
      borderColor: "#FF9800",
    },
    Inactive: {
      bgColor: "#EBDEF0",
      textColor: "#8E44AD",
      borderColor: "#8E44AD",
    },
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const mapRecord = (student) => {
    const { lastName, firstName, middleName, nameExtension } = student;
    const formattedName = `${lastName}, ${firstName} ${
      middleName ? middleName.charAt(0) + ". " : ""
    }${nameExtension ? nameExtension + " " : ""}`.trim();
    return {
      id: student._id,
      lrn: student.lrn,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      nameExtension: student.nameExtension || "",
      name: formattedName,
      gender: student.gender || "N/A",
      birthDate: student.birthDate || "N/A",
      age: student.age || "N/A",
      is4p: student.is4p !== undefined ? student.is4p : "N/A",
      parentContact1: student.parentContact1 || "N/A",
      parentName1: student.parentName1 || "N/A",
      parentName2: student.parentName2 || "",
      parentContact2: student.parentContact2 || "",
      address: student.address || "N/A",
      status: student.status || "N/A",
    };
  };

  const fetchStudents = useCallback(async (status = "Active") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `studentProfile/fetch/${status}`
      );
      const updatedStudents = response.data.map(mapRecord);
      setStudents(updatedStudents);
    } catch (error) {
      console.error("An error occurred while fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(currentType);
  }, [fetchStudents, currentType]);

  const updatedStudentProfile = (updatedStudentData) => {
    const mappedRecord = mapRecord(updatedStudentData);
    setStudents((prevRecords) =>
      prevRecords.map((student) =>
        student.lrn === mappedRecord.lrn ? mappedRecord : student
      )
    );
  };

  const addNewStudent = (newStudent) => {
    const mappedRecord = mapRecord(newStudent);
    setStudents((prevStudent) => [...prevStudent, mappedRecord]);
  };

  const refreshStudents = () => {
    fetchStudents(currentType);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "birthDate",
      headerName: "Birthday",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.birthDate),
    },
    { field: "age", headerName: "Age", width: 75 },
    { field: "parentContact1", headerName: "Parent Contact", width: 150 },
    {
      field: "is4p",
      headerName: "4P's Member",
      width: 100,
      valueGetter: (params) => (params.row.is4p ? "Yes" : "No"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <StatusCell value={params.value} colorMapping={studentStatusColors} />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const { lrn } = params.row;

        // Show edit and delete only for Enrolled students
        if (currentType === "Active") {
          return (
            <div>
              <IconButton onClick={() => handleEditStudent(lrn)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleInfoDialogOpen(lrn)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => handleDialogOpen(lrn)}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <ReinstateStudent lrn={lrn} onSuccess={refreshStudents} />
              <HardDeleteStudent lrn={lrn} onSuccess={refreshStudents} />
            </div>
          );
        }

        if (currentType === "Archived") {
          return (
            <div>
              <IconButton onClick={() => handleInfoDialogOpen(lrn)}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </div>
          );
        }
        return null;
      },
    },
  ];

  const handleInfoDialogOpen = (lrn) => {
    const studentInfo = students.find((student) => student.lrn === lrn);
    setSelectedStudentInfo(studentInfo);
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setSelectedStudentInfo(null);
    setInfoDialogOpen(false);
  };

  const handleEditStudent = (lrn) => {
    const studentToEdit = students.find((student) => student.lrn === lrn);
    setSelectedStudent(studentToEdit);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (studentIdToDelete) {
      axiosInstance
        .put(`studentProfile/deleteStudent/${studentIdToDelete}`)
        .then((response) => {
          if (response.status === 200) {
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

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("File size exceeds 5MB", "error");
      return;
    }

    setIsLoading(true); // Start loading spinner

    try {
      const response = await axiosInstance.post(
        "studentProfile/import-students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // If there are specific error details in the success response
      if (response.data.details && response.data.details.length > 0) {
        refreshStudents();
        const errorMessages = response.data.details
          .map((detail) => `${detail.lrn}: ${detail.message}`)
          .join("; ");

        showSnackbar(`Import issues: ${errorMessages}`, "warning");
      } else {
        // General success message
        showSnackbar("Data imported successfully!", "success");
      }
      refreshStudents();
    } catch (error) {
      console.log("API error:", error.response);
      if (error.response?.data?.details) {
        // Construct the error messages from error response
        const errorMessages = error.response.data.details
          .map((detail) => `${detail.lrn}: ${detail.message}`)
          .join("; ");

        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else if (error.response?.data?.message) {
        // Backend provided error message
        showSnackbar(`Import failed. ${error.response.data.message}`, "error");
      } else {
        // Fallback error message
        showSnackbar("An error occurred during importing", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(
        `studentProfile/export/${currentType}`,
        { responseType: "blob" } // Make sure to set the responseType to 'blob'
      );
      // Create a new Blob object with the correct MIME type for an Excel file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeFileName = currentType.replace(/[^a-z0-9-_]/gi, "_");
      link.setAttribute("download", `StudentProfiles_${safeFileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up to avoid memory leaks
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const filteredStudents = students
    .filter((student) => student.status === currentType)
    .filter((student) =>
      Object.keys(student).some((key) => {
        const value = student[key]?.toString().toLowerCase();
        return value?.includes(searchValue.toLowerCase());
      })
    );

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />

      <StudentInfoDialog
        open={isInfoDialogOpen}
        onClose={handleInfoDialogClose}
        student={selectedStudentInfo}
        refreshStudents={refreshStudents}
        currentType={currentType}
      />
      <div className="flex flex-col h-full">
        <div className="w-full max-w-screen-xl mx-auto px-8">
          <div className="mb-4 flex justify-end items-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOpen}
            >
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
          <Tabs
            value={currentType}
            onChange={(_, newValue) => setCurrentType(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Active" value="Active" />
            <Tab label="Archived" value="Archived" />
            <Tab label="Inactive" value="Inactive" />
          </Tabs>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            getRowId={(row) => row.lrn}
            slots={{
              toolbar: () => (
                <CustomGridToolbar
                  onExport={handleExport}
                  handleImport={handleImport}
                />
              ),
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f3f4f6",
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            loading={isLoading}
            style={{ height: 650 }}
          />
          <StudentProfileForm
            open={formOpen}
            isEditing={!!selectedStudent}
            addNewStudent={addNewStudent}
            onUpdate={updatedStudentProfile}
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
    </>
  );
};

export default StudentsProfileGrid;
