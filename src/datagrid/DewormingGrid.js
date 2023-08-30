import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReportIcon from '@mui/icons-material/Description';

const DewormingGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const dewormedPatients = [
        {
            id: 1,
            stud_id: 101,
            name: 'Ava Martinez',
            age: '12',
            gender: 'Female',
            grade: '2',
            section: 'Mabait',
            fourps: 'Yes',
            dewormed: 'No'
        },
        {
            id: 2,
            stud_id: 102,
            name: 'Liam Johnson',
            age: '11',
            gender: 'Male',
            grade: '3',
            section: 'Mabait',
            fourps: 'Yes',
            dewormed: 'Yes'
        },
        {
            id: 3,
            stud_id: 103,
            name: 'Sophia Davis',
            age: '10',
            gender: 'Female',
            grade: '4',
            section: 'Mabait',
            fourps: 'No',
            dewormed: 'Yes'
        },
        {
            id: 4,
            stud_id: 104,
            name: 'Noah Johnson',
            age: '9',
            gender: 'Male',
            grade: '1',
            section: 'Mabait',
            fourps: 'Yes',
            dewormed: 'No'
        },
        {
            id: 5,
            stud_id: 105,
            name: 'Olivia Garcia',
            age: '8',
            gender: 'Female',
            grade: '2',
            section: 'Mabait',
            fourps: 'Yes',
            dewormed: 'Yes'
        },
        {
            id: 6,
            stud_id: 201,
            name: 'Noah Smith',
            age: '13',
            gender: 'Male',
            grade: '7',
            section: 'Masunurin',
            fourps: 'Yes',
            dewormed: 'Yes'
        },
        {
            id: 7,
            stud_id: 202,
            name: 'Emma Johnson',
            age: '14',
            gender: 'Female',
            grade: '8',
            section: 'Masunurin',
            fourps: 'Yes',
            dewormed: 'No'
        },
        {
            id: 8,
            stud_id: 203,
            name: 'Jackson Lee',
            age: '12',
            gender: 'Male',
            grade: '6',
            section: 'Masunurin',
            fourps: 'Yes',
            dewormed: 'Yes'
        },
        {
            id: 9,
            stud_id: 204,
            name: 'Sophia Brown',
            age: '11',
            gender: 'Female',
            grade: '5',
            section: 'Masunurin',
            fourps: 'No',
            dewormed: 'No'
        },
        {
            id: 10,
            stud_id: 205,
            name: 'Liam Davis',
            age: '10',
            gender: 'Male',
            grade: '4',
            section: 'Masunurin',
            fourps: 'Yes',
            dewormed: 'Yes'
        },
        {
            id: 11,
            stud_id: 206,
            name: 'Ethan Williams',
            age: '13',
            gender: 'Male',
            grade: '7',
            section: 'Masunurin',
            fourps: 'Yes',
            dewormed: 'No'
        }
  ];

  const columns = [
    { field: 'stud_id', headerName: 'Stud_ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'grade', headerName: 'Grade Level', width: 150 },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'fourps', headerName: '4P\'s Member', width: 100 },
    { field: 'dewormed', headerName: 'Dewormed', width: 100 },
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

  const FilterDewormed = dewormedPatients.filter(user => 
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
      rows={FilterDewormed}
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

export default DewormingGrid;
