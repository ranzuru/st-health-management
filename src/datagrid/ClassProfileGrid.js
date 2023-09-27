import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClassProfileForm from "../modal/ClassProfileForm";
import axiosInstance from "../config/axios-instance";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ClassProfileGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [classProfiles, setClassProfiles] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classProfileIdToDelete, setClassProfileIdToDelete] = useState(null);
  const [selectedClassProfile, setSelectedClassProfile] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDialogOpen = (_id) => {
    setClassProfileIdToDelete(_id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setClassProfileIdToDelete(null);
    setDialogOpen(false);
  };

  const fetchClassProfiles = async () => {
    try {
      const response = await axiosInstance.get(
        "classProfile/fetchClassProfile"
      );
      const updatedClassProfiles = response.data.map((classProfile) => {
        const facultyName = classProfile.faculty.name;
        return {
          ...classProfile,
          faculty: facultyName,
        };
      });
      setClassProfiles(updatedClassProfiles);
    } catch (error) {
      console.error("Error:", error.message, "Data:", error.data);
    }
  };

  // Fetch ClassProfiles when the component mounts
  useEffect(() => {
    fetchClassProfiles();
  }, []);

  // Function to update state after a classProfile is updated
  const onClassProfileUpdated = (updatedClassProfile) => {
    const facultyName = updatedClassProfile.faculty
      ? `${updatedClassProfile.faculty.firstName} ${updatedClassProfile.faculty.lastName}`
      : ""; // Fallback to an empty string if no faculty info

    const updatedClassProfiles = classProfiles.map((classProfile) =>
      classProfile._id === updatedClassProfile._id
        ? {
            ...updatedClassProfile,
            faculty: facultyName, // This line updates the faculty
          }
        : classProfile
    );
    setClassProfiles(updatedClassProfiles);
  };

  const mapClassProfile = (classProfile) => {
    const facultyName = `${classProfile.faculty.firstName} ${classProfile.faculty.lastName}`;
    return {
      ...classProfile,
      faculty: facultyName,
    };
  };

  const addNewClassProfile = (newClassProfile) => {
    console.log("New class profile:", newClassProfile);
    const updatedClassProfile = mapClassProfile(newClassProfile);
    setClassProfiles((prevClassProfiles) => [
      ...prevClassProfiles,
      updatedClassProfile,
    ]);
  };

  const columns = [
    { field: "grade", headerName: "Grade Level", width: 100 },
    { field: "section", headerName: "Section", width: 150 },
    { field: "room", headerName: "Room", width: 100 },
    { field: "academicYear", headerName: "School Year", width: 150 },
    { field: "faculty", headerName: "Adviser", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
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
          <IconButton onClick={() => handleEditClassProfile(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEditClassProfile = (_id) => {
    const classProfileToEdit = classProfiles.find(
      (classProfile) => classProfile._id === _id
    );
    setSelectedClassProfile(classProfileToEdit);
    setFormOpen(true); // Assuming this opens the form dialog
  };

  const handleDelete = () => {
    if (classProfileIdToDelete) {
      axiosInstance
        .delete(`classProfile/deleteClassProfile/${classProfileIdToDelete}`)
        .then((response) => {
          if (response.status === 200) {
            // Remove the classProfile from your local state
            setClassProfiles((prevClassProfiles) =>
              prevClassProfiles.filter(
                (classProfile) => classProfile._id !== classProfileIdToDelete
              )
            );
          } else {
            console.error("Deleting classProfile failed:", response.statusText);
          }
        })
        .catch((error) =>
          console.error("Deleting classProfile failed:", error)
        );
    }
    handleDialogClose();
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const filteredClassProfiles = classProfiles
    .filter(
      (classProfile) =>
        (classProfile.grade ? classProfile.grade.toString() : "").includes(
          searchValue
        ) ||
        (classProfile.section
          ? classProfile.section.toLowerCase()
          : ""
        ).includes(searchValue.toLowerCase()) ||
        (classProfile.room ? classProfile.room.toLowerCase() : "").includes(
          searchValue.toLowerCase()
        ) ||
        (classProfile.academicYear
          ? classProfile.academicYear.toLowerCase()
          : ""
        ).includes(searchValue.toLowerCase()) ||
        (classProfile.status ? classProfile.status.toLowerCase() : "").includes(
          searchValue.toLowerCase()
        ) ||
        (classProfile.faculty
          ? classProfile.faculty.toLowerCase()
          : ""
        ).includes(searchValue.toLowerCase())
    )
    .filter((classProfile) => classProfile.status === "Active");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Record
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
          rows={filteredClassProfiles}
          columns={columns}
          getRowId={(row) => row._id}
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
        />
        <ClassProfileForm
          isEditing={!!selectedClassProfile}
          open={formOpen}
          addNewClassProfile={addNewClassProfile}
          onClassProfileUpdated={onClassProfileUpdated}
          selectedClassProfile={selectedClassProfile}
          onClose={() => {
            setSelectedClassProfile(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedClassProfile(null);
            handleModalClose();
          }}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this classProfile record?
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

export default ClassProfileGrid;
