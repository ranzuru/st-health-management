import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MedicineInForm from "../modal/MedicineInForm.js";
import axiosInstance from "../config/axios-instance.js";

const MedicineInGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [document, setDocument] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Function to format date string to YYYY-MM-DD
  const yyyymmddDateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  // Fetch medicines when the component mounts
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get(
          "medicineInventory/getIn"
        );
        setDocument(response.data);
      } catch (error) {
        console.error("An error occurred while fetching medicines:", error);
      }
    };
    fetchDocuments();
  }, []);

  // Function to update state after a medicine item is updated
  const onDocumentUpdated = (updatedDocument) => {
    const updatedDocuments = document.map((document) =>
      document._id === updatedDocument._id ? updatedDocument : document
    );
    setDocument(updatedDocuments);
  };

  // Function to add a new medicine item
  const addNewDocument = (newDocument) => {
    setDocument([...document, newDocument]);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "itemId", headerName: "Item ID", width: 250 },
    { field: "product", headerName: "Product", width: 200 },
    { field: "expirationDate",
      headerName: "Expiration Date",
      width: 150,
      valueGetter: (params) => yyyymmddDateFormat(params.row.expirationDate),
      cellClassName: (params) => {
        const expirationDate = new Date(params.value);
        const currentDate = new Date();
        let style = {};
        // Check if expiration date is past or within a month from the current date
        if (expirationDate < currentDate) {
          style.color = "red";
        } else {
          const oneMonthFromNow = new Date();
          oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
          if (expirationDate < oneMonthFromNow) {
            style.color = "yellow";
          }
        }
        return style;
      },
    },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "batchId", headerName: "Batch ID", width: 250 },
    { field: "receiptId", headerName: "Receipt ID", width: 250 },
    { field: "note", headerName: "Note/s", width: 300 },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      valueGetter: (params) => yyyymmddDateFormat(params.row.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      width: 150,
      valueGetter: (params) => yyyymmddDateFormat(params.row.updatedAt),
    },
  ];

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const filteredDocuments = document.filter((document) => {
    const lowerSearchValue = searchValue.toLowerCase();

    // Explicitly convert numeric or date fields to string before using `toLowerCase()`.
    return (
      (document._id?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.itemId?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.product?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.expirationDate).toLocaleDateString()?.toLowerCase() || "")
        .includes(lowerSearchValue) || // Convert date to a string
      (document.quantity?.toString() || "").includes(searchValue) || // convert to string
      (document.batchId?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.receiptId?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.note?.toLowerCase() || "").includes(lowerSearchValue) ||
      (new Date(document.createdAt).toLocaleDateString()?.toLowerCase() || "")
        .includes(lowerSearchValue) || // Convert date to a string
      (new Date(document.updatedAt).toLocaleDateString()?.toLowerCase() || "")
      .includes(lowerSearchValue) // Convert date to a string
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            Add Medicine Stock
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
          rows={filteredDocuments}
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
        <MedicineInForm
          open={formOpen}
          addNewDocument={addNewDocument}
          onDocumentUpdated={onDocumentUpdated}
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

export default MedicineInGrid;
