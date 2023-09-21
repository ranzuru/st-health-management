import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import axiosInstance from "../config/axios-instance";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const FacultyProfileForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewFaculty,
    selectedFaculty,
    isEditing,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object().shape({
    employeeId: yup
      .string()
      .required("Employee ID is required")
      .test("check-unique", "Employee ID is already exist", async (value) => {
        if (!value) return true; // Skip validation if value is empty

        // Skip unique check if editing and the employeeId hasn't changed.
        if (
          isEditing &&
          selectedFaculty &&
          selectedFaculty.employeeId === value
        ) {
          return true;
        }

        const response = await axiosInstance.post(
          "/facultyProfile/checkEmployeeIdUnique",
          {
            employeeId: value,
          }
        );
        return response.data.isUnique;
      }),
    lastName: yup.string().required("Last Name is required"),
    firstName: yup.string().required("First Name is required"),
    middleName: yup.string(),
    gender: yup.string().required("Gender is required"),
    mobileNumber: yup
      .string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Invalid mobile number"),
    role: yup.string().required("Role is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      employeeId: "",
      lastName: "",
      firstName: "",
      middleName: "",
      gender: "",
      mobileNumber: "",
      role: "", // Set the default role as empty
    },
    resolver: yupResolver(validationSchema),
  });

  const handleCreateFaculty = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/facultyProfile/createFacultyProfiles",
        data
      );
      if (response.data && response.data.faculty) {
        const newFaculty = {
          ...response.data.faculty,
          name: `${response.data.faculty.firstName} ${response.data.faculty.lastName}`,
        };
        if (typeof addNewFaculty === "function") {
          addNewFaculty(newFaculty);
        }
        showSnackbar("Successfully added faculty profile", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding faculty profile:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding", "error");
    }
  };

  const handleUpdateFaculty = async (data) => {
    // Check if selectedFaculty is not undefined or null
    if (selectedFaculty) {
      // Check if selectedFaculty._id is not undefined or null
      if (selectedFaculty.employeeId) {
        try {
          const response = await axiosInstance.put(
            `/facultyProfile/updateFacultyProfiles/${selectedFaculty.employeeId}`,
            data
          );
          if (response.data.faculty) {
            if (typeof props.onFacultyUpdated === "function") {
              props.onFacultyUpdated(response.data);
            }
            showSnackbar("Successfully updated medicine", "success");
            handleClose();
          } else {
            showSnackbar("Update operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating medicine:", error);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedFaculty.employeeId is undefined");
        showSnackbar(
          "An error occurred, selectedFaculty.employeeId is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedFaculty is undefined");
      showSnackbar("An error occurred, selectedFaculty is undefined", "error");
    }
  };

  const handleSaveOrUpdate = (data) => {
    if (selectedFaculty && selectedFaculty.employeeId) {
      handleUpdateFaculty(data);
    } else {
      handleCreateFaculty(data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedFaculty) {
      setValue("employeeId", selectedFaculty.employeeId || "");
      setValue("lastName", selectedFaculty.lastName || "");
      setValue("firstName", selectedFaculty.firstName || "");
      setValue("middleName", selectedFaculty.middleName || "");
      setValue("gender", selectedFaculty.gender || "");
      setValue("mobileNumber", selectedFaculty.mobileNumber || "");
      setValue("role", selectedFaculty.role || "");
    }
  }, [selectedFaculty, setValue]);

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
          {selectedFaculty ? "Edit Faculty" : "Add Faculty"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Enter faculty profile details:
            </DialogContentText>
            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Employee ID"
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
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
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Middle Name"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select labelId="gender-label" label="Gender" {...field}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <FormHelperText error={!!errors.gender}>
                  {errors.gender?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Mobile Number"
                      margin="normal"
                      fullWidth
                      {...field}
                      required
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        // Use slice(0, 10) to keep only the first 10 characters
                        const numericValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        // Update the input field with the sliced value
                        field.onChange(numericValue);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+63</InputAdornment>
                        ),
                        placeholder: "995 215 5436",
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select labelId="role-label" label="Role" {...field}>
                        <MenuItem value="Adviser">Adviser</MenuItem>
                        <MenuItem value="Subject teacher">
                          Subject teacher
                        </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        {/* Add more roles as needed */}
                      </Select>
                    </FormControl>
                  )}
                />
                <FormHelperText error={!!errors.role}>
                  {errors.role?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedFaculty ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FacultyProfileForm;
