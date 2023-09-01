import React, { useState } from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ClinicRecordsGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const record = [
    {
      id: 1,
      clRc_id: 1,
      stud_lrn: 129548511777,
      stud_fullName: 'John Doe',
      stud_sect: 'Matulungin',
      grd_lvl: '1',
      stud_gender: 'Male',
      clRc_reason: 'Fever',
      clRc_mdc: 'Biogesic',
      clRc_timestamp: '08/22/2023',
      clRc_note: 'None',
    }
    // ... more user data
  ];

  const columns = [
    { field: 'clRc_id', headerName: 'ID', width: 50 },
    { field: 'stud_lrn', headerName: 'Student LRN', width: 150 },
    { field: 'stud_fullName', headerName: 'Full Name', width: 250 },
    { field: 'stud_sect', headerName: 'Section', width: 125 },
    { field: 'grd_lvl', headerName: 'Grade', width: 75 },
    { field: 'stud_gender', headerName: 'Gender', width: 100 },
    { field: 'clRc_reason', headerName: 'Reason', width: 150 },
    { field: 'clRc_mdc', headerName: 'Medicine', width: 150 },
    { field: 'clRc_timestamp', headerName: 'Timestamp', width: 150 },
    { field: 'clRc_note', headerName: 'Note', width: 150 },
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

  const handleAction = (recordId) => {
    // Implement your action logic here
    console.log(`Edit Record with ID: ${recordId}`);
  };

  const handleDelete = (recordId) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${recordId}`);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const filteredUsers = record.filter(user => 
    user.clRc_id.toString().includes(searchValue) ||
    user.stud_lrn.toString().includes(searchValue) ||
    user.stud_fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.stud_sect.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.grd_lvl.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.stud_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.clRc_reason.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.clRc_mdc.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.clRc_timestamp.includes(searchValue) ||
    user.clRc_note.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary">New Record</Button>
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
      slots={{
        toolbar: CustomToolbar}}
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
    </div>
  );
};

export default ClinicRecordsGrid;