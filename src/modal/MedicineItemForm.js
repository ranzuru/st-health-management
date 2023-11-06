import { useState, useEffect } from "react";
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
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const MedicineItemForm = (props) => {
  const { open = false, onClose, addNewDocument, selectedDocument, initialData } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    product: yup.string().required("Product (Name) is required"),
    description: yup.string().required("Description is required"),
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      product: "",
      overallQuantity: 0,
      description: "",
    },
  });

  const handleCreate = async (data) => {
    try {
      const response = await axiosInstance.post(
        "medicineInventory/postItem",
        data
      );
      if (response.data._id) {
        if (typeof addNewDocument === "function") {
          addNewDocument(response.data);
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
    // Check if selectedDocument is not undefined or null
    if (selectedDocument) {
      // Check if selectedDocument._id is not undefined or null
      if (selectedDocument._id) {
        try {
          
          const response = await axiosInstance.put(
            `medicineInventory/putItem/${selectedDocument._id}`,
            data
          );
          if (response.data) {
            if (typeof props.onDocumentUpdated === "function") {
              props.onDocumentUpdated(response.data);
            }
            showSnackbar("Successfully updated", "success");
            handleClose();
          } else {
            showSnackbar("Operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating:", error);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedDocument._id is undefined");
        showSnackbar(
          "An error occurred, selectedDocument._id is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedDocument is undefined");
      showSnackbar("An error occurred, selectedDocument is undefined", "error");
    }
  };
  
  // Function to handle Save or Update operation
  const handleSaveOrUpdate = (data) => {
    if (selectedDocument && selectedDocument._id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  // Function to close the dialog and reset form values
  const handleClose = () => {
    reset();
    onClose();
  };
  // useEffect to populate form fields when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      setValue("product", selectedDocument.product || "");
      setValue("description", selectedDocument.description || "");
      setValue("overallQuantity", selectedDocument.overallQuantity.toString() || "");
    }
  }, [selectedDocument, setValue]);

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
          {selectedDocument ? "Edit Medicine Item" : "Add Medicine Item"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter medicine item details:</DialogContentText>
            
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Product (Name)"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.product}
                  helperText={errors.product?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="overallQuantity"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Overall Quantity"
                  fullWidth
                  margin="normal"
                  {...field}
                  disabled
                  type="number"
                  error={!!errors.overallQuantity}
                  helperText={errors.overallQuantity?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.description}
                  helperText={errors.description?.message}
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
              {selectedDocument ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MedicineItemForm;