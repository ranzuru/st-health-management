import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClassEnrollmentForm from "../modal/ClassEnrollmentForm";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Tabs, Tab } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ReinstateClassEnrollment } from "../components/ClassEnrollmentActions/Reinstate.js";

import axiosInstance from "../config/axios-instance";
import StatusCell from "../components/StatusCell.js";
import CustomGridToolbar from "../utils/CustomGridToolbar";
import ClassEnrollmentDialog from "../constants/classEnrollmentInfoDialog.js";

const ClassEnrollmentGrid = () => {
  const [enrolledRecords, setEnrolledRecords] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentType, setCurrentType] = useState("Active");
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedRecordInfo, setSelectedRecordInfo] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDialogOpen = (recordId) => {
    setRecordIdToDelete(recordId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
    setDialogOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const classEnrollmentStatusColor = {
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

  const mapRecord = (enrollments) => {
    const student = enrollments.student || {};
    const classProfile = enrollments.classProfile || {};
    const academicYear = enrollments.academicYear || {};
    const faculty = classProfile.faculty || {};

    const { lastName, firstName, middleName, nameExtension } = student;
    const formattedName = `${lastName || ""}, ${firstName || ""} ${
      middleName ? middleName.charAt(0) + ". " : ""
    }${nameExtension || ""}`.trim();

    const formattedFacultyName = `${faculty.lastName || ""}, ${
      faculty.firstName || ""
    }`.trim();

    return {
      id: enrollments._id,
      lrn: student.lrn || "N/A",
      name: formattedName,
      age: student.age || "N/A",
      gender: student.gender || "N/A",
      birthDate: student.birthDate || "N/A",
      faculty: formattedFacultyName,
      grade: classProfile.grade || "N/A",
      section: classProfile.section || "N/A",
      schoolYear: academicYear.schoolYear || "N/A",
      status: enrollments.status || "N/A",
    };
  };

  const fetchEnrolledRecords = useCallback(async (status = "Active") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/classEnrollment/fetch/${status}`
      );
      const updatedStudents = response.data.enrollments.map(mapRecord);
      setEnrolledRecords(updatedStudents);
    } catch (error) {
      console.error(
        "An error occurred while fetching medical checkups:",
        error
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrolledRecords(currentType);
  }, [fetchEnrolledRecords, currentType]);

  const addNewEnrolledStudents = (newEnrollment) => {
    setEnrolledRecords((prevRecords) => [...prevRecords, newEnrollment]);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.put(`classEnrollment/softDelete/${recordIdToDelete}`);
      const updatedRecords = enrolledRecords.filter(
        (record) => record.id !== recordIdToDelete
      );
      setEnrolledRecords(updatedRecords);
    } catch (error) {
      console.error("Error deleting the record:", error.message);
    }
    handleDialogClose();
  };

  const handleEditRecord = (recordId) => {
    const recordToEdit = enrolledRecords.find(
      (enrolledRecord) => enrolledRecord.id === recordId
    );
    setSelectedRecord(recordToEdit);
    setFormOpen(true);
  };

  const updatedEnrolledRecords = (updatedRecord) => {
    setEnrolledRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const refreshEnrollment = () => {
    fetchEnrolledRecords(currentType);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "age", headerName: "Age", width: 100 },
    {
      field: "birthDate",
      headerName: "Birthday",
      width: 175,
      valueGetter: (params) => formatDate(params.row.birthDate),
    },
    { field: "faculty", headerName: "Adviser", width: 150 },
    { field: "grade", headerName: "Grade", width: 100 },
    { field: "section", headerName: "Section", width: 100 },
    { field: "schoolYear", headerName: "School Year", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <StatusCell
          value={params.value}
          colorMapping={classEnrollmentStatusColor}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const { id } = params.row;

        // Show edit and delete only for Enrolled students
        if (currentType === "Active") {
          return (
            <div>
              <IconButton onClick={() => handleEditRecord(id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleInfoDialogOpen(id)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => handleDialogOpen(id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <ReinstateClassEnrollment
                recordId={id}
                onSuccess={refreshEnrollment}
              />
            </div>
          );
        }

        if (currentType === "Archived") {
          return (
            <div>
              <IconButton onClick={() => handleInfoDialogOpen(id)}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </div>
          );
        }
        return null;
      },
    },
  ];

  const handleInfoDialogOpen = (recordId) => {
    const classEnrollmentInfo = enrolledRecords.find(
      (enrolledRecord) => enrolledRecord.id === recordId
    );
    setSelectedRecordInfo(classEnrollmentInfo);
    setInfoDialogOpen(true);
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(
        `classEnrollment/export/${currentType}`,
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
      link.setAttribute("download", `classEnrollment${safeFileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const handleInfoDialogClose = () => {
    setSelectedRecordInfo(null);
    setInfoDialogOpen(false);
  };

  const filteredEnrollees = enrolledRecords
    .filter((enrollments) => enrollments.status === currentType)
    .filter((enrollments) =>
      Object.keys(enrollments).some((key) => {
        const value = enrollments[key]?.toString().toLowerCase();
        return value?.includes(searchValue.toLowerCase());
      })
    );

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  return (
    <>
      <ClassEnrollmentDialog
        open={isInfoDialogOpen}
        onClose={handleInfoDialogClose}
        enrollments={selectedRecordInfo}
        refreshEnrollment={refreshEnrollment}
        currentType={currentType}
      />
      <div className="flex flex-col h-full">
        <div className="w-full max-w-screen-xl mx-auto px-8">
          <div className="mb-4 flex justify-end items-center">
            <div className="flex items-center">
              <div className="ml-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleModalOpen}
                >
                  Enroll Student
                </Button>
              </div>
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
            rows={filteredEnrollees}
            columns={columns}
            getRowId={(row) => row.id}
            slots={{
              toolbar: () => <CustomGridToolbar onExport={handleExport} />,
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
          <ClassEnrollmentForm
            open={formOpen}
            isEditing={!!selectedRecord}
            addNewEnrolledStudents={addNewEnrolledStudents}
            selectedRecord={selectedRecord}
            onUpdate={updatedEnrolledRecords}
            onClose={() => {
              setSelectedRecord(null);
              handleModalClose();
            }}
            onCancel={() => {
              setSelectedRecord(null);
              handleModalClose();
            }}
          />
        </div>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Confirm Delete!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this record?
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

export default ClassEnrollmentGrid;
