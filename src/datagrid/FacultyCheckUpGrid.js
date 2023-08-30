import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReportIcon from '@mui/icons-material/Description';

const FacultyCheckUpGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const facultyCheckUp = [

        {
            id: 1,
            faculty_id: 201,
            name: 'Sam Miguel',
            age: '28',
            gender: 'Male',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Fair',
            blood_sugar: '90',
            bp: '100/70',
            assessment: 'Best'
        },
        {
            id: 2,
            faculty_id: 202,
            name: 'Lisa Anderson',
            age: '35',
            gender: 'Female',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '95',
            bp: '110/75',
            assessment: 'Best'
        },
        {
            id: 3,
            faculty_id: 203,
            name: 'John Smith',
            age: '42',
            gender: 'Male',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '110',
            bp: '120/80',
            assessment: 'Fair'
        },
        {
            id: 4,
            faculty_id: 204,
            name: 'Emily Davis',
            age: '30',
            gender: 'Female',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Fair',
            blood_sugar: '95',
            bp: '105/70',
            assessment: 'Poor'
        },
        {
            id: 5,
            faculty_id: 205,
            name: 'Michael Johnson',
            age: '38',
            gender: 'Male',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '100',
            bp: '110/75',
            assessment: 'Best'
        },
        {
            id: 6,
            faculty_id: 206,
            name: 'Sara Martinez',
            age: '29',
            gender: 'Female',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '95',
            bp: '100/65',
            assessment: 'Best'
        },
        {
            id: 7,
            faculty_id: 207,
            name: 'David Williams',
            age: '45',
            gender: 'Male',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Fair',
            blood_sugar: '110',
            bp: '130/85',
            assessment: 'Poor'
        },
        {
            id: 8,
            faculty_id: 208,
            name: 'Julia Garcia',
            age: '33',
            gender: 'Female',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '95',
            bp: '105/70',
            assessment: 'Best'
        },
        {
            id: 9,
            faculty_id: 209,
            name: 'Daniel Johnson',
            age: '39',
            gender: 'Male',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Good',
            blood_sugar: '105',
            bp: '120/80',
            assessment: 'Fair'
        },
        {
            id: 10,
            faculty_id: 210,
            name: 'Maria Smith',
            age: '31',
            gender: 'Female',
            vision: 'Pass',
            hearing: 'Pass',
            oral: 'Fair',
            blood_sugar: '100',
            bp: '110/75',
            assessment: 'Poor'
        }
    
  ];

  const columns = [
    { field: 'faculty_id', headerName: 'Faculty_ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'vision', headerName: 'Vision', width: 100 },
    { field: 'hearing', headerName: 'Hearing', width: 100 },
    { field: 'oral', headerName: 'Oral Health', width: 100 },
    { field: 'blood_sugar', headerName: 'Blood Sugar (mg/dL)', width: 100 },
    { field: 'bp', headerName: 'BP', width: 100 },
    { field: 'assessment', 
      headerName: 'Assessment', 
      width: 150,
      renderCell: (params) => {
        const assessment = params.value;
        let color = '';
    
        switch (assessment.toLowerCase()) {
          case 'best':
            color = 'green';
            break;
          case 'fair':
            color = 'orange';
            break;
          case 'poor':
            color = 'red';
            break;
          default:
            color = 'black';
        }
    
        return (
          <span style={{ color }}>
            {assessment}
          </span>
        );
      },
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

  const FilteredFacultyCheckUp = facultyCheckUp.filter(user => 
    user.faculty_id.toString().includes(searchValue) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.assessment.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-between items-center">
       <div>
       <Button variant="contained" color="secondary">
        <ReportIcon /> Generate Report
        </Button>
        </div>
        <div className="flex items-center">
        <div className="ml-2">
       <Button variant="contained" color="primary">Add Patients</Button>
          </div>
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
      </div>
      <DataGrid 
      rows={FilteredFacultyCheckUp}
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
    </div>
  );
};

export default FacultyCheckUpGrid;
