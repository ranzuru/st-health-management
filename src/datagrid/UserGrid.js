import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UserGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '123-456-7890',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '987-654-3210',
      role: 'User',
      status: 'Inactive',
    },
     
   {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael@example.com',
    mobile: '555-123-4567',
    role: 'User',
    status: 'Active',
    },

    {
    id: 4,
    name: 'Emily Williams',
    email: 'emily@example.com',
    mobile: '777-555-8888',
    role: 'Admin',
    status: 'Active',
    },

    {
    id: 5,
    name: 'Daniel Brown',
    email: 'daniel@example.com',
    mobile: '444-222-1111',
    role: 'User',
    status: 'Inactive',
    },

    {
    id: 6,
    name: 'Sophia Miller',
    email: 'sophia@example.com',
    mobile: '999-888-7777',
    role: 'Admin',
    status: 'Active',
    },

    {
    id: 7,
    name: 'William Martinez',
    email: 'william@example.com',
    mobile: '333-444-5555',
    role: 'User',
    status: 'Inactive',
    },

    {
    id: 8,
    name: 'Olivia Davis',
    email: 'olivia@example.com',
    mobile: '666-777-8888',
    role: 'Admin',
    status: 'Active',
    },

    {
    id: 9,
    name: 'James Anderson',
    email: 'james@example.com',
    mobile: '111-222-3333',
    role: 'User',
    status: 'Active',
    },

    {
    id: 10,
    name: 'Ava Wilson',
    email: 'ava@example.com',
    mobile: '888-999-0000',
    role: 'Admin',
    status: 'Inactive',
    },

    {
    id: 11,
    name: 'Liam Thomas',
    email: 'liam@example.com',
    mobile: '555-666-7777',
    role: 'User',
    status: 'Active',
    },

    {
    id: 12,
    name: 'Emma Lee',
    email: 'emma@example.com',
    mobile: '111-333-5555',
    role: 'Admin',
    status: 'Active',
  },

  {
    id: 13,
    name: 'Noah Garcia',
    email: 'noah@example.com',
    mobile: '222-333-4444',
    role: 'User',
    status: 'Inactive',
 },

 {
    id: 14,
    name: 'Isabella Taylor',
    email: 'isabella@example.com',
    mobile: '888-777-6666',
    role: 'Admin',
    status: 'Active',
 },

 {
    id: 15,
    name: 'Mason White',
    email: 'mason@example.com',
    mobile: '444-555-6666',
    role: 'User',
    status: 'Active',
 },

 {
    id: 16,
    name: 'Sophia Adams',
    email: 'sophiaa@example.com',
    mobile: '111-222-4444',
    role: 'Admin',
    status: 'Inactive',
 },

 {
    id: 17,
    name: 'Liam Robinson',
    email: 'liamr@example.com',
    mobile: '777-888-9999',
    role: 'User',
    status: 'Active',
 },

 {
    id: 18,
    name: 'Ava Mitchell',
    email: 'ava.mitchell@example.com',
    mobile: '555-444-3333',
    role: 'Admin',
    status: 'Active',
 },

 {
    id: 19,
    name: 'Jackson Young',
    email: 'jackson@example.com',
    mobile: '222-111-5555',
    role: 'User',
    status: 'Inactive',
 },

 {
    id: 20,
    name: 'Olivia Turner',
    email: 'oliviat@example.com',
    mobile: '999-888-7777',
    role: 'Admin',
    status: 'Active',
 }
    // ... more user data
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'mobile', headerName: 'Mobile Number', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
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
    user.id.toString().includes(searchValue) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.mobile.includes(searchValue) ||
    user.role.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.status.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <div style={{ height: 500, width: '100%' }}>
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary">New User</Button>
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
    </div>
  );
};

export default UserGrid;
