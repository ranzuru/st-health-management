import { useState, useEffect, useCallback, useRef } from "react";
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
import CustomSnackbar from "../components/CustomSnackbar.js";
import exportDataToExcel from "../utils/exportDataToExcel.js";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dataGridRef = useRef(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

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
        "classEnrollment/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.errors && response.data.errors.length > 0) {
        const errorMessages = response.data.errors
          .map((error) => `LRN ${error.lrn}: ${error.errors.join(", ")}`)
          .join("; ");
        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else {
        showSnackbar("Data imported successfully!", "success");
        refreshEnrollment();
      }
    } catch (error) {
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500 &&
        error.response?.data?.errors
      ) {
        const errorMessages = error.response.data.errors
          .map((error) => `LRN ${error.lrn}: ${error.errors.join(", ")}`)
          .join("; ");

        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred during import.";
        showSnackbar(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const excelHeaders = columns.map((col) => ({
    title: col.headerName,
    key: col.field,
  }));

  const handleExport = () => {
    const activeFilterModel = filterModel;

    const filteredData = enrolledRecords.filter((record) => {
      return activeFilterModel.items.every((filterItem) => {
        if (!filterItem.field) {
          console.log("Skipping filter item due to no field specified");
          return true;
        }
        const cellValue = (record[filterItem.field] ?? "")
          .toString()
          .toLowerCase()
          .trim();

        // We expect filterItem.value to be an array for "is any of"
        const filterValues = Array.isArray(filterItem.value)
          ? filterItem.value.map((val) => val.toString().toLowerCase().trim())
          : [filterItem.value.toString().toLowerCase().trim()];

        switch (filterItem.operator) {
          case "equals":
            return cellValue === filterValues[0];
          case "contains":
            return filterValues.some((value) => cellValue.includes(value));
          case "startsWith":
            return filterValues.some((value) => cellValue.startsWith(value));
          case "endsWith":
            return filterValues.some((value) => cellValue.endsWith(value));
          case "isAnyOf":
            return filterValues.includes(cellValue);
          default:
            console.log(
              `Unknown filter type '${filterItem.operator}', record included by default`
            );
            return true;
        }
      });
    });

    // Proceed with the export using the filtered data
    exportDataToExcel(filteredData, excelHeaders, "Enrollments", {
      dateFields: ["birthDate"],
      excludeColumns: ["action"],
    });
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
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />
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
            ref={dataGridRef}
            rows={filteredEnrollees}
            columns={columns}
            getRowId={(row) => row.id}
            onFilterModelChange={(newModel) => setFilterModel(newModel)}
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
