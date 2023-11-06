import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FacultyProfileForm from "../modal/FacultyProfileForm";
import axiosInstance from "../config/axios-instance";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomSnackbar from "../components/CustomSnackbar";
import StatusCell from "../components/StatusCell.js";
import { Tabs, Tab } from "@mui/material";
import CustomGridToolbar from "../utils/CustomGridToolbar.js";
import FacultyInfoDialog from "../constants/facultyInfoDialog.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ReinstateFaculty } from "../components/FacultyActions/ReinstateFaculty.js";
import { HardDeleteFaculty } from "../components/FacultyActions/HardDeleteFaculty.js";

const FacultyProfileGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [facultyIdToDelete, setFacultyIdToDelete] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedFacultyInfo, setSelectedFacultyInfo] = useState(null);
  const [currentType, setCurrentType] = useState("Active");
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

  const handleDialogOpen = (employeeId) => {
    setFacultyIdToDelete(employeeId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setFacultyIdToDelete(null);
    setDialogOpen(false);
  };

  const handleInfoDialogClose = () => {
    setSelectedFacultyInfo(null);
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

  const mapRecord = (faculty) => {
    const { lastName, firstName, middleName, nameExtension } = faculty;
    const formattedName = `${lastName}, ${firstName} ${
      middleName ? middleName.charAt(0) + ". " : ""
    }${nameExtension}`.trim();
    return {
      id: faculty._employeeId,
      employeeId: faculty.employeeId,
      firstName: faculty.firstName,
      middleName: faculty.middleName,
      lastName: faculty.lastName,
      nameExtension: faculty.nameExtension,
      name: formattedName,
      gender: faculty.gender || "N/A",
      birthDate: faculty.birthDate || "N/A",
      age: faculty.age || "N/A",
      mobileNumber: faculty.mobileNumber || "N/A",
      email: faculty.email || "N/A",
      role: faculty.role || "",
      status: faculty.status || "N/A",
    };
  };

  const fetchFaculty = useCallback(async (status = "Active") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `facultyProfile/fetch/${status}`
      );
      const updatedFaculty = response.data.map(mapRecord);
      setFaculty(updatedFaculty);
    } catch (error) {
      console.error("An error occurred while fetching faculty:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch faculty when the component mounts
  useEffect(() => {
    fetchFaculty(currentType);
  }, [fetchFaculty, currentType]);

  // Function to update state after a faculty is updated
  const onFacultyUpdated = (updatedFaculty) => {
    const updatedFaculties = faculty.map((faculty) =>
      faculty.employeeId === updatedFaculty.faculty.employeeId
        ? {
            ...updatedFaculty.faculty,
            name: `${updatedFaculty.faculty.firstName} ${updatedFaculty.faculty.lastName}`,
          }
        : faculty
    );
    setFaculty(updatedFaculties);
  };

  // Function to add a new faculty record
  const addNewFaculty = (newFaculty) => {
    setFaculty((prevFaculty) => [...prevFaculty, newFaculty]);
  };

  const refreshFaculty = () => {
    fetchFaculty(currentType);
  };

  const columns = [
    { field: "employeeId", headerName: "EmployeeID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "age", headerName: "Age", width: 75 },
    {
      field: "birthDate",
      headerName: "Birthday",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.birthDate),
    },
    { field: "mobileNumber", headerName: "Mobile Number", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
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
        const { employeeId } = params.row;

        // Show edit and delete only for Enrolled students
        if (currentType === "Active") {
          return (
            <div>
              <IconButton onClick={() => handleEditFaculty(employeeId)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDialogOpen(employeeId)}>
                <DeleteOutlineIcon />
              </IconButton>
              <IconButton onClick={() => handleInfoDialogOpen(employeeId)}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <ReinstateFaculty
                employeeId={employeeId}
                onSuccess={refreshFaculty}
              />
              <IconButton onClick={() => handleInfoDialogOpen(employeeId)}>
                <VisibilityOutlinedIcon />
              </IconButton>
              <HardDeleteFaculty
                employeeId={employeeId}
                onSuccess={refreshFaculty}
              />
            </div>
          );
        }

        if (currentType === "Archived") {
          return (
            <div>
              <IconButton onClick={() => handleInfoDialogOpen(employeeId)}>
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
    const facultyInfo = faculty.find((faculty) => faculty.employeeId === id);
    setSelectedFacultyInfo(facultyInfo);
    setInfoDialogOpen(true);
  };

  const handleEditFaculty = (id) => {
    const facultyToEdit = faculty.find((faculty) => faculty.employeeId === id);
    setSelectedFaculty(facultyToEdit);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (facultyIdToDelete) {
      axiosInstance
        .put(`facultyProfile/deleteFacultyProfiles/${facultyIdToDelete}`)
        .then((response) => {
          if (response.status === 200) {
            setFaculty((prevFaculty) =>
              prevFaculty.map((faculty) =>
                faculty.employeeId === facultyIdToDelete
                  ? { ...faculty, status: "Inactive" }
                  : faculty
              )
            );
            showSnackbar("Faculty profile deactivated", "success");
          } else {
            showSnackbar("Failed to deactivate faculty profile", "error");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            showSnackbar(error.response.data.message, "warning"); // This line handles your specific message
          } else {
            showSnackbar("Unexpected error. Please try again.", "error");
          }
        });
    }
    handleDialogClose();
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const filteredFaculty = faculty
    .filter((faculty) => faculty.status === currentType)
    .filter((faculty) =>
      Object.keys(faculty).some((key) => {
        const value = faculty[key]?.toString().toLowerCase();
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
      <FacultyInfoDialog
        open={isInfoDialogOpen}
        onClose={handleInfoDialogClose}
        faculty={selectedFacultyInfo}
        refreshFaculty={refreshFaculty}
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
              Add Faculty
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
            rows={filteredFaculty}
            columns={columns}
            slots={{
              toolbar: CustomGridToolbar,
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
            getRowId={(row) => row.employeeId}
            loading={isLoading}
            style={{ height: 650 }}
          />
          <FacultyProfileForm
            isEditing={!!selectedFaculty}
            open={formOpen}
            addNewFaculty={addNewFaculty}
            onFacultyUpdated={onFacultyUpdated}
            selectedFaculty={selectedFaculty}
            onClose={() => {
              setSelectedFaculty(null);
              handleModalClose();
            }}
            onCancel={() => {
              setSelectedFaculty(null);
              handleModalClose();
            }}
          />
        </div>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Confirm Delete!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this faculty record?
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

export default FacultyProfileGrid;
