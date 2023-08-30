import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReportIcon from '@mui/icons-material/Description';

const FeedingGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const feedingPatients = [
        {
            id: 1,
            stud_id: 101,
            name: 'Ava Martinez',
            age: '12',
            gender: 'Female',
            grade: '2',
            section: 'Mabait',
            height: '128',
            weight: '29',
            fourps: 'Yes',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        },
        {
            id: 2,
            stud_id: 102,
            name: 'Liam Johnson',
            age: '11',
            gender: 'Male',
            grade: '3',
            section: 'Mabait',
            height: '135',
            weight: '32',
            fourps: 'Yes',
            nut_status: 'Wasted',
            eligible_feeding: 'Yes'
        },
        {
            id: 3,
            stud_id: 103,
            name: 'Sophia Davis',
            age: '10',
            gender: 'Female',
            grade: '4',
            section: 'Mabait',
            height: '140',
            weight: '28',
            fourps: 'No',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        },
        {
            id: 4,
            stud_id: 104,
            name: 'Noah Johnson',
            age: '9',
            gender: 'Male',
            grade: '1',
            section: 'Mabait',
            height: '118',
            weight: '23',
            fourps: 'Yes',
            nut_status: 'Severely Wasted',
            eligible_feeding: 'Yes'
        },
        {
            id: 5,
            stud_id: 105,
            name: 'Olivia Garcia',
            age: '8',
            gender: 'Female',
            grade: '4',
            section: 'Mabait',
            height: '110',
            weight: '20',
            fourps: 'Yes',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        },
        {
            id: 6,
            stud_id: 201,
            name: 'Noah Smith',
            age: '13',
            gender: 'Male',
            grade: '7',
            section: 'Masunurin',
            height: '142',
            weight: '34',
            fourps: 'Yes',
            nut_status: 'Wasted',
            eligible_feeding: 'Yes'
        },
        {
            id: 7,
            stud_id: 202,
            name: 'Emma Johnson',
            age: '14',
            gender: 'Female',
            grade: '8',
            section: 'Masunurin',
            height: '150',
            weight: '38',
            fourps: 'Yes',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        },
        {
            id: 8,
            stud_id: 203,
            name: 'Jackson Lee',
            age: '12',
            gender: 'Male',
            grade: '6',
            section: 'Masunurin',
            height: '136',
            weight: '30',
            fourps: 'Yes',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        },
        {
            id: 9,
            stud_id: 204,
            name: 'Sophia Brown',
            age: '11',
            gender: 'Female',
            grade: '5',
            section: 'Masunurin',
            height: '130',
            weight: '27',
            fourps: 'No',
            nut_status: 'Severely Wasted',
            eligible_feeding: 'Yes'
        },
        {
            id: 10,
            stud_id: 205,
            name: 'Liam Davis',
            age: '10',
            gender: 'Male',
            grade: '4',
            section: 'Masunurin',
            height: '124',
            weight: '25',
            fourps: 'Yes',
            nut_status: 'Normal',
            eligible_feeding: 'No'
        }
  ];

  const columns = [
    { field: 'stud_id', headerName: 'Stud_ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'grade', headerName: 'Grade Level', width: 150 },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'height', headerName: 'Height (cm)', width: 100 },
    { field: 'weight', headerName: 'Weight (kg)', width: 100 },
    { field: 'fourps', headerName: '4\'s', width: 100 },
    { field: 'nut_status', headerName: 'Nutritional Status', width: 150 },
    { field: 'eligible_feeding', headerName: 'Eligible for Feeding', width: 150 },
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

  const FilteredFeeding = feedingPatients.filter(user => 
    user.stud_id.toString().includes(searchValue) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.section.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.grade.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.gender.toLowerCase().includes(searchValue.toLowerCase())
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
      rows={FilteredFeeding}
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

export default FeedingGrid;
