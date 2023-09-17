import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MedicineInventoryForm from "../modal/MedicineInventoryForm.js";
import axiosInstance from "../config/axios-instance.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const MedicineInventoryGrid = () => {
	const [searchValue, setSearchValue] = useState("");
	const [medicines, setMedicines] = useState([]);
	const [formOpen, setFormOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [medicineIdToDelete, setMedicineIdToDelete] = useState(null);
	const [selectedMedicine, setSelectedMedicine] = useState(null);

	// Function to open dialog
	const handleDialogOpen = (id) => {
		setMedicineIdToDelete(id);
		setDialogOpen(true);
	};

	// Function to close dialog
	const handleDialogClose = () => {
		setMedicineIdToDelete(null);
		setDialogOpen(false);
	};

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

	const addNewMedicine = (newMedicine) => {
		console.log("Adding new medicine: ", newMedicine);
		setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
	};

	const onMedicineUpdated = (updatedMedicine) => {
		const updatedMedicines = medicines.map((medicine) =>
			medicine._id === updatedMedicine._id ? updatedMedicine : medicine
		);
		setMedicines(updatedMedicines);
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
			renderCell: (params) => {
				return (
					<div>
						<IconButton onClick={() => handleEditMedicine(params.row._id)}>
							<EditIcon />
						</IconButton>
						<IconButton onClick={() => handleDialogOpen(params.row._id)}>
							<DeleteOutlineIcon />
						</IconButton>
					</div>
				);
			},
		},
	];

	const handleEditMedicine = (id) => {
		const medicineToEdit = medicines.find((medicine) => medicine._id === id);
		console.log("Editing medicine, InventoryGrid.js:", medicineToEdit);
		setSelectedMedicine(medicineToEdit);
		setFormOpen(true); // Assuming this opens the form dialog
	};

	const handleDelete = () => {
		if (medicineIdToDelete) {
			axiosInstance
				.delete(`medicineInventory/deleteMedicine/${medicineIdToDelete}`)
				.then((response) => {
					if (response.status === 200) {
						setMedicines((prevMedicines) =>
							prevMedicines.filter(
								(medicine) => medicine._id !== medicineIdToDelete
							)
						);
					} else {
						console.error("Deleting medicine failed:", response.statusText);
					}
				})
				.catch((error) => console.error("Deleting medicine failed:", error));
		}
		handleDialogClose();
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
					onMedicineAdded={addNewMedicine}
					onMedicineUpdated={onMedicineUpdated}
					selectedMedicine={selectedMedicine}
					onClose={() => {
						setSelectedMedicine(null);
						handleModalClose();
					}}
					onCancel={() => {
						setSelectedMedicine(null);
						handleModalClose();
					}}
				/>
			</div>
			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this medicine item?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default MedicineInventoryGrid;
