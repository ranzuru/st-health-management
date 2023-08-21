import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const FacultyProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const faculty = [
    {
        id: 201,
        name: 'John Johnson',
        mobile: '555-123-4567',
        adviser: 'Yes',
        section: 'Magalang',
        grade: '1',
        gender: 'Male',
        status: 'Active'
      },
     
      {
        id: 202,
        name: 'Sarah Davis',
        mobile: '777-888-9999',
        adviser: 'Yes',
        section: 'Masunurin',
        grade: '1',
        gender: 'Female',
        status: 'Active'
      },
     
       {
        id: 203,
        name: 'Michael Miller',
        mobile: '444-555-6666',
        adviser: 'No',
        section: null,
        grade: null,
        gender: 'Male',
        status: 'Active'
      },
     
       {
        id: 204,
        name: 'Emily Martinez',
        mobile: '111-222-3333',
        adviser: 'Yes',
        section: 'Mabait',
        grade: '2',
        gender: 'Female',
        status: 'Active'
      },
     
      {
        id: 205,
        name: 'Daniel Anderson',
        mobile: '888-999-0000',
        adviser: 'No',
        section: null,
        grade: null,
        gender: 'Male',
        status: 'Active'
      },
     
      {
        id: 206,
        name: 'Olivia Wilson',
        mobile: '333-444-5555',
        adviser: 'Yes',
        section: 'Magalang',
        grade: '2',
        gender: 'Female',
        status: 'Active'
      },
     
      {
        id: 207,
        name: 'William Taylor',
        mobile: '666-777-8888',
        adviser: 'No',
        section: null,
        grade: null,
        gender: 'Male',
        status: 'Active'
      },
     
      {
        id: 208,
        name: 'Sophia Brown',
        mobile: '222-333-4444',
        adviser: 'Yes',
        section: 'Masunurin',
        grade: '2',
        gender: 'Female',
        status: 'Active'
      },
     
      {
        id: 209,
        name: 'James Lee',
        mobile: '999-000-1111',
        adviser: 'Yes',
        section: 'Masunurin',
        grade: '3',
        gender: 'Male',
        status: 'Active'
      },
     
      {
         id: 210,
         name: 'Isabella Taylor',
         mobile: '444-555-6666',
         adviser: 'No',
         section: null,
         grade: null,
         gender: 'Female',
         status: 'Active'
      },
     
      {
         id: 211,
         name: 'David Johnson',
         mobile: '111-222-3333',
         adviser: 'Yes',
         section: 'Mabait',
         grade: '3',
         gender: 'Male',
         status: 'Active'
      },
     
      {
         id: 212,
         name: 'Ava Martinez',
         mobile: '888-999-0000',
         adviser: 'No',
         section: null,
         grade: null,
         gender: 'Female',
         status: 'Active'
      }
     
    // ... more user data
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile Number', width: 150 },
    { field: 'adviser', headerName: 'Adviser', width: 150 },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'grade', headerName: 'Grade Level', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
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

  const filteredFaculty = faculty.filter(user => 
    user.id.toString().includes(searchValue) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.mobile.includes(searchValue) ||
    user.section.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.grade.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.status.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <div style={{ height: 500, width: '100%' }}>
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary">Add Faculty</Button>
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
      />
    </div>
  );
};

export default FacultyProfileGrid;
