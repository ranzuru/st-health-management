import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Tabs, Tab } from "@mui/material";
import exportDataToExcel from "../utils/exportDataToExcel.js";

// Form for inputs
import NutritionalStatusForm from "../modal/NutritionalStatusForm";
// axios imports
import axiosInstance from "../config/axios-instance";
import CustomGridToolbar from "../utils/CustomGridToolbar.js";
import CustomSnackbar from "../components/CustomSnackbar";
import StatusCell from "../components/StatusCell.js";

const NutritionalStatusPreGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [preRecords, setPreRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentType, setCurrentType] = useState("PRE");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handleDialogOpen = (recordId) => {
    setRecordIdToDelete(recordId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
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
    return `${month}-${day}-${year}`;
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const transformRecord = (record) => {
    const {
      classEnrollment: {
        student = {},
        academicYear = {},
        classProfile = {},
      } = {},
    } = record;
    const name =
      student.firstName || student.lastName
        ? `${student.lastName || ""}, ${student.firstName || ""}${
            student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
          } ${student.nameExtension || ""}`.trim()
        : "N/A";

    return {
      id: record._id,
      lrn: student.lrn || "N/A",
      name,
      age: student.age || "N/A",
      gender: student.gender || "N/A",
      birthDate: student.birthDate || "N/A",
      address: student.address || "N/A",
      grade: classProfile.grade || "N/A",
      section: classProfile.section || "N/A",
      schoolYear: academicYear.schoolYear || "N/A",
      dateMeasured: record.dateMeasured,
      weightKg: record.weightKg,
      heightCm: record.heightCm,
      BMI: record.BMI,
      BMIClassification: record.BMIClassification,
      heightForAge: record.heightForAge,
      beneficiaryOfSBFP: record.beneficiaryOfSBFP,
      measurementType: record.measurementType,
      remarks: record.remarks,
      status: record.status,
    };
  };

  const fetchRecord = useCallback(async (type = "PRE") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `nutritionalStatus/fetch/${type}`
      );
      const updatedRecord = response.data.map(transformRecord);
      setPreRecords(updatedRecord);
    } catch (error) {
      console.error("Error:", error.message, "Data:", error.data);
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecord(currentType);
  }, [fetchRecord, currentType]);

  const addNewNutritionalStatus = (newRecord) => {
    setPreRecords((prevCheckups) => [...prevCheckups, newRecord]);
  };

  const refreshNutritionalStatuses = () => {
    fetchRecord(currentType);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "grade", headerName: "Grade Level", width: 100 },
    { field: "section", headerName: "Section", width: 100 },
    {
      field: "birthDate",
      headerName: "Birthday",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.birthDate),
    },
    {
      field: "dateMeasured",
      headerName: "Date Measured",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.dateMeasured),
    },
    { field: "age", headerName: "Age", width: 100 },
    { field: "heightCm", headerName: "Height (cm)", width: 100 },
    { field: "weightKg", headerName: "Weight (kg)", width: 100 },
    { field: "BMI", headerName: "BMI", width: 100 },
    {
      field: "BMIClassification",
      headerName: "BMI Classification",
      width: 150,
    },
    { field: "heightForAge", headerName: "Height For Age", width: 150 },
    {
      field: "beneficiaryOfSBFP",
      headerName: "Feeding?",
      width: 100,
      valueGetter: (params) => (params.row.beneficiaryOfSBFP ? "Yes" : "No"),
    },
    {
      field: "measurementType",
      headerName: "Type",
      width: 100,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 90,
      renderCell: (params) => (
        <StatusCell value={params.value} colorMapping={studentStatusColors} />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditRecord(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEditRecord = (recordId) => {
    const recordToEdit = preRecords.find(
      (nutritionalStatus) => nutritionalStatus.id === recordId
    );
    setSelectedRecord(recordToEdit);
    setFormOpen(true);
  };

  const updatedRecord = (updatedRecords) => {
    setPreRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedRecords.id ? updatedRecords : record
      )
    );
  };

  const excelHeaders = columns.map((col) => ({
    title: col.headerName,
    key: col.field,
  }));

  const handleExport = () => {
    const activeFilterModel = filterModel;

    const filteredData = preRecords.filter((record) => {
      return activeFilterModel.items.every((filterItem) => {
        if (!filterItem.field) {
          return true;
        }
        let cellValue;
        if (
          filterItem.field === "beneficiaryOfSBFP" &&
          typeof record[filterItem.field] === "boolean"
        ) {
          // Directly translate the boolean to 'yes' or 'no'
          cellValue = record[filterItem.field] ? "yes" : "no";
        } else {
          // For other non-boolean fields, convert to string and process
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

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    const fileName = `NutritionalStatusRecords_${formattedDate}`;

    exportDataToExcel(filteredData, excelHeaders, fileName, {
      dateFields: ["birthDate", "dateMeasured"],
      excludeColumns: ["action"],
      booleanFields: ["beneficiaryOfSBFP"],
    });
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
        "/nutritionalStatus/importNutritionalStatuses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.errors && response.data.errors.length > 0) {
        // Display error messages from the import process
        const errorMessages = response.data.errors
          .map((error) => `${error.identifier}: ${error.errors.join(", ")}`)
          .join("; ");
        showSnackbar(`Import issues: ${errorMessages}`, "error");
      } else {
        // Display success message and refresh the data grid if needed
        showSnackbar(
          "Nutritional status records imported successfully!",
          "success"
        );
        refreshNutritionalStatuses(); // Function to refresh the list/grid of nutritional statuses
      }
    } catch (error) {
      console.error("Error during nutritional statuses import:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during import.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `nutritionalStatus/delete/${recordIdToDelete}`
      );

      // Update the state to filter out the deleted record
      const updatedRecords = preRecords.filter(
        (record) => record.id !== recordIdToDelete
      );
      setPreRecords(updatedRecords);
    } catch (error) {
      console.error("Error deleting the record:", error.message);
    }
    handleDialogClose();
  };

  const displayedRecords = preRecords
    .filter((record) => record.measurementType === currentType)
    .filter((record) =>
      Object.keys(record).some((key) => {
        const value = record[key]?.toString().toLowerCase();
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
                  Add Records
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
            <Tab label="PRE-INTERVENTION" value="PRE" />
            <Tab label="POST-INTERVENTION" value="POST" />
          </Tabs>
          <DataGrid
            ref={dataGridRef}
            rows={displayedRecords}
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
          <NutritionalStatusForm
            open={formOpen}
            isEditing={!!selectedRecord}
            onCheckUpdate={updatedRecord}
            addNewNutritionalStatus={addNewNutritionalStatus}
            selectedRecord={selectedRecord}
            onClose={() => {
              setSelectedRecord();
              handleModalClose();
            }}
            onCancel={() => {
              setSelectedRecord();
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

export default NutritionalStatusPreGrid;
