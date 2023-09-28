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
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";

const MedicineInventoryForm = (props) => {
  const { open = false, onClose, addNewMedicine, selectedMedicine } = props;
  const [selectedExpirationDate, setSelectedExpirationDate] = useState(null);
  const [selectedRestockDate, setSelectedRestockDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    product: yup.string().required("Product name is required"),
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
    control,
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

  const handleCreate = async (data) => {
    if (!data.note) {
      data.note = "None";
    }
    try {
      const response = await axiosInstance.post(
        "medicineInventory/createMedicine",
        data
      );
      if (response.data.product) {
        if (typeof addNewMedicine === "function") {
          addNewMedicine(response.data);
        }
        showSnackbar("Successfully added medicine", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding medicine:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding", "error");
    }
  };

  const handleUpdate = async (data) => {
    if (!data.note) {
      data.note = "None";
    }
    // Check if selectedMedicine is not undefined or null
    if (selectedMedicine) {
      // Check if selectedMedicine._id is not undefined or null
      if (selectedMedicine._id) {
        try {
          const response = await axiosInstance.put(
            `medicineInventory/updateMedicine/${selectedMedicine._id}`,
            data
          );
          if (response.data.product) {
            if (typeof props.onMedicineUpdated === "function") {
              props.onMedicineUpdated(response.data);
            }
            showSnackbar("Successfully updated medicine", "success");
            handleClose();
          } else {
            showSnackbar("Operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating medicine:", error);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedMedicine._id is undefined");
        showSnackbar(
          "An error occurred, selectedMedicine._id is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedMedicine is undefined");
      showSnackbar("An error occurred, selectedMedicine is undefined", "error");
    }
  };
  // Function to handle Save or Update operation
  const handleSaveOrUpdate = (data) => {
    if (selectedMedicine && selectedMedicine._id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  // Function to close the dialog and reset form values
  const handleClose = () => {
    reset();
    onClose();
    handleExpirationDateChange(null);
    handleRestockDateChange(null);
  };
  // useEffect to populate form fields when selectedMedicine changes
  useEffect(() => {
    if (selectedMedicine) {
      setValue("product", selectedMedicine.product || "");
      setValue("category", selectedMedicine.category || "");
      setValue("quantity", selectedMedicine.quantity || "");
      setValue("expirationDate", selectedMedicine.expirationDate || "");
      setValue("restockDate", selectedMedicine.restockDate || "");
      setValue("note", selectedMedicine.note || "");

      const expDate = new Date(selectedMedicine.expirationDate);
      const restockDate = new Date(selectedMedicine.restockDate);

      setSelectedExpirationDate(expDate);
      setSelectedRestockDate(restockDate);
    }
  }, [selectedMedicine, setValue]);

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
        <DialogTitle>
          {selectedMedicine ? "Edit Medicine" : "Add Medicine"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter medicine details:</DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              label="Product Name"
              {...register("product")}
              fullWidth
              required
              error={!!errors.product}
              helperText={errors.product?.message}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={
                      selectedMedicine ? selectedMedicine.category : "First Aid"
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="category"
                        label="Category"
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
                    )}
                  />
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
            <Button type="submit" color="primary">
              {selectedMedicine ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MedicineInventoryForm;
