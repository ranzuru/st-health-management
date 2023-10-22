import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Description";
import FacultyMedicalForm from "../modal/FacultyMedicalForm";
import axiosInstance from "../config/axios-instance";

const FacultyCheckUpGrid = () => {
  const [medicalCheckups, setMedicalCheckups] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchMedicalCheckups = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("facultyMedical/fetch");
      const updatedCheckups = response.data.map((checkup) => {
        return {
          id: checkup._id,
          dateOfExamination: checkup.dateOfExamination,
          employeeId: checkup.facultyProfile
            ? checkup.facultyProfile.employeeId
            : "N/A",
          age: checkup.facultyProfile ? checkup.facultyProfile.age : "N/A",
          gender: checkup.facultyProfile
            ? checkup.facultyProfile.gender
            : "N/A",
          heightCm: checkup.heightCm,
          weightKg: checkup.weightKg,
          temperature: checkup.temperature,
          bloodPressure: checkup.bloodPressure,
          heartRate: checkup.heartRate,
        };
      });
      setMedicalCheckups(updatedCheckups);
    } catch (error) {
      console.error(
        "An error occurred while fetching medical checkups:",
        error
      );
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalCheckups();
  }, []);

  const addNewMedicalCheckup = (newCheckup) => {
    setMedicalCheckups((prevCheckups) => [...prevCheckups, newCheckup]);
  };

  const columns = [
    {
      field: "dateOfExamination",
      headerName: "Examination Date",
      width: 125,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfExamination),
    },
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "heightCm", headerName: "Height (cm)", width: 100 },
    { field: "weightKg", headerName: "Weight (kg)", width: 100 },
    { field: "temperature", headerName: "Temp (°C)", width: 100 },
    { field: "bloodPressure", headerName: "BP mmHg", width: 100 },
    { field: "heartRate", headerName: "Heart Rate", width: 100 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleAction(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
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

  const handleDelete = (userId) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${userId}`);
  };

  const FilteredMedicalCheckups = medicalCheckups.filter(
    (checkup) =>
      (checkup.dateOfExamination?.toString() || "").includes(searchValue) ||
      (checkup.employeeId?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (checkup.age?.toString() || "").includes(searchValue) ||
      (checkup.gender?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (checkup.section?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (checkup.academicYear?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (checkup.temperature?.toString() || "").includes(searchValue) ||
      (checkup.bloodPressure?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (checkup.heartRate?.toString() || "").includes(searchValue) ||
      (checkup.heightCm?.toString() || "").includes(searchValue) ||
      (checkup.weightKg?.toString() || "").includes(searchValue)
  );

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

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
          rows={FilteredMedicalCheckups}
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
          style={{ height: 650 }}
        />
        <FacultyMedicalForm
          open={formOpen}
          addNewMedicalCheckup={addNewMedicalCheckup}
          onClose={() => {
            handleModalClose();
          }}
          onCancel={() => {
            handleModalClose();
          }}
        />
      </div>
    </div>
  );
};

export default FacultyCheckUpGrid;
