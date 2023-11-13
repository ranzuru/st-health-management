import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axiosInstance from "../config/axios-instance";
import DengueForm from "../modal/DengueForm";
import { Tabs, Tab } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DengueInfoDialog from "../constants/dengueInfoDialog.js";
import { ReinstateDengueMonitoring } from "../components/Actions/ReinstateDengue.js";
import { useSelector } from "react-redux";
// custom gridToolBar imports
import CustomGridToolbar from "../utils/CustomGridToolbar";
import exportDataToExcel from "../utils/exportDataToExcel.js";
import StatusCell from "../components/StatusCell.js";

const DengueMonitoringGrid = () => {
  const [dengueRecords, setDengueRecords] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentType, setCurrentType] = useState("Active");
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedRecordInfo, setSelectedRecordInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });
  const dataGridRef = useRef(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
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

  const handleDialogOpen = (checkupId) => {
    setRecordIdToDelete(checkupId);
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
    if (!dateString) return "N/A"; // Return 'N/A' if dateString is null or undefined

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Return 'N/A' if the date is invalid

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const mapDengueRecord = (record) => {
    const { classEnrollment = {} } = record;
    const {
      student = {},
      academicYear = {},
      classProfile = {},
    } = classEnrollment;
    const {
      firstName = "N/A",
      lastName = "N/A",
      middleName = "",
      nameExtension = "",
      lrn = "N/A",
      age = "N/A",
      gender = "N/A",
      birthDate = "N/A",
      address = "N/A",
    } = student;

    const name = `${lastName}, ${firstName} ${middleName} ${nameExtension || ""}`;

    return {
      id: record._id,
      lrn,
      name,
      age,
      gender,
      birthDate,
      address,
      grade: classProfile.grade || "N/A",
      section: classProfile.section || "N/A",
      schoolYear: academicYear.schoolYear || "N/A",
      dateOfOnset: record.dateOfOnset || null,
      dateOfAdmission: record.dateOfAdmission || null,
      hospitalAdmission: record.hospitalAdmission,
      dateOfDischarge: record.dateOfDischarge || null,
      status: record.status,
    };
  };

  const fetchDengueRecords = useCallback(async (status = "Active") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `dengueMonitoring/fetch/${status}`
      );
      const updatedRecords = response.data.map(mapDengueRecord);
      setDengueRecords(updatedRecords);
    } catch (error) {
      console.error("An error occurred while fetching dengue records:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDengueRecords(currentType);
  }, [fetchDengueRecords, currentType]);

  const addNewDengueRecord = (newDengueRecord) => {
    setDengueRecords((prevRecords) => [...prevRecords, newDengueRecord]);
  };

  const refreshRecord = () => {
    fetchDengueRecords(currentType);
  };

  const handleEditRecord = (recordId) => {
    const recordToEdit = dengueRecords.find(
      (dengueRecord) => dengueRecord.id === recordId
    );
    setSelectedRecord(recordToEdit);
    setFormOpen(true);
  };

  const updatedMedicalCheckup = (updatedRecord) => {
    setDengueRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.put(`dengueMonitoring/delete/${recordIdToDelete}`);

      const updatedRecords = dengueRecords.filter(
        (record) => record.id !== recordIdToDelete
      );
      setDengueRecords(updatedRecords);
    } catch (error) {
      console.error("Error marking the record as inactive:", error.message);
    }
    handleDialogClose();
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 100 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "age", headerName: "Age", width: 150 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "grade", headerName: "Grade Level", width: 150 },
    { field: "section", headerName: "Section", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    {
      field: "dateOfOnset",
      headerName: "Date of Onset",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfOnset),
    },
    {
      field: "dateOfAdmission",
      headerName: "Date of Admission",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfAdmission),
    },
    {
      field: "hospitalAdmission",
      headerName: "Hospital Admission",
      width: 150,
    },
    {
      field: "dateOfDischarge",
      headerName: "Date of Discharge",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfDischarge),
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
      renderCell: (params) => {
        const { id } = params.row;

        if (currentType === "Active") {
          return (
            <div>
              <IconButton onClick={() => handleEditRecord(id)}>
                <EditIcon />
              </IconButton>
              {role === "Admin" && (
                <IconButton onClick={() => handleInfoDialogOpen(id)}>
                  <VisibilityOutlinedIcon />
                </IconButton>
              )}
              <IconButton onClick={() => handleDialogOpen(id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <IconButton onClick={() => handleInfoDialogOpen(id)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <ReinstateDengueMonitoring
                recordId={id}
                onSuccess={refreshRecord}
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

  const handleInfoDialogOpen = (id) => {
    const recordInfo = dengueRecords.find(
      (dengueRecord) => dengueRecord.id === id
    );
    setSelectedRecordInfo(recordInfo);
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setSelectedRecordInfo(null);
    setInfoDialogOpen(false);
  };

  const FilteredDengueRecords = dengueRecords.filter((record) =>
    Object.keys(record).some((key) => {
      const value = record[key]?.toString().toLowerCase();
      return value?.includes(searchValue.toLowerCase());
    })
  );

  const excelHeaders = columns.map((col) => ({
    title: col.headerName,
    key: col.field,
  }));

  const handleExport = () => {
    const activeFilterModel = filterModel;

    const filteredData = dengueRecords.filter((record) => {
      return activeFilterModel.items.every((filterItem) => {
        if (!filterItem.field) {
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

    exportDataToExcel(filteredData, excelHeaders, "DengueRecords", {
      dateFields: ["dateOfOnset", "dateOfAdmission", "dateOfDischarge"],
      excludeColumns: ["action"],
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

    setIsLoading(true);

    try {
      await axiosInstance.post("dengueMonitoring/import-dengue", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackbarData("Data imported successfully!", "success");
      refreshRecord();
    } catch (error) {
      // Setting the snackbar message to the error message from the backend
      setSnackbarData({
        message: error.response?.data?.error || "An unexpected error occurred.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
      <DengueInfoDialog
        open={isInfoDialogOpen}
        onClose={handleInfoDialogClose}
        record={selectedRecordInfo}
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
            {role === "Admin" && <Tab label="Archived" value="Archived" />}
            {role === "Admin" && <Tab label="Inactive" value="Inactive" />}
          </Tabs>
          <DataGrid
            ref={dataGridRef}
            rows={FilteredDengueRecords}
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
          <DengueForm
            open={formOpen}
            isEditing={!!selectedRecord}
            addNewDengueRecord={addNewDengueRecord}
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

export default DengueMonitoringGrid;
