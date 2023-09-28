import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import StudentForm from "../modal/DengueForm.js";
import axiosInstance from "../config/axios-instance.js";

const DengueDataGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [documents, setDocuments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Function to format date string to YYYY-MM-DD
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(
        "dengueProfile/get"
      );
      const adjustedResponse = response.data.map((data) => {
        const student_data = data.student_data.lrn;
        const student = `${data.student_data.lastName}, ${data.student_data.firstName} ${data.student_data.nameExtension} ${data.student_data.middleName}` ;
        const gradeSection = `${data.class_data.grade} - ${data.class_data.section}`;
        const sy = `${data.class_data.syFrom} - ${data.class_data.syTo}`;
        const class_data = data.class_data._id;
        const adviser_data = data.adviser_data._id;
        const adviser = `${data.adviser_data.lastName}, ${data.adviser_data.firstName}`;
        const address = data.student_data.address;
        return {
          ...data,
          student_data: student_data,
          student: student,
          gradeSection: gradeSection,
          class_data: class_data,
          sy: sy,
          adviser_data: adviser_data,
          adviser: adviser,
          address: address,
        };
      });
      setDocuments(adjustedResponse);
    } catch (error) {
      console.error("Fetching data error:", error);
    }
  };

  // Fetch medicines when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to update state after a medicine item is updated
  const onDocumentUpdate = (updatedDocument) => {
    const gradeSection = updatedDocument.class_data 
      ? `${updatedDocument.class_data.grade} - ${updatedDocument.class_data.section}` 
      : "";

    const updatedDocuments = documents.map((document) =>
      document._id === updatedDocument._id ? {
        ...updatedDocument,
        gradeSection: gradeSection,
      } : document
    );
    setDocuments(updatedDocuments);
  };

  const mapStudentDocument = (newDocument) => {
    const gradeSection = `${newDocument.class_data.grade} - ${newDocument.class_data.section}`;
    const sy = `${newDocument.class_data.syFrom} - ${newDocument.class_data.syTo}`;
    return {
      ...newDocument,
      gradeSection: gradeSection, sy
    };
  };

  const onDocumentCreate = (newDocument) => {
    const updatedDocuments = mapStudentDocument(newDocument);
    setDocuments((documents) => [...documents, updatedDocuments]);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "student_data", headerName: "LRN ", width: 250 },
    { field: "student", headerName: "Name of Pupil", width: 250 },
    { field: "student_age", headerName: "Age", width: 70 },
    { field: "gradeSection", headerName: "Grade & Section", width: 200 },
    { field: "sy", headerName: "School Year", width: 150 },
    { field: "adviser", headerName: "Adviser", width: 200 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "onsetDate", headerName: "Date of Onset", width: 150,
      valueGetter: (params) => dateFormat(params.row.onsetDate),
    },
    { field: "admissionDate", headerName: "Date of Admission", width: 150,
      valueGetter: (params) => dateFormat(params.row.admissionDate),
    },
    { field: "admissionHospital", headerName: "Hospital of Admission", width: 300 },
    { field: "dischargeDate", headerName: "Date of Discharge", width: 150,
      valueGetter: (params) => dateFormat(params.row.dischargeDate),
    },
    { field: "createdAt", headerName: "Created",  width: 100,
      valueGetter: (params) => dateFormat(params.row.createdAt),
    },
    { field: "updatedAt", headerName: "Updated",  width: 100,
      valueGetter: (params) => dateFormat(params.row.updatedAt),
    },
    {
      field: "action",
      headerName: "Action",
      width: 70,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => handleEditDocument(params.row._id)}>
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleEditDocument = (id) => {
    const editDocument = documents.find((document) => document._id === id);
    setSelectedDocument(editDocument);
    setFormOpen(true); // Assuming this opens the form dialog
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const filteredDocumentData = documents.filter((document) => 
    (
      (document.student_data 
        ? document.student_data.toLowerCase() 
        : "").includes(searchValue) ||
      (document.student 
        ? document.student.toLowerCase() 
        : "").includes(searchValue) ||
      (document.age 
        ? document.age 
        : "").includes(searchValue) ||
      (document.gradeSection 
        ? document.gradeSection.toLowerCase() 
        : "").includes(searchValue) ||
      (document.sy 
        ? document.sy 
        : "").includes(searchValue) ||
      (document.adviser 
        ? document.adviser.toLowerCase() 
        : "").includes(searchValue) ||
      (document.address 
        ? document.address.toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.onsetDate).toLocaleDateString() 
        ? new Date(document.onsetDate).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
        (new Date(document.admissionDate).toLocaleDateString() 
        ? new Date(document.admissionDate).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
        (new Date(document.dischargeDate).toLocaleDateString() 
        ? new Date(document.dischargeDate).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
      (document.admissionHospital 
        ? document.admissionHospital.toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.createdAt).toLocaleDateString() 
        ? new Date(document.createdAt).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.updatedAt).toLocaleDateString() 
        ? new Date(document.updatedAt).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue)
    )
  );

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Student Profile
          </Button>
          <div className="ml-2">
            <TextField
              label="Search"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <DataGrid
          getRowId={(row) => row._id}
          rows={filteredDocumentData}
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
        <StudentForm
          open={formOpen}
          addDocument={onDocumentCreate}
          updatedDocument={onDocumentUpdate}
          selectedDocument={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
        />
      </div>
    </div>
  );
};

export default DengueDataGrid;
