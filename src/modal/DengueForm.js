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
  const { open = false, onClose, createDocument, selectedDocument, initialData } = props;
  const [classOption, setClassOption] = useState([]);
  const [adviserOption, setAdviserOption] = useState([]);
  const [onsetDate, setOnsetDate] = useState(null);
  const [admissionDate, setAdmissionDate] = useState(null);
  const [dischargeDate, setDischargeDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    class_data: yup.string().required("Class is required"),
    adviser_data: yup.string().required("Adviser is required"),
    student_data: yup.string().required("Student LRN is required"),
    student_age: yup.number().min(1, "Student Age must be at least 1").required("Student Age is required"),
    onsetDate: yup.date().required("Date of Onset is required"),
    admissionDate: yup.date().nullable(),
    dischargeDate: yup.date().nullable(),
    admissionHospital: yup.string().nullable(),
  });

  const handleOnsetDateChange = (date) => {
    setOnsetDate(date);
    setValue("onsetDate", date);
  };

  const handleAdmissionDateChange = (date) => {
    setAdmissionDate(date);
    setValue("admissionDate", date);
  };

  const handleDischargeDateChange = (date) => {
    setAdmissionDate(date);
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
    defaultValues: initialData || {
      student_age: 1,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "/classProfile/fetchClassProfile"
        );
        if (response.data) {
          // Map advisers to options for the dropdown
          const options = response.data.map((data) => ({
            value: data._id, // Use the unique identifier for the value
            label: `${data.grade} - ${data.section} (${data.syFrom} - ${data.syTo})`, // Display name
          }));
          setClassOption(options);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching class profiles:",
          error
        );
      }

      try {
        const response = await axiosInstance.get(
          "/facultyProfile/fetchFacultyProfiles"
        );
        if (response.data) {
          // Filter faculty profiles to include only advisers
          const filteredData = response.data.filter(
            (data) => data.role === "Adviser"
          );
          // Map advisers to options for the dropdown
          const options = filteredData.map((data) => ({
            value: data._id, // Use the unique identifier for the value
            label: `${data.firstName} ${data.lastName}`, // Display name
          }));
          setAdviserOption(options);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching faculty profiles:",
          error
        );
      }
    };

    fetchProfile();
  }, []);

  const handleCreate = async (data) => {
    if (!data.admissionHospital) {
      data.admissionHospital = "";
    }
    try {
      const response = await axiosInstance.post(
        "dengueProfile/post",
        data
      );
      if (response.data._id) {
        if (typeof createDocument === "function") {
          createDocument(response.data);
        }
        showSnackbar("Successfully added ", "success");
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

  const handleUpdate = async (data) => {
    if (!data.admissionHospital) {
      data.admissionHospital = "";
    }
    // Check if selectedDocument is not undefined or null
    if (selectedDocument) {
      // Check if selectedDocument._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(
            `dengueProfile/put/${selectedDocument._id}`,
            data
          );
          if (response.data._id) {
            if (typeof props.updatedDocument === "function") {
              props.updatedDocument(response.data);
            }
            showSnackbar("Successfully updated", "success");
            handleClose();
          } else {
            showSnackbar("Operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating :", error);
          showSnackbar("An error occurred during updating", "error");
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
  // useEffect to populate form fields when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      const selectedClassId = classOption.find(
        (option) => option.label === selectedDocument.class_data
      )?.value;
      const selectedAdviserId = adviserOption.find(
        (option) => option.label === selectedDocument.adviser_data
      )?.value;

      console.log("selectedDocument.adviser_data:", selectedDocument.class_data);
  console.log("classOption:", classOption);

      setValue("class_data", selectedClassId || "");
      setValue("adviser_data", selectedAdviserId || "");
      setValue("student_data", selectedDocument.student_data || "");
      setValue("student_age", selectedDocument.student_age || "");
      setValue("onsetDate", selectedDocument.onsetDate || "");
      setValue("admissionDate", selectedDocument.admissionDate || "");
      setValue("dischargeDate", selectedDocument.dischargeDate || "");
      setValue("admissionHospital", selectedDocument.admissionHospital || "");

      const onsetDate = new Date(selectedDocument.onsetDate);
      const admissionDate = new Date(selectedDocument.admissionDate);
      const dischargeDate = new Date(selectedDocument.dischargeDate);

      setOnsetDate(onsetDate);
      setAdmissionDate(admissionDate);
      setDischargeDate(dischargeDate);
    }
  }, [selectedDocument, setValue, classOption, adviserOption]);

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
          {selectedDocument ? "Edit Medicine" : "Add Medicine"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter medicine details:</DialogContentText>
            
            <Controller
              name="class_data"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.class_data}
                >
                  <InputLabel id="class-label">Class</InputLabel>
                  <Select labelId="class-label" label="Class" {...field}>
                    {classOption.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.class_data && (
                    <FormHelperText>{errors.class_data.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="adviser_data"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.adviser_data}
                >
                  <InputLabel id="adviser-label">Adviser</InputLabel>
                  <Select labelId="adviser-label" label="Adviser" {...field}>
                    {adviserOption.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.adviser_data && (
                    <FormHelperText>{errors.adviser_data.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={8} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Student LRN"
              {...register("student_data")}
              fullWidth
              required
              error={!!errors.student_data}
              helperText={errors.student_data?.message}
            />
              </Grid>
              <Grid item xs={12} sm={4} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              type="number"
              label="Age"
              {...register("student_age")}
              fullWidth
              required
              inputProps={{ min: "1", step: "1" }}
              error={!!errors.student_age}
              helperText={errors.student_age?.message}
            />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl error={!!errors.onsetDate}>
                  <DatePicker
                    label="Date of Onset"
                    value={onsetDate}
                    onChange={handleOnsetDateChange}
                  />
                  <FormHelperText>
                    {errors.onsetDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl error={!!errors.admissionDate}>
                  <DatePicker
                    label="Date of Admission"
                    value={admissionDate}
                    onChange={handleAdmissionDateChange}
                  />
                  <FormHelperText>{errors.admissionDate?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl error={!!errors.dischargeDate}>
                  <DatePicker
                    label="Date of Discharge"
                    value={dischargeDate}
                    onChange={handleDischargeDateChange}
                  />
                  <FormHelperText>{errors.dischargeDate?.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              label="Hospital of Admission"
              {...register("admissionHospital")}
              fullWidth
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedDocument ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DengueForm;
