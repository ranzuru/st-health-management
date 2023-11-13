import React, { useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ManageUserModal from "../modal/ManageUserPop.js";
import axiosInstance from "../config/axios-instance.js";
import { Tabs, Tab } from "@mui/material";
import CustomSnackbar from "../components/CustomSnackbar.js";
import StatusCell from "../components/StatusCell.js";
import { ReinstateUser } from "../components/Actions/ReinstateUser.js";
import { HardDeleteUser } from "../components/Actions/HardDeleteUser.js";

const UserGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentType, setCurrentType] = useState("Active");
  const [selectedUser, setSelectedUser] = useState(null);
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

  const userStatusColors = {
    Active: {
      bgColor: "#DFF0D8",
      textColor: "#4CAF50",
      borderColor: "#4CAF50",
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

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  };

  const mapRecord = (user) => {
    const { lastName, firstName } = user;
    const formattedName = `${firstName} ${lastName}`;
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: formattedName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt,
      status: user.status,
    };
  };

  const fetchData = useCallback(async (status = "Active") => {
    try {
      const response = await axiosInstance.get(`/users/userFetch/${status}`);
      const updatedUser = response.data.map(mapRecord);
      setUsers(updatedUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(currentType);
  }, [fetchData, currentType]);

  const refreshUser = () => {
    fetchData(currentType);
  };

  const columns = [
    { field: "_id", headerName: "UserID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "phoneNumber", headerName: "Mobile Number", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.createdAt),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <StatusCell value={params.value} colorMapping={userStatusColors} />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const { _id } = params.row;

        // Show edit and delete only for Enrolled students
        if (currentType === "Active") {
          return (
            <div>
              <IconButton onClick={() => handleEditUser(_id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleSoftDelete(_id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        }

        if (currentType === "Inactive") {
          return (
            <div>
              <ReinstateUser recordId={_id} onSuccess={refreshUser} />
              <HardDeleteUser recordId={_id} onSuccess={refreshUser} />
            </div>
          );
        }
        return null;
      },
    },
  ];

  const handleSoftDelete = async (userId) => {
    try {
      const response = await axiosInstance.put(`/users/softDelete/${userId}`);
      if (response.status === 200) {
        showSnackbar("User marked as inactive", "success");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } else {
        showSnackbar(response.statusText, "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong!";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleEditUser = (userId) => {
    const studentToEdit = users.find((users) => users._id === userId);
    setSelectedUser(studentToEdit);
    setFormOpen(true);
  };

  const filteredUsers = users
    .filter((users) => users.status === currentType)
    .filter((users) =>
      Object.keys(users).some((key) => {
        const value = users[key]?.toString().toLowerCase();
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOpen}
            >
              New User
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
            <Tab label="Inactive" value="Inactive" />
          </Tabs>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
            style={{ height: 650 }}
          />
          <ManageUserModal
            open={formOpen}
            selectedUser={selectedUser}
            isEditing={!!selectedUser}
            onUpdate={refreshUser}
            onClose={() => {
              setSelectedUser(null);
              handleModalClose();
            }}
            onCancel={() => {
              setSelectedUser(null);
              handleModalClose();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserGrid;
