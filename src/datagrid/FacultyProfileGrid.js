import React, { useState, useEffect } from "react";
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

const FacultyProfileGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [facultyIdToDelete, setFacultyIdToDelete] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

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

  const fetchFaculty = async () => {
    try {
      const response = await axiosInstance.get(
        "facultyProfile/fetchFacultyProfiles"
      );
      const updatedFaculty = response.data.map((faculty) => {
        return {
          ...faculty,
          id: faculty._employeeId,
          name: `${faculty.firstName} ${faculty.lastName}`,
        };
      });
      setFaculty(updatedFaculty);
    } catch (error) {
      console.error("An error occurred while fetching faculty:", error);
    }
  };

  // Fetch faculty when the component mounts
  useEffect(() => {
    fetchFaculty();
  }, []);

  // Function to update state after a faculty is updated
  // Function to update state after a faculty item is updated
  // Function to update state after a faculty item is updated
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

  const columns = [
    { field: "employeeId", headerName: "EmployeeID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mobileNumber", headerName: "Mobile Number", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: params.value === "Active" ? "green" : "red",
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditFaculty(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEditFaculty = (id) => {
    const facultyToEdit = faculty.find((faculty) => faculty.employeeId === id);
    setSelectedFaculty(facultyToEdit);
    setFormOpen(true); // Assuming this opens the form dialog
  };

  const handleDelete = () => {
    console.log("Deactivating faculty with employeeId:", facultyIdToDelete);
    if (facultyIdToDelete) {
      axiosInstance
        .put(`facultyProfile/deleteFacultyProfiles/${facultyIdToDelete}`, {
          status: "Inactive",
        })
        .then((response) => {
          if (response.status === 200) {
            // Update the faculty status in your local state
            setFaculty((prevFaculty) =>
              prevFaculty.map((faculty) =>
                faculty.employeeId === facultyIdToDelete
                  ? { ...faculty, status: "Inactive" }
                  : faculty
              )
            );
          } else {
            console.error("Deactivating faculty failed:", response.statusText);
          }
        })
        .catch((error) => console.error("Deactivating faculty failed:", error));
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
    .filter(
      (faculty) =>
        (faculty.employeeId ? faculty.employeeId.toString() : "").includes(
          searchValue
        ) ||
        (faculty.name ? faculty.name.toLowerCase() : "").includes(
          searchValue.toLowerCase()
        ) ||
        (faculty.mobileNumber ? faculty.mobileNumber.toString() : "").includes(
          searchValue
        ) ||
        (faculty.gender ? faculty.gender.toLowerCase() : "").includes(
          searchValue.toLowerCase()
        ) ||
        (faculty.status ? faculty.status.toLowerCase() : "").includes(
          searchValue.toLowerCase()
        )
    )
    .filter((faculty) => faculty.status === "Active") // Filter only active faculty
    .map((faculty) => ({
      ...faculty,
      id: faculty.employeeId,
    }));

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
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
        <DataGrid
          rows={filteredFaculty}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.employeeId}
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
  );
};

export default FacultyProfileGrid;
