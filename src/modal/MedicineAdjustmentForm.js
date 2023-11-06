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
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const MedicineAdjustmentForm = (props) => {
  const { open = false, onClose, addNewDocument} = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    itemId: yup.string().required("Item ID is required"),
    batchId: yup.string().required("Batch ID is required"),
    type: yup.string().required("Type is required"),
    quantity: yup.number().required("Quantity is required"),
    reason: yup.string().required("Reason/s is required"),
    
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
      quantity: 1,
      reason: "",
    },
  });

  const handleCreate = async (data) => {
    try {
      let itemData, inData, disposalData, adjustmentData;
      try {
        itemData = await axiosInstance.get(`medicineInventory/getItem/${data.itemId}`);
      } catch (error) {
        if (error.response?.data?.error === "Record not found") {
          showSnackbar("Operation failed: Item ID mismatch", "error");
          return;
        }
      }
      
      try {
        inData = await axiosInstance.get(`medicineInventory/getInBatchId/${data.batchId}`);
        disposalData = await axiosInstance.get(`medicineInventory/getDisposalBatchId/${data.batchId}`);
        adjustmentData = await axiosInstance.get(`medicineInventory/getAdjustmentBatchId/${data.batchId}`);
      } catch (error) {
        showSnackbar("Operation failed: Batch ID mismatch", "error");
        return;
      }
      
      let oldOverallQuantity, presentDisposalQuantity, updatedOverallQuantity, batchOverallQuantity, disposalTotal, inQuantity, additionAdjustmentTotal, subtractionAdjustmentTotal;

      oldOverallQuantity = itemData.data.overallQuantity
      presentDisposalQuantity = data.quantity;
      inQuantity = inData.data.quantity;
      disposalTotal = disposalData.data.disposalTotal || 0;
      additionAdjustmentTotal = adjustmentData.data.additionTotal || 0;
      subtractionAdjustmentTotal = adjustmentData.data.subtractionTotal || 0;

      if (data.type === "Addition") {
        updatedOverallQuantity = presentDisposalQuantity + oldOverallQuantity;
      } else if (data.type === "Subtraction") {
        const presentBatchFormula = () => {
          // PRESENT BATCH QTY WITHOUT DISPOSAL TOTAL
          // in + total addition adjustment - total subtraction adjustment
          // in + total addition adjustment
          // in - total subtraction adjustment
          const adjustedAndIn = inQuantity + additionAdjustmentTotal - subtractionAdjustmentTotal;
          // PRESENT BATCH QTY WITH DISPOSAL TOTAL
          // (in + total addition adjustment - total subtraction adjustment) - previous disposal/s
          // (in + total addition adjustment) - previous disposal/s
          // (in - total subtraction adjustment) - previous disposal/s
          return Math.abs(adjustedAndIn - disposalTotal);
        };
        
        const updatedOverallFormula = () => {
          // present disposal - old overall
          return Math.abs(presentDisposalQuantity - oldOverallQuantity);
        };
        
        // check if the present disposal is less than the current batch overall
        // (present disposal - (PRESENT BATCH QTY WITHOUT DISPOSAL TOTAL) - old overall
        // (present disposal - (PRESENT BATCH QTY WITH DISPOSAL TOTAL) - old overall
        const isOperationValid = (presentBatchQuantity) => {
          if (presentDisposalQuantity <= presentBatchQuantity) {
            updatedOverallQuantity = updatedOverallFormula();
          } else {
            showSnackbar(`Operation Failed: Disposal Quantity (${presentDisposalQuantity}) > Batch Quantity (${presentBatchQuantity})`, "error");
          }
        };
        
        if (!disposalTotal) {
          if (!additionAdjustmentTotal && !subtractionAdjustmentTotal) {
            if (presentDisposalQuantity <= inQuantity) {
              isOperationValid(inQuantity);
            } else {
              showSnackbar(`Operation Failed: Disposal Quantity (${presentDisposalQuantity}) > Batch Quantity (${inQuantity})`, "error");
            }
          } else {
            batchOverallQuantity = presentBatchFormula();
            isOperationValid(batchOverallQuantity);
          }
        } else {
          batchOverallQuantity = Math.abs(inQuantity - disposalTotal);
          isOperationValid(batchOverallQuantity);
        }
  
      } else {
        showSnackbar("Operation failed: Adjustment options must be Addition and Subtraction", "error");
        return;
      }

      // Update the medicine item with the new overall quantity
      await axiosInstance.put(`medicineInventory/putItem/${data.itemId}`, {
        overallQuantity: updatedOverallQuantity,
      });
      const response = await axiosInstance.post(
        "medicineInventory/postAdjustment",
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
          {"Medicine Stock Adjustment"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <DialogContentText>Enter medicine stock adjustment record details:</DialogContentText>
            
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
              <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Quantity (Medicine)"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin="normal">
                  <InputLabel id="type-label">Adjustment Type</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue={'Addition'}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="type-label"
                        id="type"
                        label="Adjustment Type"
                        error={!!errors.type}
                      >
                        <MenuItem value={"Addition"}>Addition</MenuItem>
                        <MenuItem value={"Subtraction"}>Subtraction</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.type}>
                    {errors.type?.message}
                  </FormHelperText>
              </FormControl>
              </Grid>
            </Grid>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Reason/s"
                  fullWidth
                  required
                  margin="normal"
                  {...field}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
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

export default MedicineAdjustmentForm;