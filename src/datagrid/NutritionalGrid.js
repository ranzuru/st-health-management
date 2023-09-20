import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import NutritionalForm from "../modal/NutritionalForm.js";
import axiosInstance from "../config/axios-instance.js";

const NutritionalDataGrid = () => {
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
        "nutritional-status/get"
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
    { field: "_id", headerName: "ID", width: 200 },
    { field: "a", headerName: "LRN ", width: 200 },
    { field: "b", headerName: `Learner's Name`, width: 200 },
    { field: "birthDate", headerName: "BirthDate", width: 150,
      valueGetter: (params) => dateFormat(params.row.birthDate),
    },
    { field: "c", headerName: "Age ", width: 100 },

    { field: "weight", headerName: "Weight (KG)", width: 100 },
    { field: "height", headerName: "Height (M)", width: 100 },
    { field: "height2", headerName: "Height² (M²)", width: 100 },
    { field: "bmi", headerName: "NS: BMI (KG/M²)", width: 150 },
    { field: "bmiCategory", headerName: "NS: BMI Category", width: 150 },
    { field: "hfa", headerName: "HFA", width: 100 },
    { field: "remarks", headerName: "Remarks", width: 200 },
    { field: "type", headerName: "Type", width: 150 },

    { field: "d", headerName: "Gender", width: 150 },
    { field: "e", headerName: "Grade & Section", width: 200 },

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
      (document._id?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.a?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.bmi?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.birthDate).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.d?.toString() || "").includes(lowerSearchValue) ||
      
      (document.weight?.toString() || "").includes(searchValue) ||
      (document.height?.toString() || "").includes(searchValue) ||
      (document.height2?.toString() || "").includes(searchValue) ||
      (document.bmi?.toString() || "").includes(searchValue) ||
      (document.bmiCategory?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.hfa?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.remarks?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.type?.toLowerCase() || "").includes(lowerSearchValue) ||

      (document.d?.toString() || "").includes(searchValue) ||
      (document.e?.toString() || "").includes(searchValue) ||

      (new Date(document.createdAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.updatedAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Nutritional Status Record
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
        <NutritionalForm
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

export default NutritionalDataGrid;
