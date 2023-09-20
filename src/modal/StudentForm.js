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
    lastName: yup.string().required("Last Name is required"),
    firstName: yup.string().required("First Name is required"),
    middleName: yup.string().required("Middle Name is required"),
    nameExtension: yup.string().nullable(),
    gender: yup.string().required("Gender is required"),
    birthDate: yup.date().required("Birth Date is required"),
    is4p: yup.string().required("4P is required"),
    parentName1: yup.string().required("Parent 1 Name is required"),
    parentMobile1: yup.string().required("Parent 1 Mobile is required"),
    parentName2: yup.string().nullable(),
    parentMobile2: yup.string().nullable(),
    address: yup.string().required("Address is required"),
    status: yup.string().required("Status is required"),
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
      is4p: false,
      status: "Active"
    },
  });

  const handleCreate = async (data) => {
    if (!data.nameExtension) {
      data.nameExtension = "";
    }
    if (!data.parentName2) {
      data.parentName2 = "None";
    }
    if (!data.parentMobile2) {
      data.parentMobile2 = "None";
    }
    try {
      const response = await axiosInstance.post("student-profile/post", data );
      if (response.data.lrn) {
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
    if (!data.nameExtension) {
      data.nameExtension = "";
    }
    if (!data.parentName2) {
      data.parentName2 = "None";
    }
    if (!data.parentMobile2) {
      data.parentMobile2 = "None";
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
      setValue("firstName", selectedDocument.firstName || "");
      setValue("middleName", selectedDocument.middleName || "");
      setValue("nameExtension", selectedDocument.nameExtension || "");
      setValue("gender", selectedDocument.gender || "");
      setValue("is4p", selectedDocument.is4p || "");
      setValue("parentName1", selectedDocument.parentName1 || "");
      setValue("parentMobile1", selectedDocument.parentMobile1 || "");
      setValue("parentName2", selectedDocument.parentName2 || "");
      setValue("parentMobile2", selectedDocument.parentMobile2 || "");
      setValue("address", selectedDocument.address || "");
      setValue("status", selectedDocument.status || "");
      const birthDate = new Date(selectedDocument.birthDate);
      setSelectedBirthDate(birthDate);
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
          {selectedDocument ? "Edit Student Profile" : "Add Student Profile"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter details:</DialogContentText>
            
            <TextField
              autoFocus
              margin="normal"
              label="Learner Reference Number (LRN)"
              {...register("lrn")}
              fullWidth
              required
              error={!!errors.lrn}
              helperText={errors.lrn?.message}
            />
            <TextField
              autoFocus
              margin="normal"
              label="Last Name"
              {...register("lastName")}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              autoFocus
              margin="normal"
              label="First Name"
              {...register("firstName")}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            /> 
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Middle Name"
                    autoFocus
                    {...register("middleName")}
                    fullWidth
                    required
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Name Extension"
                    autoFocus
                    {...register("nameExtension")}
                    fullWidth
                    error={!!errors.nameExtension}
                    helperText={errors.nameExtension?.message}
                  />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Gender</InputLabel>
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
                        label="Gender"
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
                  <InputLabel id="category-label">4P</InputLabel>
                  <Controller
                    name="is4p"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.is4p : 'false'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="is4p"
                        label="4P"
                        error={!!errors.is4p}
                      >
                        <MenuItem value={"true"}>Yes</MenuItem>
                        <MenuItem value={"false"}>No</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.is4p}>
                    {errors.is4p?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth error={!!errors.birthDate}>
                  <DatePicker
                    label="Birth Date"
                    value={selectedBirthDate}
                    onChange={handleBirthDateChange}
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
                    label="Parent 1 Name"
                    autoFocus
                    {...register("parentName1")}
                    fullWidth
                    required
                    error={!!errors.parentName1}
                    helperText={errors.parentName1?.message}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Parent 1 Mobile #"
                    autoFocus
                    placeholder= '9952155436'
                    {...register("parentMobile1")}
                    fullWidth
                    required
                    error={!!errors.parentMobile1}
                    helperText={errors.parentMobile1?.message}
                  />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Parent 2 Name"
                    autoFocus
                    {...register("parentName2")}
                    fullWidth
                    error={!!errors.parentName2}
                    helperText={errors.parentName2?.message}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                  <TextField
                    className="w-full"
                    margin="normal"
                    label="Parent 2 Mobile #"
                    autoFocus
                    placeholder= '9952155436'
                    {...register("parentMobile2")}
                    fullWidth
                    error={!!errors.parentMobile2}
                    helperText={errors.parentMobile2?.message}
                  />
              </Grid>
            </Grid>
            <TextField
              autoFocus
              margin="normal"
              label="Address"
              {...register("address")}
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address?.message}
            /> 
            <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Status</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.status : 'Active'
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="status"
                        label="Status"
                        error={!!errors.category}
                      >
                        <MenuItem value={"Active"}>Active</MenuItem>
                        <MenuItem value={"Inactive"}>Inactive</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.status}>
                    {errors.status?.message}
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
