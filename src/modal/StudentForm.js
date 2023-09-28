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
  const { open = false, onClose, initialData, addDocument, selectedDocument } = props;
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const [classOption, setClassOption] = useState([]);
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
    student_class: yup.string().required("Class is required"),
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
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      lrn: "", 
      lastName: "", 
      firstName: "", 
      middleName: "", 
      nameExtension: "", 
      gender: "", 
      birthDate: "", 
      is4p: "", 
      parentName1: "", 
      parentMobile1: "", 
      parentName2: "", 
      parentMobile2: "", 
      address: "", 
      status: "", 
      student_class: "", 
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchClassProfiles = async () => {
      try {
        const response = await axiosInstance.get(
          "/classProfile/fetchClassProfile"
        );
        if (response.data) {
          // Map advisers to options for the dropdown
          const options = response.data.map((data) => ({
            value: data._id, // Use the unique identifier for the value
            class: `${data.grade} - ${data.section} (${data.syFrom} - ${data.syTo})`, // Display name
          }));
          setClassOption(options);
        }
      } catch (error) {
        console.error("An error occurred while fetching class profiles:", error);
      }
    };

    fetchClassProfiles();
  }, []);

  const handleCreate = async (data) => {
    try {
      const response = await axiosInstance.post("studentProfile/post", data);
      if (response.data && response.data._id) {
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
        showSnackbar(error.response.data.error || "An error occurred during adding data", "error");
      } else {
        showSnackbar("An error occurred during adding data", "error");
      }
    }
  };

  const handleUpdate = async (data) => {
    // Check if selectedDocument is not undefined or null
    if (selectedDocument) {
      // Check if selectedDocument._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(`studentProfile/put/${selectedDocument._id}`, data);
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
          if (error.response && error.response.data) {
            console.error("Server responded with:", error.response.data);
            showSnackbar(error.response.data.error || "An error occurred during updating data", "error");
          } else {
            showSnackbar("An error occurred during updating data", "error");
          }
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
    try {
      if (selectedDocument && selectedDocument._id) {
        handleUpdate(data);
      } else {
        handleCreate(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdate", error);
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
      const selectedClassId = classOption.find(
        (option) => option.class === selectedDocument.student_class
      )?.value;

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
      setValue("student_class", selectedClassId || "");
    }

    if (!selectedDocument) {
      setValue("status", "Active");
      setValue("gender", "Male");
      setValue("is4p", "false");
    }
  }, [selectedDocument, setValue, classOption]);

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
            
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="lrn"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Learner Reference Number (LRN)"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.lrn}
                      helperText={errors.lrn?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      required
                      error={!!errors.status}
                    >
                      <InputLabel>Status</InputLabel>
                      <Select label="Status" {...field}>
                          <MenuItem value={"Active"}>Active</MenuItem>
                          <MenuItem value={"Inactive"}>Inactive</MenuItem>
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="First Name"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Middle Name"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.middleName}
                      helperText={errors.middleName?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <Controller
                  name="nameExtension"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Name Extension"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={!!errors.nameExtension}
                      helperText={errors.nameExtension?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      required
                      error={!!errors.gender}
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select label="Gender" {...field}>
                          <MenuItem value={"Male"}>Male</MenuItem>
                          <MenuItem value={"Female"}>Female</MenuItem>
                      </Select>
                      {errors.gender && (
                        <FormHelperText>{errors.gender.message}</FormHelperText>
                      )}
                    </FormControl>
                    )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="is4p"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      required
                      error={!!errors.is4p}
                    >
                      <InputLabel>4P</InputLabel>
                      <Select label="4P" {...field}>
                          <MenuItem value={"true"}>Yes</MenuItem>
                          <MenuItem value={"false"}>No</MenuItem>
                      </Select>
                      {errors.is4p && (
                        <FormHelperText>{errors.is4p.message}</FormHelperText>
                      )}
                    </FormControl>
                    )}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <FormControl 
                    fullWidth 
                    required
                    margin="normal" 
                    error={!!errors.birthDate}>
                      <DatePicker
                        label="Birth Date"
                        value={selectedBirthDate}
                        onChange={(birthDate) => field.onChange(birthDate)} 
                      />
                      <FormHelperText>
                        {errors.birthDate?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="student_class"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.student_class}
                >
                  <InputLabel id="class-label">Class</InputLabel>
                  <Select 
                  labelId="class-label" 
                  label="Class" 
                  {...field}
                  >
                    {classOption.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.class}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.faculty && (
                    <FormHelperText>{errors.student_class.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentName1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent 1 Name"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.parentName1}
                      helperText={errors.parentName1?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <Controller
                  name="parentMobile1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent 1 Mobile"
                      fullWidth
                      margin="normal"
                      required
                      {...field}
                      error={!!errors.parentMobile1}
                      helperText={errors.parentMobile1?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentName2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent 2 Name"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={!!errors.parentName2}
                      helperText={errors.parentName2?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <Controller
                  name="parentMobile2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent 2 Mobile"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={!!errors.parentMobile2}
                      helperText={errors.parentMobile2?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.address}
                  helperText={errors.address?.message}
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

export default StudentForm;
