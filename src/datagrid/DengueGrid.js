import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DengueForm from "../modal/DengueForm.js";
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
        "dengue-monitoring/get"
      );
      setDocuments(response.data);
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
    const updatedDocuments = documents.map((document) =>
      document._id === updatedDocument._id ? updatedDocument : document
    );
    setDocuments(updatedDocuments);
  };

  // Function to add a new medicine item
  const onDocumentCreate = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "a", headerName: "Name of Pupil", width: 150 },
    { field: "b", headerName: "Age", width: 100 },
    { field: "c", headerName: "Grade & Section", width: 100 },
    { field: "d", headerName: "Adviser", width: 100 },
    { field: "e", headerName: "Address", width: 100 },
    
    { field: "onsetDate", headerName: "Date of Onset", width: 150,
      valueGetter: (params) => dateFormat(params.row.birthDate),
    },
    { field: "admissionDate", headerName: "Date of Admission", width: 150,
      valueGetter: (params) => dateFormat(params.row.birthDate),
    },
    { field: "admissionHospital", headerName: "Hospital of Admission", width: 100 },
    { field: "dischargeDate", headerName: "Date of Discharge", width: 150,
      valueGetter: (params) => dateFormat(params.row.birthDate),
    },
    { field: "createdAt", headerName: "Created",  width: 150,
      valueGetter: (params) => dateFormat(params.row.createdAt),
    },
    { field: "updatedAt", headerName: "Updated",  width: 150,
      valueGetter: (params) => dateFormat(params.row.updatedAt),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
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

  const filteredDocumentData = documents.filter((document) => {
    const lowerSearchValue = searchValue.toLowerCase();

    // Explicitly convert numeric or date fields to string before using `toLowerCase()`.
    return (
      (document.lrn?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.lastName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.firstName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.middleName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.nameExtension?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.gender?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.onsetDate).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.admissionDate).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.admissionHospital?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.dischargeDate).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.parentMobile2?.toString() || "").includes(searchValue) ||
      (new Date(document.createdAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.updatedAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Dengue Case Record
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
        <DengueForm
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

export default DengueDataGrid;
