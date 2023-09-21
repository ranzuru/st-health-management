import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ManageUserModal from "../modal/ManageUserPop.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../config/axios-instance.js";

const UserGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
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

    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once

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
          <IconButton onClick={() => handleAction(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleViewInfo(params.row._id)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (_id) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${_id}`);
  };

  const handleViewInfo = (_id) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${_id}`);
  };

  const handleDelete = (_id) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${_id}`);
  };

  const filteredUsers = users.filter((user) => {
    const userId = user._id || "";
    const name = (user.firstName || "") + " " + (user.lastName || "");
    const email = user.email || "";
    const mobile = user.phoneNumber || "";
    const role = user.role || "";
    const status = user.status || "";

    const isApproved = user.approved === true;

    return (
      (isApproved && userId.toString().includes(searchValue)) ||
      (isApproved && name.toLowerCase().includes(searchValue.toLowerCase())) ||
      (isApproved && email.toLowerCase().includes(searchValue.toLowerCase())) ||
      (isApproved && mobile.includes(searchValue)) ||
      (isApproved && role.toLowerCase().includes(searchValue.toLowerCase())) ||
      (isApproved && status.toLowerCase().includes(searchValue.toLowerCase()))
    );
  });

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
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
        <ManageUserModal
          open={isModalOpen}
          onClose={handleModalClose}
          onCancel={handleModalClose}
        />
      </div>
    </div>
  );
};

export default UserGrid;
