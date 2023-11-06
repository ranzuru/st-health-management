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
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios-instance";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO } from "date-fns";

const StudentProfileForm = (props) => {
  const {
    open = false,
    onClose,
    initialData,
    addNewStudent,
    selectedStudent,
    isEditing,
    onUpdate,
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

  const minDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 100)
  );
  const maxDate = new Date();

  const validationSchema = yup.object().shape({
    lrn: yup
      .string()
      .required("LRN is required")
      .test("check-unique", "LRN already exists", async (value) => {
        if (!value) return true; // Skip validation if value is empty

        if (isEditing && selectedStudent && selectedStudent.lrn === value) {
          return true;
        }

        // Replace the following line with your real check logic.
        const response = await axiosInstance.post(
          "/studentProfile/checkLRNUnique",
          {
            lrn: value,
          }
        );

        return response.data.isUnique;
      }),

    lastName: yup
      .string()
      .required("Last Name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    middleName: yup.string(),
    nameExtension: yup.string(),
    gender: yup.string().required("Gender is required"),
    birthDate: yup
      .date()
      .required("Birth Date is required")
      .min(minDate, "You can't be more than 100 years old")
      .max(maxDate, "You can't be born in the future"),
    age: yup.number(),
    is4p: yup.boolean().required("is4p is required"),
    parentName1: yup
      .string()
      .required("Parent Name 1 is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    parentContact1: yup
      .string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Invalid mobile number"),
    parentName2: yup
      .string()
      .nullable()
      .test("only-letters", "Only letters are allowed", function (value) {
        if (!value) return true; // Skip if empty, null, or undefined
        return /^[A-Za-z\s]+$/.test(value);
      }),

    parentContact2: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .test("valid-number", "Invalid mobile number", function (value) {
        if (!value) return true; // Skip if empty, null, or undefined
        return /^\d{10}$/.test(value);
      }),

    address: yup.string().required("Address is required"),
  });

  const {
    handleSubmit,
    control,
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
      birthDate: null,
      age: "",
      is4p: "",
      parentName1: "",
      parentContact1: "",
      parentName2: "",
      parentContact2: "",
      address: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const handleCreateStudent = async (data) => {
    try {
      const response = await axiosInstance.post("/studentProfile/create", data);
      if (response.data && response.data.newStudent) {
        const { lastName, firstName, middleName, nameExtension } = data;
        const formattedName = `${lastName}, ${firstName} ${
          middleName ? middleName.charAt(0) + ". " : ""
        }${nameExtension}`.trim();
        let enrichedNewStudent = {
          ...response.data.newStudent,
          name: formattedName,
        };
        if (typeof addNewStudent === "function") {
          addNewStudent(enrichedNewStudent);
        }
        showSnackbar("Successfully added student profile", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during adding", "error");
      }
    }
  };

  const handleUpdateStudent = async (data) => {
    if (selectedStudent) {
      if (selectedStudent.lrn) {
        try {
          const response = await axiosInstance.put(
            `/studentProfile/update/${selectedStudent.lrn}`,
            data
          );
          if (response.data && response.data.updatedStudent) {
            const { lastName, firstName, middleName, nameExtension } = data;
            const formattedName = `${lastName}, ${firstName} ${
              middleName ? middleName.charAt(0) + ". " : ""
            }${nameExtension}`.trim();
            let enrichedUpdatedStudent = {
              ...response.data.updatedStudent,
              name: formattedName,
            };
            if (onUpdate) {
              onUpdate(enrichedUpdatedStudent);
            }
            showSnackbar("Successfully updated student profile", "success");
            handleClose();
          } else {
            showSnackbar("Update operation failed", "error");
          }
        } catch (error) {
          console.error(
            "An error occurred during updating student profile:",
            error
          );
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedStudent.lrn is undefined");
        showSnackbar(
          "An error occurred, selectedStudent.lrn is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedStudent is undefined");
      showSnackbar("An error occurred, selectedStudent is undefined", "error");
    }
  };

  const handleSaveOrUpdate = (data) => {
    if (selectedStudent && selectedStudent.lrn) {
      handleUpdateStudent(data);
    } else {
      handleCreateStudent(data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedStudent) {
      setValue("lrn", selectedStudent.lrn || "");
      setValue("lastName", selectedStudent.lastName || "");
      setValue("firstName", selectedStudent.firstName || "");
      setValue("middleName", selectedStudent.middleName || "");
      setValue("nameExtension", selectedStudent.nameExtension || "");
      setValue("gender", selectedStudent.gender || "");
      const parsedBirthDate = selectedStudent.birthDate
        ? parseISO(selectedStudent.birthDate)
        : null;
      setValue("birthDate", parsedBirthDate);
      setValue("age", selectedStudent.age || "");
      setValue("is4p", selectedStudent.is4p || false);
      setValue("parentName1", selectedStudent.parentName1 || "");
      setValue("parentContact1", selectedStudent.parentContact1 || "");
      setValue("parentName2", selectedStudent.parentName2 || "");
      setValue("parentContact2", selectedStudent.parentContact2 || "");
      setValue("address", selectedStudent.address || "");
    }
  }, [selectedStudent, setValue]);

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        className="overflow-auto"
      >
        <DialogTitle>
          {selectedStudent ? "Edit Student" : "Add Student"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Enter student profile details:
            </DialogContentText>
            <Controller
              name="lrn"
              control={control}
              render={({ field }) => (
                <TextField
                  label="LRN"
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.lrn}
                  helperText={errors.lrn?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <div className="w-full grid grid-cols-4 gap-40">
              <div className="w-56">
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
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /(?:^|\s)\S/g,
                          function (a) {
                            return a.toUpperCase();
                          }
                        );
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-56">
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
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /(?:^|\s)\S/g,
                          function (a) {
                            return a.toUpperCase();
                          }
                        );
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-56">
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Middle Name"
                      fullWidth
                      margin="normal"
                      {...field}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /(?:^|\s)\S/g,
                          function (a) {
                            return a.toUpperCase();
                          }
                        );
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-22">
                <Controller
                  name="nameExtension"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Suffix</InputLabel>
                      <Select {...field}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Jr.">Jr.</MenuItem>
                        <MenuItem value="Sr.">Sr.</MenuItem>
                        <MenuItem value="II">II</MenuItem>
                        <MenuItem value="III">III</MenuItem>
                        <MenuItem value="IV">IV</MenuItem>
                        <MenuItem value="V">V</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl required fullWidth margin="normal">
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select labelId="gender-label" label="Gender" {...field}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                      <FormHelperText error={!!errors.gender}>
                        {errors.gender?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Birthday"
                        required
                        fullWidth
                        sx={{ marginTop: "15px" }}
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        onChange={(date) => {
                          // Set the birthDate value
                          field.onChange(date);

                          // Calculate the age
                          const today = new Date();
                          let age = today.getFullYear() - date.getFullYear();
                          const m = today.getMonth() - date.getMonth();
                          if (
                            m < 0 ||
                            (m === 0 && today.getDate() < date.getDate())
                          ) {
                            age--;
                          }

                          // Set the age value in the form
                          setValue("age", age.toString());
                        }}
                      />
                    )}
                  />
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Age"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        // Allow only numbers and limit to 3 digits
                        if (
                          /^[0-9]*$/.test(e.target.value) &&
                          e.target.value.length <= 3
                        ) {
                          field.onChange(e);
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="is4p"
                  control={control}
                  render={({ field }) => (
                    <FormControl required fullWidth margin="normal">
                      <InputLabel id="is4p-label">Is 4P?</InputLabel>
                      <Select labelId="is4p-label" label="Is 4P?" {...field}>
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                      <FormHelperText error={!!errors.is4p}>
                        {errors.is4p?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentName1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent Name 1"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.parentName1}
                      helperText={errors.parentName1?.message}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /(?:^|\s)\S/g,
                          function (a) {
                            return a.toUpperCase();
                          }
                        );
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentContact1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent Contact 1"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.parentContact1}
                      helperText={errors.parentContact1?.message}
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
                  name="parentName2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent Name 2 (Optional)"
                      fullWidth
                      margin="normal"
                      {...field}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /(?:^|\s)\S/g,
                          function (a) {
                            return a.toUpperCase();
                          }
                        );
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentContact2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Parent Contact 2 (Optional)"
                      fullWidth
                      margin="normal"
                      {...field}
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
                  multiline
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(
                      /(?:^|\s)\S/g,
                      function (a) {
                        return a.toUpperCase();
                      }
                    );
                    field.onChange(e);
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedStudent ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default StudentProfileForm;
