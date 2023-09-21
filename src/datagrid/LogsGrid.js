import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import axiosInstance from "../config/axios-instance.js";

const DengueDataGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [documents, setDocuments] = useState([]);

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
        "logs/get"
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

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "section", headerName: "Section", width: 150 },
    { field: "action", headerName: "Action", width: 150 },
    { field: "details", headerName: "Details", width: 300 },
    { field: "a", headerName: "User ID", width: 100 },
    { field: "b", headerName: "Full Name", width: 100 },
    { field: "createdAt", headerName: "Created",  width: 150,
      valueGetter: (params) => dateFormat(params.row.createdAt),
    },
    { field: "updatedAt", headerName: "Updated",  width: 150,
      valueGetter: (params) => dateFormat(params.row.updatedAt),
    },
  ];


  const filteredDocumentData = documents.filter((document) => {
    const lowerSearchValue = searchValue.toLowerCase();

    // Explicitly convert numeric or date fields to string before using `toLowerCase()`.
    return (
      (document.lrn?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.section?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.action?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.details?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.createdAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.updatedAt).toLocaleDateString()?.toLowerCase() || "").includes(lowerSearchValue)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
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
      </div>
    </div>
  );
};

export default DengueDataGrid;
