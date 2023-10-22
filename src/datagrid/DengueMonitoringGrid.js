import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Description";

const DengueMonitoringGrid = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const denguePatients = [
    {
      id: 1,
      stud_id: 101,
      name: "Ava Martinez",
      age: "12",
      gender: "Female",
      grade: "2",
      section: "Mabait",
      address:
        "151 Engracia Reyes St, Ermita, Manila, Metro Manila, Philippines",
      onset: "06-24-2022",
      dateAdmission: "06-28-2022",
      hospital: "SPMC",
      discharge: "07-08-2022",
    },

    {
      id: 2,
      stud_id: 102,
      name: "Liam Tan",
      age: "11",
      gender: "Male",
      grade: "1",
      section: "Magalang",
      address: "456 Quirino Avenue, Davao City, Davao del Sur, Philippines",
      onset: "07-12-2022",
      dateAdmission: "07-15-2022",
      hospital: "Davao Regional Medical Center",
      discharge: "07-22-2022",
    },

    {
      id: 3,
      stud_id: 103,
      name: "Chloe Reyes",
      age: "13",
      gender: "Female",
      grade: "3",
      section: "Masunurin",
      address: "789 Aurora Boulevard, Quezon City, Metro Manila, Philippines",
      onset: "05-18-2022",
      dateAdmission: "05-21-2022",
      hospital: "St. Luke's Medical Center",
      discharge: "06-02-2022",
    },

    {
      id: 4,
      stud_id: 104,
      name: "Noah Santos",
      age: "10",
      gender: "Male",
      grade: "1",
      section: "Magalang",
      address: "987 Rizal Avenue, Baguio City, Benguet, Philippines",
      onset: "08-05-2022",
      dateAdmission: "08-09-2022",
      hospital: "Baguio General Hospital",
      discharge: "08-16-2022",
    },

    {
      id: 5,
      stud_id: 105,
      name: "Emma Lim",
      age: "9",
      gender: "Female",
      grade: "1",
      section: "Magalang",
      address: "123 Roxas Street, Cebu City, Cebu, Philippines",
      onset: "04-02-2022",
      dateAdmission: "04-06-2022",
      hospital: "Cebu Doctors' University Hospital",
      discharge: "04-14-2022",
    },

    {
      id: 6,
      stud_id: 106,
      name: "Oliver Cruz",
      age: "14",
      gender: "Male",
      grade: "4",
      section: "Masunurin",
      address: "234 P. Burgos Street, Iloilo City, Iloilo, Philippines",
      onset: "03-15-2022",
      dateAdmission: "03-20-2022",
      hospital: "Western Visayas Medical Center",
      discharge: "04-01-2022",
    },

    {
      id: 7,
      stud_id: 107,
      name: "Isabella Garcia",
      age: "11",
      gender: "Female",
      grade: "3",
      section: "Masunurin",
      address: "567 Katipunan Avenue, Quezon City, Metro Manila, Philippines",
      onset: "09-28-2022",
      dateAdmission: "10-02-2022",
      hospital: "Philippine Heart Center",
      discharge: "10-12-2022",
    },

    {
      id: 8,
      stud_id: 108,
      name: "James Dela Cruz",
      age: "15",
      gender: "Male",
      grade: "5",
      section: "Mabait",
      address:
        "345 Commonwealth Avenue, Quezon City, Metro Manila, Philippines",
      onset: "02-10-2022",
      dateAdmission: "02-15-2022",
      hospital: "Lung Center of the Philippines",
      discharge: "02-25-2022",
    },

    {
      id: 9,
      stud_id: 109,
      name: "Sophia Ong",
      age: "10",
      gender: "Female",
      grade: "2",
      section: "Mabait",
      address: "678 Taft Avenue, Manila, Metro Manila, Philippines",
      onset: "11-12-2022",
      dateAdmission: "11-16-2022",
      hospital: "Philippine General Hospital",
      discharge: "11-25-2022",
    },

    {
      id: 10,
      stud_id: 110,
      name: "Ethan Reyes",
      age: "13",
      gender: "Male",
      grade: "4",
      section: "Mabait",
      address:
        "789 Tomas Morato Avenue, Quezon City, Metro Manila, Philippines",
      onset: "07-24-2022",
      dateAdmission: "07-28-2022",
      hospital: "St. Luke's Medical Center",
      discharge: "08-05-2022",
    },

    {
      id: 11,
      stud_id: 111,
      name: "Mia Tan",
      age: "11",
      gender: "Female",
      grade: "3",
      section: "Magalang",
      address:
        "890 Shaw Boulevard, Mandaluyong City, Metro Manila, Philippines",
      onset: "01-14-2022",
      dateAdmission: "01-18-2022",
      hospital: "Makati Medical Center",
      discharge: "01-28-2022",
    },

    {
      id: 12,
      stud_id: 112,
      name: "William Lim",
      age: "12",
      gender: "Male",
      grade: "2",
      section: "Masunurin",
      address: "234 Aurora Boulevard, Quezon City, Metro Manila, Philippines",
      onset: "06-06-2022",
      dateAdmission: "06-10-2022",
      hospital: "St. Luke's Medical Center",
      discharge: "06-20-2022",
    },

    {
      id: 13,
      stud_id: 113,
      name: "Emma Santos",
      age: "14",
      gender: "Female",
      grade: "4",
      section: "Magalang",
      address: "456 Ayala Avenue, Makati City, Metro Manila, Philippines",
      onset: "10-08-2022",
      dateAdmission: "10-12-2022",
      hospital: "Makati Medical Center",
      discharge: "10-22-2022",
    },

    {
      id: 14,
      stud_id: 114,
      name: "Daniel Dela Cruz",
      age: "9",
      gender: "Male",
      grade: "1",
      section: "Masunurin",
      address: "567 Magsaysay Avenue, Baguio City, Benguet, Philippines",
      onset: "04-18-2022",
      dateAdmission: "04-22-2022",
      hospital: "Corazon Locsin Montelibano Memorial Regional Hospital",
      discharge: "05-01-2022",
    },

    {
      id: 15,
      stud_id: 115,
      name: "Chloe Reyes",
      age: "11",
      gender: "Female",
      grade: "3",
      section: "Mabait",
      address:
        "789 Mabini Street, Bacolod City, Negros Occidental, Philippines",
      onset: "03-05-2022",
      dateAdmission: "03-09-2022",
      hospital: "Corazon Locsin Montelibano Memorial Regional Hospital",
      discharge: "03-18-2022",
    },
  ];

  const columns = [
    { field: "stud_id", headerName: "Stud_ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "age", headerName: "Age", width: 150 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "grade", headerName: "Grade Level", width: 150 },
    { field: "section", headerName: "Section", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "onset", headerName: "Date of Onset", width: 150 },
    { field: "dateAdmission", headerName: "Date of Admission", width: 150 },
    { field: "hospital", headerName: "Hospital Admission", width: 150 },
    { field: "discharge", headerName: "Date of Discharge", width: 150 },
    {
      field: "action",
      headerName: "Action",
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

  const filteredDengue = denguePatients.filter(
    (user) =>
      user.stud_id.toString().includes(searchValue) ||
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.section.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.grade.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button variant="contained" color="secondary">
              <ReportIcon /> Generate Report
            </Button>
          </div>
          <div className="flex items-center">
            <div className="ml-2">
              <Button variant="contained" color="primary">
                Add Patients
              </Button>
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
          rows={filteredDengue}
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

export default DengueMonitoringGrid;
