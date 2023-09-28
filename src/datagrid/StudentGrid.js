import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import StudentForm from "../modal/StudentForm.js";
import axiosInstance from "../config/axios-instance.js";

const StudentDataGrid = () => {
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
        "studentProfile/get"
      );
      const adjustedResponse = response.data.map((studentProfile) => {
        const classProfile = studentProfile.student_class.class;
        return {
          ...studentProfile,
          student_class: classProfile,
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
    const classProfile = updatedDocument.student_class 
      ? `${updatedDocument.student_class.grade} - ${updatedDocument.student_class.section} (${updatedDocument.student_class.syFrom} - ${updatedDocument.student_class.syTo})` 
      : "";

    const updatedDocuments = documents.map((document) =>
      document._id === updatedDocument._id ? {
        ...updatedDocument,
        student_class: classProfile,
      } : document
    );
    setDocuments(updatedDocuments);
  };

  const mapStudentDocument = (newDocument) => {
    const classProfile = `${newDocument.student_class.grade} - ${newDocument.student_class.section} (${newDocument.student_class.syFrom} - ${newDocument.student_class.syTo})`;
    return {
      ...newDocument,
      student_class: classProfile,
    };
  };

  const onDocumentCreate = (newDocument) => {
    const updatedDocuments = mapStudentDocument(newDocument);
    setDocuments((documents) => [...documents, updatedDocuments]);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 300 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "middleName", headerName: "Middle Name", width: 150 },
    { field: "nameExtension", headerName: "Name Extension", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "birthDate", headerName: "BirthDate", width: 100,
      valueGetter: (params) => dateFormat(params.row.birthDate),
    },
    { field: 'is4p', headerName: '4P', width: 75, renderCell: (params) => (
      <div>
        {params.value ? 'Yes' : 'No'}
      </div>
    ), },
    { field: "student_class", headerName: "Class", width: 250 },
    { field: "parentName1", headerName: "Parent 1 Name", width: 150 },
    { field: "parentMobile1", headerName: "Parent 1 Mobile", width: 150 },
    { field: "parentName2", headerName: "Parent 2 Name", width: 150 },
    { field: "parentMobile2", headerName: "Parent 2 Mobile", width: 150 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "status", headerName: "Status", width: 100,
      renderCell: (params) => {
        const assessment = params.value;
        let color = "";
        switch (assessment.toLowerCase()) {
          case "active":
            color = "green";
            break;
          case "inactive":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <span style={{ color }}>{assessment}</span>;
      }, },
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
      (document.lrn 
        ? document.lrn.toLowerCase() 
        : "").includes(searchValue) ||
      (document.lastName 
        ? document.lastName.toLowerCase() 
        : "").includes(searchValue) ||
      (document.firstName 
        ? document.firstName.toLowerCase() 
        : "").includes(searchValue) ||
      (document.middleName 
        ? document.middleName.toLowerCase() 
        : "").includes(searchValue) ||
      (document.nameExtension 
        ? document.nameExtension.toLowerCase() 
        : "").includes(searchValue) ||
      (document.gender 
        ? document.gender.toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.birthDate).toLocaleDateString() 
        ? new Date(document.birthDate).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
      (document.is4p 
        ? document.is4p.toLowerCase() 
        : "").includes(searchValue) ||
      (document.classProfile 
        ? document.classProfile.toLowerCase() 
        : "").includes(searchValue) ||
      (document.parentName1 
        ? document.parentName1.toLowerCase() 
        : "").includes(searchValue) ||
      (document.parentMobile1 
        ? document.parentMobile1.toString() 
        : "").includes(searchValue) ||
      (document.parentName2 
        ? document.parentName2.toLowerCase() 
        : "").includes(searchValue) ||
      (document.parentMobile2 
        ? document.parentMobile2.toString() 
        : "").includes(searchValue) ||
      (document.address 
        ? document.address.toLowerCase() 
        : "").includes(searchValue) ||
      (document.status 
        ? document.status.toLowerCase() 
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
          onDocumentUpdated={onDocumentUpdate}
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

export default StudentDataGrid;
