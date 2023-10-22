import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axiosInstance from "../config/axios-instance.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const UserApprovalGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); //Dialog for declined
  const [openApproveDialog, setOpenApproveDialog] = useState(false); //Dialog for openApprove
  const [selectedUserId, setSelectedUserId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const openDeclineDialog = () => {
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const openApproveConfirmation = () => {
    setOpenApproveDialog(true);
  };

  const closeApproveConfirmation = () => {
    setOpenApproveDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  // Fetch user data from your server when the component mounts
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/users/userFetch");
      const data = response.data;
      const formattedData = data.map((user) => ({
        ...user,
        id: user.user_id,
      }));
      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => handleAccept(params.row._id)}
            style={{ color: "green" }}
          >
            <CheckCircleOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDecline(params.row._id)}
            style={{ color: "red" }}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleConfirmApprove = async () => {
    try {
      const response = await axiosInstance.put(
        `/users/approveUser/${selectedUserId}`
      );
      if (response.status === 200) {
        showSnackbar("Successfully approved an account", "success");
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === selectedUserId) {
              return { ...user, approved: true };
            }
            return user;
          });
        });
      } else {
        showSnackbar(response.statusText, "error");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      showSnackbar(errorMessage, "error");
    }
    closeApproveConfirmation();
  };

  const handleConfirmDecline = async () => {
    try {
      const response = await axiosInstance.delete(
        `/users/deleteUser/${selectedUserId}`
      );
      if (response.status === 200) {
        showSnackbar("Successfully deleted an account", "success");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUserId)
        );
      } else {
        showSnackbar(response.statusText, "error");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      showSnackbar(errorMessage, "error");
    }
    closeDialog();
  };

  const handleDecline = async (_id) => {
    // Set the selected user's _id to the state variable
    setSelectedUserId(_id);
    openDeclineDialog();
  };

  const handleAccept = async (_id) => {
    // Set the selected user's _id to the state variable
    setSelectedUserId(_id);
    openApproveConfirmation();
  };

  const filteredUsers = users.filter((user) => {
    const userId = user._id || "";
    const name = (user.firstName || "") + " " + (user.lastName || "");
    const email = user.email || "";
    const mobile = user.phoneNumber || "";
    const role = user.role || "";

    const isApproved = user.approved === false;

    return (
      (isApproved && userId.toString().includes(searchValue)) ||
      (isApproved && name.toLowerCase().includes(searchValue.toLowerCase())) ||
      (isApproved && email.toLowerCase().includes(searchValue.toLowerCase())) ||
      (isApproved && mobile.includes(searchValue)) ||
      (isApproved && role.toLowerCase().includes(searchValue.toLowerCase()))
    );
  });

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top", // Position at the top
          horizontal: "center", // Position at the center horizontally
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
      <div>
        <div className="flex flex-col h-full">
          <div className="w-full max-w-screen-xl mx-auto px-4">
            <div className="mb-4 flex justify-end items-center">
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
              rows={filteredUsers}
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
              getRowId={(row) => row._id}
            />
          </div>
        </div>
        <Dialog open={openDialog} onClose={closeDialog}>
          <DialogTitle>Confirm Decline</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to decline this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleConfirmDecline()} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openApproveDialog} onClose={closeApproveConfirmation}>
          <DialogTitle>Confirm Approve</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeApproveConfirmation} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleConfirmApprove()} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UserApprovalGrid;
