import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axiosInstance from "../config/axios-instance.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const MedicineInForm = (props) => {
  const { open = false, onClose, addNewDocument} = props;
  const [documentData, setDocumentData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    product: yup.string().required("Product (Name) is required"),
    note: yup.string().required("Description is required"),
    overallQuantity: yup.string().required("Overall Quantity is required"),
  });

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: "",
      note: "",
    },
  });

  // Function to fetch product based on item ID
  const fetchDocumentByItemId = async (itemId) => {
    try {
      const response = await axiosInstance.get(`medicineInventory/getItem/${itemId}`); // Replace with your endpoint
      setDocumentData(response.data); // Assuming response contains product data
    } catch (error) {
      console.error("An error occurred while fetching product:", error);
      // Handle the error accordingly (e.g., show an error message)
    }
  };

  // Event handler for Item ID change
  const handleItemIdChange = (event) => {
    const itemId = event.target.value;
    fetchDocumentByItemId(itemId);
  };

  const handleCreate = async (data) => {
    try {
      const response = await axiosInstance.post(
        "medicineInventory/postIn",
        data
      );
      if (response.data._id) {
        if (typeof addNewDocument === "function") {
          addNewDocument(response.data);
        }
        showSnackbar("Successfully added", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding", "error");
    }
  };

  // Function to close the dialog and reset form values
  const handleClose = () => {
    reset();
    onClose();
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
        <DialogTitle>
          {"Add Medicine Stock"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <DialogContentText>Enter medicine stock in record details:</DialogContentText>
            
            <Controller
              name="itemId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Item ID"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.itemId}
                  helperText={errors.itemId?.message}
                  onBlur={field.onBlur}
                  onChange={handleItemIdChange}
                />
              )}
            />
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Product (Name)"
                  fullWidth
                  margin="normal"
                  {...field}
                  disabled
                  value={documentData ? documentData.product : ''}
                  error={!!errors.product}
                  helperText={errors.product?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="batchId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Batch ID"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.batchId}
                  helperText={errors.batchId?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="receiptId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Receipt ID"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.receiptId}
                  helperText={errors.receiptId?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
              <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Quantity"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  type="number"
                  inputProps={{ min: "1", step: "1" }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
              </Grid>
              <Grid item xs={12} sm={6}>
              <Controller
              name="expirationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Expiration Date"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.expirationDate}
                  helperText={errors.expirationDate?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
              </Grid>
            </Grid>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Note/s"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.note}
                  helperText={errors.note?.message}
                  onBlur={field.onBlur}
                />
              )}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {"Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MedicineInForm;
