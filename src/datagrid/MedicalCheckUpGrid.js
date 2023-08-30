import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReportIcon from '@mui/icons-material/Description';

const MedicalCheckUpGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const medicalCheckUp = [

    {
        id: 1,
        stud_id: 101,
        name: 'Ava Martinez',
        age: '12',
        gender: 'Female',
        grade: '2',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Fair',
        height: '130',
        weight: '27',
        bp: '100/70',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 2,
        stud_id: 206,
        name: 'Ethan Williams',
        age: '13',
        gender: 'Male',
        grade: '7',
        section: 'Masunurin',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Good',
        height: '140',
        weight: '35',
        bp: '110/75',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 3,
        stud_id: 207,
        name: 'Sophia Johnson',
        age: '10',
        gender: 'Female',
        grade: '4',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Fair',
        height: '125',
        weight: '28',
        bp: '105/70',
        immunization: 'Up-to-date',
        assessment: 'Need Further Evaluation'
    },

    {
        id: 4,
        stud_id: 208,
        name: 'Jackson Davis',
        age: '9',
        gender: 'Male',
        grade: '3',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Good',
        height: '120',
        weight: '25',
        bp: '100/65',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 5,
        stud_id: 209,
        name: 'Olivia Smith',
        age: '7',
        gender: 'Female',
        grade: '1',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Fair',
        height: '110',
        weight: '22',
        bp: '95/60',
        immunization: 'Up-to-date',
        assessment: 'Need Further Evaluation'
    },

    {
        id: 6,
        stud_id: 210,
        name: 'Noah Martinez',
        age: '12',
        gender: 'Male',
        grade: '6',
        section: 'Masunurin',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Good',
        height: '135',
        weight: '30',
        bp: '105/70',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },
    
    {
        id: 7,
        stud_id: 211,
        name: 'Emma Johnson',
        age: '8',
        gender: 'Female',
        grade: '2',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Fair',
        height: '115',
        weight: '24',
        bp: '100/65',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 8,
        stud_id: 212,
        name: 'Liam Davis',
        age: '9',
        gender: 'Male',
        grade: '3',
        section: 'Mabait',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Good',
        height: '120',
        weight: '26',
        bp: '100/70',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 9,
        stud_id: 213,
        name: 'Isabella Garcia',
        age: '14',
        gender: 'Female',
        grade: '8',
        section: 'Masunurin',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Good',
        height: '145',
        weight: '38',
        bp: '110/75',
        immunization: 'Up-to-date',
        assessment: 'On-Track'
    },

    {
        id: 10,
        stud_id: 214,
        name: 'Mason Smith',
        age: '15',
        gender: 'Male',
        grade: '9',
        section: 'Magalang',
        vision: 'Pass',
        hearing: 'Pass',
        oral: 'Fair',
        height: '150',
        weight: '45',
        bp: '115/80',
        immunization: 'Up-to-date',
        assessment: 'Need Further Evaluation'
    }
  ];

  const columns = [
    { field: 'stud_id', headerName: 'Stud_ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'grade', headerName: 'Grade Level', width: 150 },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'vision', headerName: 'Vision', width: 100 },
    { field: 'hearing', headerName: 'Hearing', width: 100 },
    { field: 'oral', headerName: 'Oral Health', width: 100 },
    { field: 'height', headerName: 'Height (cm)', width: 100 },
    { field: 'weight', headerName: 'Weight (kg)', width: 100 },
    { field: 'bp', headerName: 'BP', width: 100 },
    { field: 'immunization', headerName: 'Immunization Status', width: 150 },
    { field: 'assessment', headerName: 'Assessment', width: 150 },
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

  const FilteredMedicalCheckUp = medicalCheckUp.filter(user => 
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
      rows={FilteredMedicalCheckUp}
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

export default MedicalCheckUpGrid;
