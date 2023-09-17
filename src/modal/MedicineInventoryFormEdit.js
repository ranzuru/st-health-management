import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import axiosInstance from "../config/axios-instance.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

const MedicineInventoryFormEdit = ({
	open = false,
	onClose,
	initialData,
	onMedicineUpdated,
}) => {
	const [selectedExpirationDate, setSelectedExpirationDate] = useState(null);
	const [selectedRestockDate, setSelectedRestockDate] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [snackbarData, setSnackbarData] = useState({
		message: "",
		severity: "success",
	});

	const validationSchema = yup.object().shape({
		productName: yup.string().required("Product name is required"),
		category: yup.string().required("Category is required"),
		quantity: yup
			.number()
			.min(1, "Quantity must be at least 1")
			.required("Quantity is required"),
		expirationDate: yup
			.date()
			.min(new Date(), "Expiration date must be in the future")
			.required("Expiration date is required"),
		restockDate: yup.date().required("Restock date is required"),
		note: yup.string().nullable(),
	});

	const handleExpirationDateChange = (date) => {
		setSelectedExpirationDate(date);
		setValue("expirationDate", date);
	};

	const handleRestockDateChange = (date) => {
		setSelectedRestockDate(date);
		setValue("restockDate", date);
	};

	const showSnackbar = (message, severity) => {
		setSnackbarData({ message, severity });
		setSnackbarOpen(true);
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			category: "First Aid",
			quantity: 1,
		},
	});

	useEffect(() => {
		if (initialData) {
			// Populate form fields with initial data
			for (const [key, value] of Object.entries(initialData)) {
				setValue(key, value);
			}
			setSelectedExpirationDate(initialData.expirationDate);
			setSelectedRestockDate(initialData.restockDate);
		}
	}, [initialData, setValue]);

	const handleUpdate = async (data) => {
		setIsLoading(true);
		try {
			// Make an HTTP PUT or PATCH request to update existing data
			const response = await axiosInstance.put(
				`medicineInventory/updateMedicine/${initialData._id}`,
				data
			);
			if (response.data.product) {
				onMedicineUpdated(response.data);
				showSnackbar("Successfully updated medicine", "success");
				handleClose();
			} else {
				showSnackbar("Update failed", "error");
			}
			return response.data;
		} catch (error) {
			console.error("An error occurred during medicine update:", error);
			showSnackbar("An error occurred during update", error);
		}
		setIsLoading(false);
	};

	const handleClose = () => {
		reset();
		onClose();
		handleExpirationDateChange(null);
		handleRestockDateChange(null);
	};

	return (
		<>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{
					vertical: "top", // Position at the top
					horizontal: "center", // Position at the center horizontally
				}}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
					{snackbarData.message}
				</Alert>
			</Snackbar>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add Medicine</DialogTitle>
				<form onSubmit={handleSubmit(handleUpdate)}>
					<DialogContent>
						<DialogContentText>Enter medicine details:</DialogContentText>
						<TextField
							autoFocus
							margin="normal"
							label="Product Name"
							{...register("productName")}
							fullWidth
							required
							error={!!errors.productName}
							helperText={errors.productName?.message}
						/>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} className="flex items-center">
								<FormControl fullWidth required margin="normal">
									<InputLabel id="category-label">Category</InputLabel>
									<Select
										labelId="category-label"
										id="category"
										label="Category"
										defaultValue="First Aid"
										{...register("category")}
										error={!!errors.category}
									>
										<MenuItem value={"First Aid"}>First Aid</MenuItem>
										<MenuItem value={"Pain Relief"}>Pain Relief</MenuItem>
										<MenuItem value={"Cold & Flu"}>Cold & Flu</MenuItem>
										<MenuItem value={"Allergy"}>Allergy</MenuItem>
										<MenuItem value={"Digestive Health"}>
											Digestive Health
										</MenuItem>
										<MenuItem value={"Vitamins & Supplements"}>
											Vitamins & Supplements
										</MenuItem>
										<MenuItem value={"Skin Care"}>Skin Care</MenuItem>
										<MenuItem value={"Eye Care"}>Eye Care</MenuItem>
										<MenuItem value={"Respiratory"}>Respiratory</MenuItem>
										<MenuItem value={"Other"}>Other</MenuItem>
									</Select>
									<FormHelperText error={!!errors.category}>
										{errors.category?.message}
									</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6} className="flex items-center">
								<FormControl error={!!errors.quantity}>
									<TextField
										className="w-full"
										margin="normal"
										label="Quantity"
										type="number"
										{...register("quantity")}
										fullWidth
										required
										inputProps={{ min: "1", step: "1" }}
									/>
									<FormHelperText>{errors.quantity?.message}</FormHelperText>
								</FormControl>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<FormControl error={!!errors.expirationDate}>
									<DatePicker
										label="Expiration Date"
										value={selectedExpirationDate}
										onChange={handleExpirationDateChange}
									/>
									<FormHelperText>
										{errors.expirationDate?.message}
									</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl error={!!errors.restockDate}>
									<DatePicker
										label="Restock Date"
										value={selectedRestockDate}
										onChange={handleRestockDateChange}
									/>
									<FormHelperText>{errors.restockDate?.message}</FormHelperText>
								</FormControl>
							</Grid>
						</Grid>
						<TextField
							margin="normal"
							label="Note"
							{...register("note")}
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary" disabled={isLoading}>
							{isLoading ? <CircularProgress size={24} /> : "Save"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
};

export default MedicineInventoryFormEdit;
