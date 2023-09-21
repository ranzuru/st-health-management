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

const StudentForm = (props) => {
  const { open = false, onClose, addDocument, selectedDocument } = props;
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    lrn: yup.string().required("LRN is required"),
    lastName: yup.string().required(`Learner's Name is required`),
    birthDate: yup.date().required("Birth Date is required"),
    middleName: yup.string().required("Age is required"),
    
    weight: yup.string().required("Weight is required"),
    heigh: yup.string().required("Height is required"),
    height2: yup.string().required("Height² is required"),
    bmi: yup.string().required("BMI is required"),
    bmiCategory: yup.string().required("BMI Category is required"),
    hfa: yup.string().required("Height for Age (HFA) is required"),
    remarks: yup.string().nullable(),
    type: yup.string().required("Record Type is required"),
    
    address: yup.string().required("Gender is required"),
    status: yup.string().required("Grade & Section is required"),
  });

  const handleBirthDateChange = (date) => {
    setSelectedBirthDate(date);
    setValue("birthDate", date);
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
      gender: "Male",
      type: "Baseline"
    },
  });

  const handleCreate = async (data) => {
    if (!data.remarks) {
      data.remarks = "";
    }
    try {
      const response = await axiosInstance.post("nutritional-status/post", data );
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
    if (!data.remarks) {
      data.remarks = "";
    }
    // Check if selectedMedicine is not undefined or null
    if (selectedDocument) {
      // Check if selectedMedicine._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(`student-profile/put/${selectedDocument._id}`, data);
          if (response.data.lrn) {
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
    handleBirthDateChange(null);
  };
  // useEffect to populate form fields when selectedMedicine changes
  useEffect(() => {
    if (selectedDocument) {
      setValue("lrn", selectedDocument.lrn || "");
      setValue("lastName", selectedDocument.lastName || "");
      const birthDate = new Date(selectedDocument.birthDate);
      setSelectedBirthDate(birthDate);
      setValue("firstName", selectedDocument.firstName || "");

      setValue("weight", selectedDocument.weight || "");
      setValue("height", selectedDocument.height || "");
      setValue("height2", selectedDocument.height2 || "");
      setValue("bmi", selectedDocument.bmi || "");
      setValue("bmiCategory", selectedDocument.bmiCategory || "");
      setValue("hfa", selectedDocument.hfa || "");
      setValue("remarks", selectedDocument.remarks || "");
      setValue("type", selectedDocument.type || "");

      setValue("address", selectedDocument.address || "");
      setValue("status", selectedDocument.status || "");
      
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
          {selectedDocument ? "Edit Nutritional Status Record" : "Add Nutritional Status Record"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter details:</DialogContentText>
            
            <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Grade & Section</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.gender : 'Male'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="is4p"
                        label="Grade & Section"
                        error={!!errors.gender}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.gender}>
                    {errors.gender?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Learner's Name (Last Name, First Name, Name Extension, Middle Name)</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.gender : 'Male'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="is4p"
                        label="Learner's Name (Last Name, First Name, Name Extension, Middle Name)"
                        error={!!errors.gender}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.gender}>
                    {errors.gender?.message}
                  </FormHelperText>
                </FormControl>
            <TextField
              autoFocus
              margin="normal"
              label="Learner Reference Number (LRN)"
              {...register("lrn")}
              fullWidth
              disabled
              required
              error={!!errors.lrn}
              helperText={errors.lrn?.message}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal" error={!!errors.birthDate}>
                  <DatePicker
                    label="Birth Date"
                    disabled
                    value={selectedBirthDate}
                    onChange={handleBirthDateChange}
                  />
                  <FormHelperText>
                    {errors.birthDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal" error={!!errors.age}>
                  <TextField
                    className="w-full"
                    label="Age"
                    type="number"
                    autoFocus
                    {...register("nameExtension")}
                  />
                  <FormHelperText>
                    {errors.birthDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Weight (KG)"
                    autoFocus
                    type="number"
                    step="any"
                    {...register("weight")}
                    fullWidth
                    required
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Height (M)"
                    autoFocus
                    type="number"
                    step="any"
                    {...register("height")}
                    fullWidth
                    required
                    error={!!errors.height}
                    helperText={errors.height?.message}
                  />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Height² (M²)"
                    autoFocus
                    type="number"
                    step="any"
                    {...register("height2")}
                    fullWidth
                    required
                    error={!!errors.height2}
                    helperText={errors.height2?.message}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Nutritional Status (NS): BMI (KG/M²)"
                    autoFocus
                    type="number"
                    step="any"
                    {...register("bmi")}
                    fullWidth
                    required
                    error={!!errors.bmi}
                    helperText={errors.bmi?.message}
                  />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Nutritional Status (NS): BMI Category</InputLabel>
                  <Controller
                    name="bmiCategory"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.bmiCategory : 'Male'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="is4p"
                        label="Nutritional Status (NS): BMI Category"
                        error={!!errors.bmiCategory}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.bmiCategory}>
                    {errors.bmiCategory?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
                  <TextField
                    className="w-full"
                    label="Height for Age (HFA)"
                    autoFocus
                    type="number"
                    step="any"
                    {...register("hfa")}
                    required
                  />
                  <FormHelperText error={!!errors.hfa}>
                    {errors.hfa?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid> 
            <TextField
              autoFocus
              margin="normal"
              label="Remarks"
              {...register("remarks")}
              fullWidth
              required
              error={!!errors.remarks}
              helperText={errors.remarks?.message}
            />
            <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Record Type</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.type : 'Baseline'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="type"
                        label="Record Type"
                        error={!!errors.type}
                      >
                        <MenuItem value={"Baseline"}>Baseline</MenuItem>
                        <MenuItem value={"Evaluation"}>Evaluation</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.type}>
                    {errors.type?.message}
                  </FormHelperText>
              </FormControl>

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

export default StudentForm;
