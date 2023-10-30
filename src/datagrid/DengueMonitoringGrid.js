import React, { useState, useEffect } from "react";
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
import ReportIcon from "@mui/icons-material/Description";
import axiosInstance from "../config/axios-instance";
import DengueForm from "../modal/DengueForm";
// custom gridToolBar imports
import CustomGridToolbar from "../utils/CustomGridToolbar";

const DengueMonitoringGrid = () => {
  const [dengueRecords, setDengueRecords] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
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

  const handleDialogOpen = (checkupId) => {
    setRecordIdToDelete(checkupId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
    setDialogOpen(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchDengueRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("dengueMonitoring/fetch");
      const updatedRecords = response.data.map((record) => {
        return {
          id: record._id,
          lrn: record.studentProfile ? record.studentProfile.lrn : "N/A",
          name:
            record.studentProfile && record.studentProfile.middleName
              ? `${record.studentProfile.lastName}, ${
                  record.studentProfile.firstName
                } ${record.studentProfile.middleName.charAt(0)}. ${
                  record.studentProfile.nameExtension
                }`.trim()
              : "N/A",
          age: record.studentProfile ? record.studentProfile.age : "N/A",
          gender: record.studentProfile ? record.studentProfile.gender : "N/A",
          birthDate: record.studentProfile
            ? record.studentProfile.birthDate
            : "N/A",
          address: record.studentProfile
            ? record.studentProfile.address
            : "N/A",
          grade:
            record.studentProfile && record.studentProfile.classProfile
              ? record.studentProfile.classProfile.grade
              : "N/A",
          section:
            record.studentProfile && record.studentProfile.classProfile
              ? record.studentProfile.classProfile.section
              : "N/A",
          academicYear:
            record.studentProfile && record.studentProfile.classProfile
              ? record.studentProfile.classProfile.academicYear
              : "N/A",
          dateOfOnset: record.dateOfOnset,
          dateOfAdmission: record.dateOfAdmission,
          hospitalAdmission: record.hospitalAdmission,
          dateOfDischarge: record.dateOfDischarge,
        };
      });
      setDengueRecords(updatedRecords);
    } catch (error) {
      console.error(
        "An error occurred while fetching medical checkups:",
        error
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDengueRecords();
  }, []);

  const addNewDengueRecord = (newDengueRecord) => {
    setDengueRecords((prevRecords) => [...prevRecords, newDengueRecord]);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("File size exceeds 5MB", "error");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "dengueMonitoring/import-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 207) {
        const issues = response.data.errors;
        showSnackbar(
          `Partial Import Done. Issues: ${issues.join(", ")}`,
          "warning"
        );
      } else {
        showSnackbar("Data imported successfully!", "success");
      }

      fetchDengueRecords();
    } catch (error) {
      if (error.response && error.response.status === 207) {
        // Partial success; some records have issues
        const issues = error.response.data.errors;
        showSnackbar(
          `Partial Import Done. Issues: ${issues.join(", ")}`,
          "warning"
        );
      } else if (error.response?.data?.errors) {
        // Total failure but we have validation errors to show
        const errors = error.response.data.errors;
        showSnackbar(`Import failed. Issues: ${errors.join(", ")}`, "error");
      } else {
        // Unknown error
        showSnackbar("An error occurred during importing", "error");
      }
    }
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
      await axiosInstance.delete(`dengueMonitoring/delete/${recordIdToDelete}`);

      const updatedRecords = dengueRecords.filter(
        (record) => record.id !== recordIdToDelete
      );
      setDengueRecords(updatedRecords);
    } catch (error) {
      console.error("Error deleting the record:", error.message);
    }
    handleDialogClose();
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
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

  const FilteredDengueRecords = dengueRecords.filter(
    (record) =>
      (record.dateOfOnset?.toString() || "").includes(searchValue) ||
      (record.dateOfAdmission?.toString() || "").includes(searchValue) ||
      (record.dateOfDischarge?.toString() || "").includes(searchValue) ||
      (record.lrn?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
      (record.name?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
      (record.age?.toString() || "").includes(searchValue) ||
      (record.gender?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.grade?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
      (record.section?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.address?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.hospitalAdmission?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      )
  );
  const exportHeaders = columns
    .filter((col) => col.field !== "action") // Excluding the 'action' column
    .map((col) => col.headerName);
  const exportData = FilteredDengueRecords.map((record) => ({
    LRN: record.lrn,
    Name: record.name,
    Age: record.age,
    Gender: record.gender,
    "Grade Level": record.grade,
    Section: record.section,
    Address: record.address,
    "Date of Onset": formatYearFromDate(record.dateOfOnset),
    "Date of Admission": formatYearFromDate(record.dateOfAdmission),
    "Hospital Admission": record.hospitalAdmission,
    "Date of Discharge": formatYearFromDate(record.dateOfDischarge),
  }));

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
      <div className="flex flex-col h-full">
        <div className="w-full max-w-screen-xl mx-auto px-8">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Button variant="contained" color="secondary">
                <ReportIcon /> Generate Report
              </Button>
            </div>
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
          <DataGrid
            rows={FilteredDengueRecords}
            columns={columns}
            getRowId={(row) => row.id}
            slots={{
              toolbar: () => (
                <CustomGridToolbar
                  data={exportData}
                  headers={exportHeaders}
                  filenamePrefix="dengue_monitoring"
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
            checkboxSelection
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
