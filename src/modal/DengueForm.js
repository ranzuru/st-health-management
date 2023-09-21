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

const DengueForm = (props) => {
  const { open = false, onClose, addDocument, selectedDocument } = props;
  const [selectedOnsetDate, setSelectedOnsetDate] = useState(null);
  const [selectedAdmissionDate, setSelectedAdmissionDate] = useState(null);
  const [selectedDischargeDate, setSelectedDischargeDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    onsetDate: yup.date().required("Date of Onset is required"),
    admissionDate: yup.date().nullable(),
    admissionHospital: yup.string().nullable(),
    dischargeDate: yup.date().nullable(),
  });

  const handleOnsetDateChange = (date) => {
    setSelectedOnsetDate(date);
    setValue("onsetDate", date);
  };
  const handleAdmissionDateChange = (date) => {
    setSelectedAdmissionDate(date);
    setValue("admissionDate", date);
  };
  const handleDischargeDateChange = (date) => {
    setSelectedDischargeDate(date);
    setValue("dischargeDate", date);
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
    defaultValues: {},
  });

  const handleCreate = async (data) => {
    if (!data.onsetDate) {
      data.onsetDate = "";
    }
    if (!data.admissionDate) {
      data.admissionDate = "";
    }
    if (!data.dischargeDate) {
      data.dischargeDate = "";
    }
    try {
      const response = await axiosInstance.post("dengue-monitoring/post", data );
      if (response.data._id) {
        if (typeof addDocument === "function") {
          addDocument(response.data);
        }
        showSnackbar("Successfully added", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding data:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding data", "error");
    }
  };

  const handleUpdate = async (data) => {
    if (!data.onsetDate) {
      data.onsetDate = "";
    }
    if (!data.admissionDate) {
      data.admissionDate = "";
    }
    if (!data.dischargeDate) {
      data.dischargeDate = "";
    }
    // Check if selectedMedicine is not undefined or null
    if (selectedDocument) {
      // Check if selectedMedicine._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(`dengue-monitoring/put/${selectedDocument._id}`, data);
          if (response.data._id) {
            if (typeof props.onDocumentUpdated === "function") {
              props.onDocumentUpdated(response.data);
            }
            showSnackbar("Successfully updated", "success");
            handleClose();
          } else {
            showSnackbar("Operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating data:", error);
          showSnackbar("An error occurred during updating data", "error");
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
    handleOnsetDateChange(null);
    handleAdmissionDateChange(null);
    handleDischargeDateChange(null);
  };
  // useEffect to populate form fields when selectedMedicine changes
  useEffect(() => {
    if (selectedDocument) {
      const onsetDate = new Date(selectedDocument.onsetDate);
      setSelectedOnsetDate(onsetDate);
      const admissionDate = new Date(selectedDocument.admissionDate);
      setSelectedAdmissionDate(admissionDate);
      setValue("admissionHospital", selectedDocument.admissionHospital || "");
      const dischargeDate = new Date(selectedDocument.dischargeDate);
      setSelectedDischargeDate(dischargeDate);
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
          {selectedDocument ? "Edit Dengue Case Record" : "Add Dengue Case Record"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter details:</DialogContentText>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
              <InputLabel id="category-label">Grade & Section</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={
                  selectedDocument ? selectedDocument.status : ''
                }
                rules={{ required: true }}
                render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  id="status"
                  label="Grade & Section"
                  error={!!errors.category}
                >
                <MenuItem value={"Active"}>Active</MenuItem>
                </Select>
                )}
                />
                <FormHelperText error={!!errors.status}>
                  {errors.status?.message}
                </FormHelperText>
            </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
              <InputLabel id="category-label">Adviser</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={
                  selectedDocument ? selectedDocument.status : ''
                }
                rules={{ required: true }}
                render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  id="status"
                  label="Adviser"
                  error={!!errors.category}
                >
                <MenuItem value={"Active"}>Active</MenuItem>
                </Select>
                )}
                />
                <FormHelperText error={!!errors.status}>
                  {errors.status?.message}
                </FormHelperText>
            </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}></Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
              <InputLabel id="category-label">Name of Pupil</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={
                  selectedDocument ? selectedDocument.status : ''
                }
                rules={{ required: true }}
                render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  id="status"
                  label="Name of Pupil"
                  error={!!errors.category}
                >
                <MenuItem value={"Active"}>Active</MenuItem>
                </Select>
                )}
                />
                <FormHelperText error={!!errors.status}>
                  {errors.status?.message}
                </FormHelperText>
            </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
              <InputLabel id="category-label">Age</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={
                  selectedDocument ? selectedDocument.status : ''
                }
                rules={{ required: true }}
                render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  id="status"
                  label="Age"
                  error={!!errors.category}
                >
                <MenuItem value={"Active"}>Active</MenuItem>
                </Select>
                )}
                />
                <FormHelperText error={!!errors.status}>
                  {errors.status?.message}
                </FormHelperText>
            </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}></Grid>
            <TextField
              autoFocus
              margin="normal"
              label="Address"
              {...register("firstName")}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            /> 
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} className="flex items-center">
              <FormControl fullWidth margin="normal" error={!!errors.onsetDate}>
                  <DatePicker
                    label="Date of Onset"
                    required
                    value={selectedOnsetDate}
                    onChange={handleOnsetDateChange}
                  />
                  <FormHelperText>
                    {errors.onsetDate?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!errors.admissionDate}>
                  <DatePicker
                    label="Date of Admission"
                    value={selectedAdmissionDate}
                    onChange={handleAdmissionDateChange}
                  />
                  <FormHelperText>
                    {errors.admissionDate?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!errors.dischargeDate}>
                  <DatePicker
                    label="Date of Discharge"
                    value={selectedDischargeDate}
                    onChange={handleDischargeDateChange}
                  />
                  <FormHelperText>
                    {errors.dischargeDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              autoFocus
              margin="normal"
              label="Hospital of Admission"
              {...register("admissionHospital")}
              fullWidth
              required
              error={!!errors.admissionHospital}
              helperText={errors.admissionHospital?.message}
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

export default DengueForm;
