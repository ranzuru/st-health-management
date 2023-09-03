import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ManageUserModal from '../modal/ManageUserModal.js'

const UserGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    // Fetch user data from your server when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/userFetch');
        if (response.ok) {
          const data = await response.json();
          // Map the data to include an 'id' property
          const formattedData = data.map((user) => ({
        ...user,
        id: user.user_id,
      }));
      setUsers(formattedData); // Update the users state with the formatted data
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once

  const columns = [
    { field: '_id', headerName: 'UserID', width: 100},
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'phoneNumber', headerName: 'Mobile Number', width: 150},
    { field: 'email', headerName: 'Email', width: 250},
    { field: 'gender', headerName: 'Gender', width: 150},
    { field: 'role', headerName: 'Role', width: 150},
    { field: 'createdAt', headerName: 'Date Created', width: 250},
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: params.value === 'Active' ? 'green' : 'red',
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton onClick={() => handleAction(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (_id) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${_id}`);
  };

  const handleDelete = (_id) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${_id}`);
  };

  const filteredUsers = users.filter((user) => {
    const userId = user._id || '';
    const name = (user.firstName || '') + ' ' + (user.lastName || '');
    const email = user.email || '';
    const mobile = user.phoneNumber || '';
    const role = user.role || '';
    const status = user.status || '';
  
    return (
      userId.toString().includes(searchValue) ||
      name.toLowerCase().includes(searchValue.toLowerCase()) ||
      email.toLowerCase().includes(searchValue.toLowerCase()) ||
      mobile.includes(searchValue) ||
      role.toLowerCase().includes(searchValue.toLowerCase()) ||
      status.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const handleModalOpen = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleModalOpen}>New User</Button>
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
      <ManageUserModal isOpen={isModalOpen} onClose={handleModalClose} onCancel={handleModalClose} />
    </div>
    </div>
  );
};

export default UserGrid;