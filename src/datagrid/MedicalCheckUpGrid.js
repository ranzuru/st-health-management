import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Tabs, Tab } from "@mui/material";
import MedicalCheckupForm from "../modal/MedicalStudentForm";
import axiosInstance from "../config/axios-instance";
import CustomGridToolbar from "../utils/CustomGridToolbar.js";
import CustomSnackbar from "../components/CustomSnackbar";
import StudentMedicalInfoDialog from "../constants/studentMedicalInfoDialog.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { HardDeleteStudentMedical } from "../components/Actions/HardDeleteStudentMedical.js";
import { ReinstateStudentMedical } from "../components/Actions/ReinstateStudentMedical.js";
import StatusCell from "../components/StatusCell.js";
import exportDataToExcel from "../utils/exportDataToExcel.js";
import HeaderMapping from "../headerMapping/studentMedicalHeader.js";

const MedicalCheckUpGrid = () => {
  const [medicalCheckups, setMedicalCheckups] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedRecordInfo, setSelectedRecordInfo] = useState(null);
  const [currentType, setCurrentType] = useState("Active");
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });
  const dataGridRef = useRef(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = (checkupId) => {
    setRecordIdToDelete(checkupId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
    setDialogOpen(false);
  };

  const handleInfoDialogClose = () => {
    setSelectedRecordInfo(null);
    setInfoDialogOpen(false);
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

  const transformRecord = (checkup = {}) => {
    const { classEnrollment = {}, nutritionalStatus = {} } = checkup;

    // Destructure nested objects from classEnrollment
    const {
      student = {},
      academicYear = {},
      classProfile = {},
    } = classEnrollment;

    const name =
      student.firstName || student.lastName
        ? `${student.lastName || ""}, ${student.firstName || ""}${
            student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
          } ${student.nameExtension || ""}`.trim()
        : "N/A";

    return {
      id: checkup._id,
      dateOfExamination: checkup.dateOfExamination,
      lrn: student.lrn || "N/A",
      name,
      age: student.age || "N/A",
      gender: student.gender || "N/A",
      birthDate: student.birthDate || "N/A",
      address: student.address || "N/A",
      grade: classProfile.grade || "N/A",
      section: classProfile.section || "N/A",
      schoolYear: academicYear.schoolYear || "N/A",
      heightCm: nutritionalStatus.heightCm || "N/A",
      weightKg: nutritionalStatus.weightKg || "N/A",
      BMI: nutritionalStatus.BMI || "N/A",
      BMIClassification: nutritionalStatus.BMIClassification || "N/A",
      heightForAge: nutritionalStatus.heightForAge || "N/A",
      ironSupplementation: checkup.ironSupplementation,
      deworming: checkup.deworming,
      temperature: checkup.temperature,
      pulseRate: checkup.pulseRate,
      bloodPressure: checkup.bloodPressure,
      heartRate: checkup.heartRate,
      respiratoryRate: checkup.respiratoryRate,
      visionScreeningLeft: checkup.visionScreeningLeft,
      visionScreeningRight: checkup.visionScreeningRight,
      auditoryScreeningLeft: checkup.auditoryScreeningLeft,
      auditoryScreeningRight: checkup.auditoryScreeningRight,
      scalpScreening: checkup.scalpScreening,
      skinScreening: checkup.skinScreening,
      eyesScreening: checkup.eyesScreening,
      earScreening: checkup.earScreening,
      noseScreening: checkup.noseScreening,
      mouthScreening: checkup.mouthScreening,
      neckScreening: checkup.neckScreening,
      throatScreening: checkup.throatScreening,
      lungScreening: checkup.lungScreening,
      heartScreening: checkup.heartScreening,
      abdomen: checkup.abdomen,
      deformities: checkup.deformities,
      menarche: checkup.menarche,
      remarks: checkup.remarks,
      status: checkup.status,
    };
  };

  const fetchMedicalCheckups = useCallback(async (status = "Active") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `medicalCheckup/fetch/${status}`
      );
      const updatedCheckups = response.data.map(transformRecord);
      setMedicalCheckups(updatedCheckups);
    } catch (error) {
      console.error(
        "An error occurred while fetching medical checkups:",
        error
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false); // This ensures loading is set to false regardless of try or catch outcomes.
    }
  }, []);

  useEffect(() => {
    fetchMedicalCheckups(currentType);
  }, [fetchMedicalCheckups, currentType]);

  const addNewMedicalCheckup = (newCheckup) => {
    setMedicalCheckups((prevCheckups) => [...prevCheckups, newCheckup]);
  };

  const refreshRecord = () => {
    fetchMedicalCheckups(currentType);
  };

  const columns = [
    {
      field: "dateOfExamination",
      headerName: "Examination Date",
      width: 125,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfExamination),
    },
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "section", headerName: "Section", width: 100 },
    { field: "schoolYear", headerName: "S.Y", width: 100 },
    { field: "temperature", headerName: "Temp (°C)", width: 100 },
    { field: "bloodPressure", headerName: "BP mmHg", width: 100 },
    { field: "heartRate", headerName: "Heart Rate", width: 100 },
    { field: "heightCm", headerName: "Height (cm)", width: 100 },
    { field: "weightKg", headerName: "Weight (kg)", width: 100 },
    { field: "BMIClassification", headerName: "Classification", width: 100 },
    { field: "heightForAge", headerName: "Height For Age", width: 150 },
    {
      field: "ironSupplementation",
      headerName: "Iron Supp.",
      width: 100,
      valueGetter: (params) => (params.row.ironSupplementation ? "Yes" : "No"),
    },
    {
      field: "deworming",
      headerName: "Deworming",
      width: 100,
      valueGetter: (params) => (params.row.deworming ? "Yes" : "No"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 95,
      renderCell: (params) => (
        <StatusCell value={params.value} colorMapping={studentStatusColors} />
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

        if (currentType === "Archived") {
          return (
            <div>
              <IconButton onClick={() => handleInfoDialogOpen(id)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <HardDeleteStudentMedical
                recordId={id}
                onSuccess={refreshRecord}
              />
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <ReinstateStudentMedical
                recordId={id}
                onSuccess={refreshRecord}
              />
              <IconButton onClick={() => handleInfoDialogOpen(id)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <HardDeleteStudentMedical
                recordId={id}
                onSuccess={refreshRecord}
              />
            </div>
          );
        }
        return null;
      },
    },
  ];

  const handleExport = () => {
    const activeFilterModel = filterModel;

    const filteredData = medicalCheckups.filter((record) => {
      return activeFilterModel.items.every((filterItem) => {
        if (!filterItem.field) {
          return true;
        }

        let cellValue;
        if (
          filterItem.field === "deworming" ||
          filterItem.field === "ironSupplementation"
        ) {
          cellValue = record[filterItem.field] ? "yes" : "no";
        } else {
          cellValue = (record[filterItem.field] ?? "")
            .toString()
            .toLowerCase()
            .trim();
        }

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

    // Define excelHeaders based on the fields in transformedRecord
    const excelHeaders = Object.keys(medicalCheckups[0] || {})
      .filter((key) => key !== "id") // This will exclude the 'id' field
      .map((key) => ({
        title: HeaderMapping[key] || key,
        key: key,
      }));

    let fileName = "MedicalRecords";
    if (activeFilterModel.items.length > 0) {
      // Append filter details to the file name
      const filterDescriptions = activeFilterModel.items.map((filter) => {
        if (filter.operator === "isAnyOf" && Array.isArray(filter.value)) {
          return `${filter.field}_${filter.operator}_${filter.value.join("-")}`;
        }
        return `${filter.field}_${filter.operator}_${filter.value}`;
      });
      fileName += `_${filterDescriptions.join("_")}`;
    }

    fileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    exportDataToExcel(filteredData, excelHeaders, fileName, {
      dateFields: ["dateOfExamination", "birthDate"], // adjust based on transformed data
      excludeColumns: ["action"], // adjust based on transformed data
      booleanFields: ["deworming", "ironSupplementation"], // adjust as needed
    });
  };

  const handleInfoDialogOpen = (checkupId) => {
    const recordInfo = medicalCheckups.find(
      (medicalCheckup) => medicalCheckup.id === checkupId
    );

    setSelectedRecordInfo(recordInfo);
    setInfoDialogOpen(true);
  };

  const handleEditRecord = (checkupId) => {
    const medicalToEdit = medicalCheckups.find(
      (medicalCheckup) => medicalCheckup.id === checkupId
    );
    setSelectedRecord(medicalToEdit);
    setFormOpen(true);
  };

  const updatedMedicalCheckup = (updatedCheckup) => {
    setMedicalCheckups((prevCheckups) =>
      prevCheckups.map((checkup) =>
        checkup.id === updatedCheckup.id ? updatedCheckup : checkup
      )
    );
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.put(`medicalCheckup/softDelete/${recordIdToDelete}`);

      const updatedRecords = medicalCheckups.filter(
        (checkup) => checkup.id !== recordIdToDelete
      );
      showSnackbar("Medical checkup record marked as inactive", "success");
      setMedicalCheckups(updatedRecords);
    } catch (error) {
      showSnackbar("Error marking the record as inactive:", "error");
    }
    handleDialogClose();
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
        "medicalCheckup/import-student-medical", // Adjusted endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle response
      if (response.data.errors && response.data.errors.length > 0) {
        const errorMessages = response.data.errors
          .map((error) => `${error.lrn}: ${error.errors.join(", ")}`)
          .join("; ");
        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else {
        showSnackbar(
          "Student medical records imported successfully!",
          "success"
        );
        refreshRecord(); // Update this function as needed
      }
    } catch (error) {
      console.error("Error during student medical import:", error);
      // Error handling
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500 &&
        error.response?.data?.errors
      ) {
        const errorMessages = error.response.data.errors
          .map((error) => `${error.lrn}: ${error.errors.join(", ")}`)
          .join("; ");
        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred during import.";
        showSnackbar(errorMessage, "error");
      }
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  const FilteredMedicalCheckups = medicalCheckups.filter((checkup) =>
    Object.keys(checkup).some((key) => {
      const value = checkup[key]?.toString().toLowerCase();
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
      <StudentMedicalInfoDialog
        open={isInfoDialogOpen}
        onClose={handleInfoDialogClose}
        studentMedical={selectedRecordInfo}
        refreshRecord={refreshRecord}
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
                  Add Patients
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
            rows={FilteredMedicalCheckups}
            columns={columns}
            onFilterModelChange={(newModel) => setFilterModel(newModel)}
            getRowId={(row) => row.id}
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
          <MedicalCheckupForm
            open={formOpen}
            isEditing={!!selectedRecord}
            addNewMedicalCheckup={addNewMedicalCheckup}
            selectedRecord={selectedRecord}
            onCheckupUpdate={updatedMedicalCheckup}
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

export default MedicalCheckUpGrid;
