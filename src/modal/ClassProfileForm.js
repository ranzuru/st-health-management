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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
      .required("Grade is required")
      .test(
        "check-unique",
        "Grade and Section combination already exists",
        async function (grade) {
          const { section } = this.parent;

          if (
            isEditing &&
            selectedClassProfile &&
            selectedClassProfile.grade === grade &&
            selectedClassProfile.section === section
          ) {
            return true;
          }

          const response = await axiosInstance.post(
            "/classProfile/checkGradeSectionUnique",
            {
              grade,
              section,
            }
          );

          return response.data.isUnique;
        }
      ),
    section: yup.string().required("Section is required"),
    room: yup.string().required("Room is required"),
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
      faculty: "", // Set the default faculty as empty
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await axiosInstance.get(
          "/facultyProfile/fetch/Active"
        );
        if (response.data) {
          // Filter faculty profiles to include only advisers
          const advisers = response.data.filter(
            (faculty) =>
              faculty.status === "Active"
          );
          // Map advisers to options for the dropdown
          const options = advisers.map((adviser) => ({
            value: adviser.employeeId, // Use the unique identifier for the value
            label: `[${adviser.role}] ${adviser.firstName} ${adviser.lastName}`, // Display name
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
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  error={!!errors.grade}
                  className="rounded-md shadow-md"
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
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Section"
                  margin="normal"
                  className="rounded-md shadow-md"
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
            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Room"
                  fullWidth
                  margin="normal"
                  className="rounded-md shadow-md"
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
                  className="rounded-md shadow-md"
                >
                  <InputLabel id="faculty-label">Adviser</InputLabel>
                  <Select
                    labelId="faculty-label"
                    label="Faculty"
                    {...field}
                    MenuProps={MenuProps}
                  >
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
