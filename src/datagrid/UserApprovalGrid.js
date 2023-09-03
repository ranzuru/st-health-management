import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ManageUserModal from '../modal/ManageUserModal.js'

const UserApprovalGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const users = [
    {
    _id: 1,
    user_id: 'U101',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '123-456-7890',
    role: 'Admin',
    status: 'Active',
    },
    {
    _id: 2,
    user_id: 'U102',
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '987-654-3210',
    role: 'User',
    status: 'Inactive',
    },
     
   {
    _id: 3,
    user_id: 'U103',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    mobile: '555-123-4567',
    role: 'User',
    status: 'Active',
    },

    {
    _id: 4,
    user_id: 'U104',
    name: 'Emily Williams',
    email: 'emily@example.com',
    mobile: '777-555-8888',
    role: 'Admin',
    status: 'Active',
    },

    {
    _id: 5,
    user_id: 'U105',
    name: 'Daniel Brown',
    email: 'daniel@example.com',
    mobile: '444-222-1111',
    role: 'User',
    status: 'Inactive',
    },

    {
      _id: 6,
      user_id: 'U106',
      name: 'Sophia Miller',
      email: 'sophia@example.com',
      mobile: '999-888-7777',
      role: 'Admin',
      status: 'Active'
    },
    // ... more user data
  ];

  const columns = [
    { field: '_id', headerName: 'UserID', width: 100},
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'email', headerName: 'Email', width: 250},
    { field: 'mobile', headerName: 'Mobile Number', width: 150},
    { field: 'role', headerName: 'Role', width: 150},
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

  const filteredUsers = users.filter(user => 
    user.user_id.toString().includes(searchValue) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.mobile.includes(searchValue) ||
    user.role.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.status.toLowerCase().includes(searchValue.toLowerCase())
  );

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
      />
      <ManageUserModal isOpen={isModalOpen} onClose={handleModalClose} onCancel={handleModalClose} />
    </div>
    </div>
  );
};

export default UserApprovalGrid;