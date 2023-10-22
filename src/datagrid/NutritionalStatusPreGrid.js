import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Description";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

// Form for inputs
import NutritionalStatusForm from "../modal/NutritionalStatusForm";
// axios imports
import axiosInstance from "../config/axios-instance";

const NutritionalStatusPreGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [preRecords, setPreRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchRecord = async (type = "PRE") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `nutritionalStatus/fetch/${type}`
      );
      const updatedRecord = response.data.map((record) => {
        return {
          id: record._id,
          dateMeasured: record.dateMeasured,
          lrn: record.studentProfile ? record.studentProfile.lrn : "N/A",
          age: record.studentProfile ? record.studentProfile.age : "N/A",
          gender: record.studentProfile ? record.studentProfile.gender : "N/A",
          birthDate: record.studentProfile
            ? record.studentProfile.birthDate
            : "N/A",
          grade:
            record.studentProfile && record.studentProfile.classProfile
              ? record.studentProfile.classProfile.grade
              : "N/A",
          section:
            record.studentProfile && record.studentProfile.classProfile
              ? record.studentProfile.classProfile.section
              : "N/A",
          weightKg: record.weightKg,
          heightCm: record.heightCm,
          BMI: record.BMI,
          BMIClassification: record.BMIClassification,
          heightForAge: record.heightForAge,
          beneficiaryOfSBFP: record.beneficiaryOfSBFP,
          measurementType: record.measurementType,
          remarks: record.remarks,
        };
      });
      setPreRecords(updatedRecord); // Assuming setRecords is a state setter function
    } catch (error) {
      console.error("Error:", error.message, "Data:", error.data);
      setIsLoading(true);
    } finally {
      setIsLoading(false); // This ensures loading is set to false regardless of try or catch outcomes.
    }
  };

  useEffect(() => {
    fetchRecord("PRE");
  }, []);

  const addNewNutritionalStatus = (newNutritionalStatus) => {
    setPreRecords((prevCheckups) => [...prevCheckups, newNutritionalStatus]);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 100 },
    { field: "gender", headerName: "Sex", width: 150 },
    { field: "grade", headerName: "Grade Level", width: 150 },
    { field: "section", headerName: "Section", width: 150 },
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
      headerName: "Eligible for Feeding",
      width: 100,
      valueGetter: (params) => (params.row.beneficiaryOfSBFP ? "Yes" : "No"),
    },
    {
      field: "measurementType",
      headerName: "Type of Measurement",
      width: 100,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleAction(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (userId) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${userId}`);
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

  const FilteredRecords = preRecords.filter(
    (record) =>
      (record.lrn?.toString() || "").includes(searchValue) ||
      (record.gender?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.grade?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
      (record.section?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.birthDate?.toString() || "").includes(searchValue) ||
      (record.dateMeasured?.toString() || "").includes(searchValue) ||
      (record.age?.toString() || "").includes(searchValue) ||
      (record.heightCm?.toString() || "").includes(searchValue) ||
      (record.weightKg?.toString() || "").includes(searchValue) ||
      (record.BMI?.toString() || "").includes(searchValue) ||
      (record.BMIClassification?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.heightForAge?.toString() || "").includes(searchValue) ||
      (record.beneficiaryOfSBFP?.toString() || "").includes(searchValue) ||
      (record.measurementType?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (record.remarks?.toLowerCase() || "").includes(searchValue.toLowerCase())
  );

  return (
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
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1 rem", sm: "1 rem", md: "1.5rem" },
            fontWeight: "bold",
            py: { xs: 0.5, md: 1 },
          }}
        >
          PRE-INTERVENTION
        </Typography>
        <DataGrid
          rows={FilteredRecords}
          columns={columns}
          getRowId={(row) => row.id}
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
          style={{ height: 500 }}
        />
        <NutritionalStatusForm
          open={formOpen}
          addNewNutritionalStatus={addNewNutritionalStatus}
          onClose={() => {
            handleModalClose();
          }}
          onCancel={() => {
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
  );
};

export default NutritionalStatusPreGrid;
