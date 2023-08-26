import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

const LogsGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const log = [
    {
      id: 1,
      log_id: 1,
      user_id: 51249,
      user_lName: 'Dela Cruz',
      log_category: 'Access',
      log_section: 'Medicine Inventory',
      log_timestamp: '08/22/2023',
      log_sum: 'Visited Medicine Inventory',
    }
    // ... more user data
  ];

  const columns = [
    { field: 'log_id', headerName: 'ID', width: 100 },
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'user_lName', headerName: 'Full Name', width: 200 },
    { field: 'log_category', headerName: 'Action', width: 150 },
    { field: 'log_section', headerName: 'Section', width: 200 },
    { field: 'log_timestamp', headerName: 'Timestamp', width: 150 },
    { field: 'log_sum', headerName: 'Summary', width: 300 },
  ];

  const filteredUsers = log.filter(user => 
    user.log_id.toString().includes(searchValue) ||
    user.user_id.toString().includes(searchValue) ||
    user.user_lName.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.log_category.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.log_section.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.log_timestamp.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.log_sum.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  return (
    <div style={{ height: 500, width: '100%' }}>
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
      />
    </div>
  );
};

export default LogsGrid;