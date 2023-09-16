import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MedicineInventoryForm from "../modal/MedicineInventoryForm.js";
import axiosInstance from "../config/axios-instance.js";

const MedicineInventoryGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axiosInstance
      .get("medicineInventory/fetchMedicine")
      .then((response) => {
        setMedicines(response.data);
      })
      .catch((error) => console.error("Fetching medicine data failed:", error));
  }, []);

  const columns = [
    { field: "product", headerName: "Product", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      field: "stockLevel",
      headerName: "Stock Level",
      width: 150,
      renderCell: (params) => {
        const assessment = params.value;
        let color = "";

        switch (assessment.toLowerCase()) {
          case "high":
            color = "green";
            break;
          case "moderate":
            color = "orange";
            break;
          case "low":
            color = "red";
            break;
          default:
            color = "black";
        }

        return <span style={{ color }}>{assessment}</span>;
      },
    },
    {
      field: "expirationDate",
      headerName: "Expiration \nDate",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.expirationDate),
    },
    {
      field: "restockDate",
      headerName: "Restock Date",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.restockDate),
    },
    { field: "note", headerName: "Note", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditMedicine(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEditMedicine = (
    medicineId,
    newProductName,
    newCategory,
    newQuantity,
    newStockLevel,
    newExpirationDate,
    newRestockDate,
    newNote
  ) => {
    // Implement your action logic here
    const updatedMedicineData = {
      product: newProductName,
      category: newCategory,
      quantity: newQuantity,
      stockLevel: newStockLevel,
      expirationDate: newExpirationDate,
      restockDate: newRestockDate,
      note: newNote,
    };
    axiosInstance
      .put(
        `medicineInventory/updateMedicine/${medicineId}`,
        updatedMedicineData
      )
      .then((response) => {
        console.log("Update was successful:", response);
      })
      .catch((error) => console.error("Updating medicine failed:", error));
  };

  const handleDelete = (medicineId) => {
    axiosInstance
      .delete(`medicineInventory/deleteMedicine/${medicineId}`)
      .then((response) => {
        // TODO: Update the state or refetch the data
      })
      .catch((error) => console.error("Deleting medicine failed:", error));
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const filteredMedicine = medicines.filter(
    (medicine) =>
      medicine.product.toLowerCase().includes(searchValue.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      medicine.quantity.includes(searchValue) ||
      medicine.stockLevel.toLowerCase().includes(searchValue.toLowerCase()) ||
      medicine.expirationDate
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      medicine.restockDate.toLowerCase().includes(searchValue.toLowerCase()) ||
      medicine.note.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Medicine
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
          rows={filteredMedicine}
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
        <MedicineInventoryForm
          open={formOpen}
          onClose={handleModalClose}
          onCancel={handleModalClose}
        />
      </div>
    </div>
  );
};

export default MedicineInventoryGrid;
