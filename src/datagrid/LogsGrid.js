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
  const dateTimeFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    let  hours = String(date.getHours()).padStart(2, "0"); // Add leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Add leading zero if needed
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Add leading zero if needed
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    return `${month}/${day}/${year} - ${hours}:${minutes}:${seconds} ${ampm} `;
  };

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get("log/get");
      const adjustedResponse = response.data.map((document) => {
        const userId = document.user_data ? document.user_data._id || "N/A" : "N/A";
  const userSpecifics = document.user_data
    ? `[${document.user_data.role}] ${document.user_data.lastName}, ${document.user_data.firstName}` || "[N/A] N/A"
    : "[N/A] N/A";

        return {
          ...document,
          userId: userId,
          userSpecifics: userSpecifics,
        };
      });
      setDocuments(adjustedResponse);
      const sortedDocuments = adjustedResponse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Fetching data error:", error);
    }
  };

  // Fetch medicines when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  const columns = [
    { field: "_id", headerName: "Log ID", width: 250 },
    { field: "userId", headerName: "User ID", width: 100 },
    { field: "userSpecifics", headerName: "[Role] Name", width: 300 },
    { field: "section", headerName: "Section", width: 250 },
    { field: "action", headerName: "Action", width: 150,
      valueGetter: (params) => params.row.action,
      cellClassName: (params) => {
        const action = params.value;
      
        switch (action) {
          case "CREATE":
            return 'text-green-500';
          case "RETRIEVE":
            return 'text-yellow-500';
          case "UPDATE":
            return 'text-blue-500';
          case "DELETE":
            return 'text-red-500';
          default:
            return '';
        }
      },
    },
    { field: "details", headerName: "Details", width: 300 },
    { field: "createdAt", headerName: "Created",  width: 200,
      valueGetter: (params) => dateTimeFormat(params.row.createdAt),
    },
    { field: "updatedAt", headerName: "Updated",  width: 200,
      valueGetter: (params) => dateTimeFormat(params.row.updatedAt),
    },
  ];


  const filteredDocumentData = documents.filter((document) => {
    const lowerSearchValue = searchValue.toLowerCase();

    // Explicitly convert numeric or date fields to string before using `toLowerCase()`.
    return (
      (document._id?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.section?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.action?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.details?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.userId?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.userSpecifics?.toLowerCase() || "").includes(lowerSearchValue) ||
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