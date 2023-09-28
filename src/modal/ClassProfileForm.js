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
import Grid from "@mui/material/Grid";
import axiosInstance from "../config/axios-instance";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const gradeOptions = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

const ClassProfileForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewClassProfile,
    selectedClassProfile,
    isEditing,
  } = props;
  const [facultyOptions, setFacultyOptions] = useState([]);
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
    grade: yup
      .string()
      .required("Grade is required"),
    section: yup.string().required("Section is required"),
    room: yup.string().required("Room is required"),
    syFrom: yup
      .string()
      .required("Start Year is required")
      .matches(/^\d{4}$/, "Invalid year format (YYYY)")
      .test({
        name: "yearComparison",
        message: "End Year must be one year greater than Start Year",
        test: function (syFrom) {
          const syTo = this.parent.syTo;
          if (!syFrom || !syTo) {
            // If either field is empty, the validation is not applicable
            return true;
          }
          const syFromNumber = parseInt(syFrom, 10);
          const syToNumber = parseInt(syTo, 10);
          return syFromNumber + 1 === syToNumber;
        },
      }),
    syTo: yup
      .string()
      .required("End Year is required")
      .matches(/^\d{4}$/, "Invalid year format (YYYY)")
      .test({
        name: "yearComparison",
        message: "End Year must be one year greater than Start Year",
        test: function (syTo) {
          const syFrom = this.parent.syFrom;
          if (!syFrom || !syTo) {
            // If either field is empty, the validation is not applicable
            return true;
          }
          const syFromNumber = parseInt(syFrom, 10);
          const syToNumber = parseInt(syTo, 10);
          return syFromNumber + 1 === syToNumber;
        },
      }),
    faculty: yup.string().required("Faculty is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      grade: "",
      section: "",
      room: "",
      syFrom: "",
      syTo: "",
      faculty: "", // Set the default faculty as empty
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await axiosInstance.get(
          "/facultyProfile/fetchFacultyProfiles"
        );
        if (response.data) {
          // Filter faculty profiles to include only advisers
          const advisers = response.data.filter(
            (faculty) => faculty.role === "Adviser"
          );
          // Map advisers to options for the dropdown
          const options = advisers.map((adviser) => ({
            value: adviser.employeeId, // Use the unique identifier for the value
            label: `${adviser.firstName} ${adviser.lastName}`, // Display name
          }));
          setFacultyOptions(options);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching faculty profiles:",
          error
        );
      }
    };

    fetchAdvisers();
  }, []);

  const handleCreateClassProfile = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/classProfile/createClassProfile",
        data
      );
      if (response.data && response.data.classProfile) {
        const newClassProfile = {
          ...response.data.classProfile,
          schoolYear: `${response.data.classProfile.syFrom} - ${response.data.classProfile.syTo}`,
        };
        if (typeof addNewClassProfile === "function") {
          addNewClassProfile(newClassProfile);
        }
        showSnackbar("Successfully added class profile", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding class profile:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding", "error");
    }
  };

  const handleUpdateClassProfile = async (data) => {
    if (selectedClassProfile) {
      if (selectedClassProfile._id) {
        try {
          const response = await axiosInstance.put(
            `/classProfile/updateClassProfile/${selectedClassProfile._id}`,
            data
          );
          if (response.data.classProfile) {
            const updatedClassProfile = {
              ...response.data.classProfile,
              schoolYear: `${response.data.classProfile.syFrom} - ${response.data.classProfile.syTo}`,
            };
            if (typeof props.onClassProfileUpdated === "function") {
              props.onClassProfileUpdated(updatedClassProfile);
            }
            showSnackbar("Successfully updated class profile", "success");
            handleClose();
          } else {
            showSnackbar("Update operation failed", "error");
          }
        } catch (error) {
          console.error("Error details:", error.response || error.request);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedClassProfile._id is undefined");
        showSnackbar(
          "An error occurred, selectedClassProfile._id is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedClassProfile is undefined");
      showSnackbar(
        "An error occurred, selectedClassProfile is undefined",
        "error"
      );
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedClassProfile && selectedClassProfile._id) {
        await handleUpdateClassProfile(data);
      } else {
        await handleCreateClassProfile(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdate", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedClassProfile) {
      const selectedFacultyId = facultyOptions.find(
        (option) => option.label === selectedClassProfile.faculty
      )?.value;

      setValue("grade", selectedClassProfile.grade || "");
      setValue("section", selectedClassProfile.section || "");
      setValue("room", selectedClassProfile.room || "");
      setValue("syFrom", selectedClassProfile.syFrom || "");
      setValue("syTo", selectedClassProfile.syTo || "");
      setValue("faculty", selectedFacultyId || "");
    }
  }, [selectedClassProfile, setValue, facultyOptions]);

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
          {selectedClassProfile ? "Edit Class Profile" : "Add Class Profile"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter class profile details:</DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.grade}
                    >
                      <InputLabel id="grade-label">Grade</InputLabel>
                      <Select labelId="grade-label" label="Grade" {...field}>
                        {gradeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.grade && (
                        <FormHelperText>{errors.grade.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Section"
                      margin="normal"
                      fullWidth
                      {...field}
                      required
                      error={!!errors.section}
                      helperText={errors.section?.message}
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
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="syFrom"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Start Year"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.syFrom}
                      helperText={errors.syFrom?.message}
                      onBlur={field.onBlur}
                      inputProps={{
                        maxLength: 4,
                        pattern: "[0-9]*", // Allow only numeric input
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="syTo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="End Year"
                      fullWidth
                      margin="normal"
                      {...field}
                      required
                      error={!!errors.syTo}
                      helperText={errors.syTo?.message}
                      onBlur={field.onBlur}
                      inputProps={{
                        maxLength: 4,
                        pattern: "[0-9]*", // Allow only numeric input
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Room"
                  fullWidth
                  margin="normal"
                  {...field}
                  required
                  error={!!errors.room}
                  helperText={errors.room?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="faculty"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.faculty}
                >
                  <InputLabel id="faculty-label">Adviser</InputLabel>
                  <Select labelId="faculty-label" label="Faculty" {...field}>
                    {facultyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.faculty && (
                    <FormHelperText>{errors.faculty.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedClassProfile ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ClassProfileForm;
