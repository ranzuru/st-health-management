import { useState, useEffect } from "react";
// axios-instance import
import axiosInstance from "../config/axios-instance";
// MUI imports
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
// Yup imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

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
const AcademicYearForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewAcademicYear,
    selectedAcademicYear,
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

  const statusOption = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Planned",
      label: "Planned",
    },
    {
      value: "Completed",
      label: "Completed",
    },
  ];

  const yearOptions = Array.from({ length: 30 }, (_, index) => 2020 + index);

  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const validationSchema = yup.object().shape({
    schoolYear: yup.string().required("School Year is required"),
    monthFrom: yup.string().required("Month From is required"),
    monthTo: yup.string().required("Month To is required"),
    status: yup.string().required("Status is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      schoolYear: "",
      monthFrom: "",
      monthTo: "",
      status: "Active",
    },
    resolver: yupResolver(validationSchema),
  });

  const handleCreateAcademicYear = async (data) => {
    try {
      const response = await axiosInstance.post("/academicYear/create", data);
      if (response.data && response.data.newAcademicYear) {
        addNewAcademicYear(response.data.newAcademicYear);

        showSnackbar("Successfully added academic year", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding academic year:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during adding", "error");
      }
    }
  };

  const handleEditAcademicYear = async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/academicYear/update/${id}`,
        data
      );

      if (response.data && response.data.academicYear) {
        onUpdate(response.data.academicYear);

        showSnackbar("Successfully updated academic year", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during updating academic year:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during updating", "error");
      }
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedAcademicYear && selectedAcademicYear.id) {
        await handleEditAcademicYear(selectedAcademicYear.id, data);
      } else {
        await handleCreateAcademicYear(data);
      }
    } catch (error) {
      console.error(
        "An error occurred in handleSaveOrUpdateAcademicYear",
        error
      );
      if (error.response && error.response.data && error.response.data.error) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during saving or updating", "error");
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedAcademicYear) {
      const keys = ["schoolYear", "monthFrom", "monthTo", "status"];
      keys.forEach((key) => setValue(key, selectedAcademicYear[key] || ""));
    }
  }, [selectedAcademicYear, setValue]);

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
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {selectedAcademicYear ? "Edit Academic Year" : "Add Academic Year"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter academic year details:</DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="schoolYear"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      required
                      margin="normal"
                      fullWidth
                      error={!!errors.schoolYear}
                    >
                      <InputLabel id="schoolYear-label">School Year</InputLabel>
                      <Select
                        labelId="schoolYear-label"
                        label="School Year"
                        MenuProps={MenuProps}
                        {...field}
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={year} value={`${year}-${year + 1}`}>
                            {`${year}-${year + 1}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.yearFrom && (
                        <FormHelperText>
                          {errors.yearFrom.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="monthFrom"
                  control={control}
                  defaultValue="active"
                  render={({ field }) => (
                    <FormControl
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.monthFrom}
                    >
                      <InputLabel id="monthFrom-label">Month From</InputLabel>
                      <Select
                        labelId="monthFrom-label"
                        label="Month From"
                        MenuProps={MenuProps}
                        {...field}
                      >
                        {monthOptions.map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.monthFrom && (
                        <FormHelperText>
                          {errors.monthFrom.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="monthTo"
                  control={control}
                  defaultValue="active"
                  render={({ field }) => (
                    <FormControl
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.monthTo}
                    >
                      <InputLabel id="monthTo-label">Month To</InputLabel>
                      <Select
                        labelId="monthTo-label"
                        label="Month To"
                        MenuProps={MenuProps}
                        {...field}
                      >
                        {monthOptions.map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.monthTo && (
                        <FormHelperText>
                          {errors.monthTo.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="active"
                  render={({ field }) => (
                    <FormControl
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.status}
                    >
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select labelId="status-label" label="Status" {...field}>
                        {statusOption.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            disabled={option.value === "Completed"}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedAcademicYear ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AcademicYearForm;
