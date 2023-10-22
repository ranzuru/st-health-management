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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axiosInstance from "../config/axios-instance";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const visionScreeningOptions = ["Passed", "Failed"];
const auditoryScreeningOptions = ["Passed", "Failed"];
const scalpScreeningOptions = ["Normal", "Presence of Lice"];
const skinScreeningOptions = [
  "Normal",
  "Redness of Skin",
  "White Spots",
  "Flaky Skin",
  "Impetigo/Boil",
  "Hematoma",
  "Bruises/Injuries",
  "Itchiness",
  "Skin Lesions",
  "Acne/Pimple",
];
const eyesScreeningOptions = [
  "Normal",
  "Stye",
  "Eye Redness",
  "Ocular Misalignment",
  "Pale Conjunctive",
  "Eye Discharge",
  "Matted Eyelashes",
];
const earScreeningOptions = ["Normal", "Ear Discharge", "Impacted Cerumen"];
const noseScreeningOptions = ["Normal", "Mucus Discharge", "Nose Bleeding"];

const FacultyMedicalForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewMedicalCheckup,
    selectedMedicalCheckup,
  } = props;
  const [focusState, setFocusState] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [employeeIdOptions, setEmployeeIdOptions] = useState([]);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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

  const handleFocus = (field) => {
    setFocusState((prevFocusState) => ({ ...prevFocusState, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusState((prevFocusState) => ({ ...prevFocusState, [field]: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // handle null or undefined

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return ""; // handle invalid date

    return date.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validationSchema = yup.object().shape({
    dateOfExamination: yup.date(),
    employeeId: yup.string(),
    weightKg: yup.number(),
    heightCm: yup.number(),
    temperature: yup.string(),
    bloodPressure: yup.string(),
    heartRate: yup.number(),
    pulseRate: yup.number(),
    respiratoryRate: yup.number(),
    visionScreeningLeft: yup.string(),
    visionScreeningRight: yup.string(),
    auditoryScreeningLeft: yup.string(),
    auditoryScreeningRight: yup.string(),
    skinScreening: yup.string(),
    scalpScreening: yup.string(),
    eyesScreening: yup.string(),
    earScreening: yup.string(),
    noseScreening: yup.string(),
    mouthScreening: yup.string(),
    throatScreening: yup.string(),
    neckScreening: yup.string(),
    lungScreening: yup.string(),
    heartScreening: yup.string(),
    abdomen: yup.string(),
    deformities: yup.string(),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      dateOfExamination: getTodayDate(),
      employeeId: "",
      weightKg: "",
      heightCmp: "",
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      pulseRate: "",
      respiratoryRate: "",
      visionScreeningLeft: "",
      visionScreeningRight: "",
      auditoryScreeningLeft: "",
      auditoryScreeningRight: "",
      skinScreening: "",
      scalpScreening: "",
      eyesScreening: "",
      earScreening: "",
      noseScreening: "",
      mouthScreening: "",
      throatScreening: "",
      neckScreening: "",
      lungScreening: "",
      heartScreening: "",
      abdomen: "",
      deformities: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const handleCreateMedicalCheckup = async (data) => {
    try {
      const payload = {
        ...data,
        employeeId: selectedEmployeeId, // include selectedLRN
      };
      const response = await axiosInstance.post(
        "/facultyMedical/create",
        payload
      );
      if (response.data && response.data.newCheckup) {
        let enrichedNewCheckup = {
          ...response.data.newCheckup,
          id: response.data.newCheckup._id,
          dateOfExamination: response.data.newCheckup.dateOfExamination,
          employeeId: response.data.newCheckup.facultyProfile?.employeeId,
          age: response.data.newCheckup.facultyProfile?.age,
          gender: response.data.newCheckup.facultyProfile?.gender,
          section:
            response.data.newCheckup.facultyProfile?.classProfile?.section,
          academicYear:
            response.data.newCheckup.facultyProfile?.classProfile?.academicYear,
          heightCm: response.data.newCheckup?.heightCm,
          weightKg: response.data.newCheckup?.weightKg,
          temperature: response.data.newCheckup.temperature,
          bloodPressure: response.data.newCheckup.bloodPressure,
          heartRate: response.data.newCheckup.heartRate,
        };
        if (typeof addNewMedicalCheckup === "function") {
          addNewMedicalCheckup(enrichedNewCheckup);
        }
        showSnackbar("Successfully added medical checkup", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding medical checkup:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during adding", "error");
      }
    }
  };

  const handleUpdateMedicalCheckup = async (data) => {
    if (selectedMedicalCheckup) {
      if (selectedMedicalCheckup._id) {
        try {
          const response = await axiosInstance.put(
            `/medicalCheckup/updateMedicalCheckup/${selectedMedicalCheckup._id}`,
            data
          );
          if (response.data.medicalCheckup) {
            const updatedMedicalCheckup = {
              ...response.data.medicalCheckup,
            };
            if (typeof props.onMedicalCheckupUpdated === "function") {
              props.onMedicalCheckupUpdated(updatedMedicalCheckup);
            }
            showSnackbar("Successfully updated medical checkup", "success");
            handleClose();
          } else {
            showSnackbar("Update operation failed", "error");
          }
        } catch (error) {
          console.error("Error details:", error.response || error.request);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedMedicalCheckup._id is undefined");
        showSnackbar(
          "An error occurred, selectedMedicalCheckup._id is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedMedicalCheckup is undefined");
      showSnackbar(
        "An error occurred, selectedMedicalCheckup is undefined",
        "error"
      );
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedMedicalCheckup && selectedMedicalCheckup._id) {
        await handleUpdateMedicalCheckup(data);
      } else {
        await handleCreateMedicalCheckup(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdateMedicalCheckup", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (employeeIdInput.length > 2) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/facultyMedical/search/${employeeIdInput}`
          );
          setEmployeeIdOptions(response.data);
        } catch (error) {}
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeIdInput]);

  const handleClose = () => {
    reset();
    onClose();
    setFocusState({});
    setSelectedEmployeeId(null);
    setEmployeeIdInput("");
    setSelectedFaculty(null);
  };

  useEffect(() => {
    if (selectedMedicalCheckup) {
      // Batch set values to reduce re-renders
      Object.keys(selectedMedicalCheckup).forEach((key) => {
        setValue(key, selectedMedicalCheckup[key]);
      });

      // If you want to reset the form when selectedMedicalCheckup changes
      reset(selectedMedicalCheckup);
    }
  }, [selectedMedicalCheckup, setValue, reset]);

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
        maxWidth="lg"
        className="overflow-auto"
      >
        <DialogTitle>
          {selectedMedicalCheckup
            ? "Edit Medical Checkup"
            : "Add Medical Checkup"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Enter medical checkup details:
            </DialogContentText>
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="dateOfExamination"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Date of Examination"
                          margin="normal"
                          type="date"
                          {...field}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors.dateOfExamination}
                          helperText={errors.dateOfExamination?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <Controller
                      name="employeeId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={employeeIdOptions}
                          getOptionLabel={(option) => option.employeeId || ""}
                          value={
                            employeeIdOptions.find(
                              (option) =>
                                option.employeeId === selectedEmployeeId
                            ) || null
                          }
                          inputValue={employeeIdInput}
                          loading={loading}
                          loadingText="Loading..."
                          isOptionEqualToValue={(option, value) => {
                            return (
                              option.employeeId === value.employeeId &&
                              option.lastName === value.lastName &&
                              option.firstName === value.firstName &&
                              option.middleName === value.middleName &&
                              option.nameExtension === value.nameExtension &&
                              option.gender === value.gender &&
                              option.birthDate === value.birthDate &&
                              (option.classProfile
                                ? option.classProfile.academicYear
                                : null) ===
                                (value.classProfile
                                  ? value.classProfile.academicYear
                                  : null)
                            );
                          }}
                          onInputChange={(_, newInputValue) => {
                            setEmployeeIdInput(newInputValue);
                          }}
                          onChange={(_, newValue) => {
                            setSelectedFaculty(newValue);
                            setSelectedEmployeeId(
                              newValue ? newValue.employeeId : ""
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              label="Employee's ID"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: ".8rem", sm: ".8rem", md: "1rem" },
                  }}
                >
                  Faculty's Basic Info:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Name"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedFaculty
                              ? `${selectedFaculty.lastName}, ${selectedFaculty.firstName} ${selectedFaculty.middleName} ${selectedFaculty.nameExtension}`
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Gender"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={selectedFaculty ? selectedFaculty.gender : ""}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Birthday"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedFaculty && selectedFaculty.birthDate
                              ? formatDate(selectedFaculty.birthDate)
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: ".8rem", sm: ".8rem", md: "1rem" },
                  }}
                >
                  Faculty's Vital Statistics:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="heightCm"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Height"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.height}
                          helperText={errors.height?.message}
                          onFocus={() => handleFocus("heightCm")}
                          onBlur={() => handleBlur("heightCm")}
                          onInput={(e) => {
                            // Allow only numbers and a single decimal point
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                          InputProps={{
                            endAdornment:
                              focusState["heightCm"] || field.value ? (
                                <InputAdornment position="end">
                                  cm
                                </InputAdornment>
                              ) : null,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="weightKg"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Weight"
                          fullWidth
                          margin="normal"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="temperature"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Temperature"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.temperature}
                          helperText={errors.temperature?.message}
                          onFocus={() => handleFocus("temperature")}
                          onBlur={() => handleBlur("temperature")}
                          InputProps={{
                            endAdornment:
                              focusState["temperature"] || field.value ? (
                                <InputAdornment position="end">
                                  °C
                                </InputAdornment>
                              ) : null,
                            placeholder: "36",
                          }}
                          onInput={(e) => {
                            // Allow only numbers and a single decimal point
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.8}>
                    <Controller
                      name="bloodPressure"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Blood Pressure"
                          margin="normal"
                          fullWidth
                          {...field}
                          onChange={(e) => {
                            const re = /^[0-9]{0,3}[/]?[0-9]{0,2}$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              field.onChange(e);
                            }
                          }}
                          error={!!errors.bloodPressure}
                          helperText={errors.bloodPressure?.message}
                          onFocus={() => handleFocus("bloodPressure")}
                          onBlur={() => handleBlur("bloodPressure")}
                          InputProps={{
                            endAdornment:
                              focusState["bloodPressure"] || field.value ? (
                                <InputAdornment position="end">
                                  mmHg
                                </InputAdornment>
                              ) : null,
                            placeholder: "120/80",
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="heartRate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Heart Rate"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.heartRate}
                          helperText={errors.heartRate?.message}
                          onFocus={() => handleFocus("heartRate")}
                          onBlur={() => handleBlur("heartRate")}
                          InputProps={{
                            endAdornment:
                              focusState["heartRate"] || field.value ? (
                                <InputAdornment position="end">
                                  BPM
                                </InputAdornment>
                              ) : null,
                            placeholder: "80",
                          }}
                          onInput={(e) => {
                            // Allow only numbers and a single decimal point
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="pulseRate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Pulse Rate"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.pulseRate}
                          helperText={errors.pulseRate?.message}
                          onFocus={() => handleFocus("pulseRate")}
                          onBlur={() => handleBlur("pulseRate")}
                          InputProps={{
                            endAdornment:
                              focusState["pulseRate"] || field.value ? (
                                <InputAdornment position="end">
                                  BPM
                                </InputAdornment>
                              ) : null, // 'bpm' stands for beats per minute, a common unit for pulse rate
                          }}
                          onInput={(e) => {
                            // Allow only numbers and a single decimal point
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="respiratoryRate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Respiratory Rate"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.respiratoryRate}
                          helperText={errors.respiratoryRate?.message}
                          onFocus={() => handleFocus("respiratoryRate")}
                          onBlur={() => handleBlur("respiratoryRate")}
                          InputProps={{
                            endAdornment:
                              focusState["respiratoryRate"] || field.value ? (
                                <InputAdornment position="end">
                                  breaths/min
                                </InputAdornment>
                              ) : null, // 'breaths/min' stands for breaths per minute, a common unit for respiratory rate
                          }}
                          onInput={(e) => {
                            // Allow only numbers and a single decimal point
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: ".8rem", sm: ".8rem", md: "1rem" },
                  }}
                >
                  Sensory Assessments:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="visionScreeningLeft"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.visionScreeningLeft}
                        >
                          <InputLabel id="visionScreeningLeft-label">
                            Vision (Left)
                          </InputLabel>
                          <Select
                            labelId="visionScreeningLeft-label"
                            label="Vision Screening (Left)"
                            {...field}
                          >
                            {visionScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.visionScreeningLeft && (
                            <FormHelperText>
                              {errors.visionScreeningLeft.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="visionScreeningRight"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.visionScreeningRight}
                        >
                          <InputLabel id="visionScreeningRight-label">
                            Vision (Right)
                          </InputLabel>
                          <Select
                            labelId="visionScreeningRight-label"
                            label="Vision Screening (Right)"
                            {...field}
                          >
                            {visionScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.visionScreeningRight && (
                            <FormHelperText>
                              {errors.visionScreeningRight.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="auditoryScreeningLeft"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.auditoryScreeningLeft}
                        >
                          <InputLabel id="auditoryScreeningLeft-label">
                            Auditory (Left)
                          </InputLabel>
                          <Select
                            labelId="auditoryScreeningLeft-label"
                            label="Auditory Screening (Left)"
                            {...field}
                          >
                            {auditoryScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.auditoryScreeningLeft && (
                            <FormHelperText>
                              {errors.auditoryScreeningLeft.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="auditoryScreeningRight"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.auditoryScreeningRight}
                        >
                          <InputLabel id="auditoryScreeningRight-label">
                            Auditory (Right)
                          </InputLabel>
                          <Select
                            labelId="auditoryScreeningRight-label"
                            label="Auditory Screening (Right)"
                            {...field}
                          >
                            {auditoryScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.auditoryScreening && (
                            <FormHelperText>
                              {errors.auditoryScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: ".8rem", sm: ".8rem", md: "1rem" },
                  }}
                >
                  Screening:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="scalpScreening"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.scalpScreening}
                        >
                          <InputLabel id="scalpScreening-label">
                            Scalp Issue
                          </InputLabel>
                          <Select
                            labelId="scalpScreening-label"
                            label="Scalp Issue"
                            {...field}
                          >
                            {scalpScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.scalpScreening && (
                            <FormHelperText>
                              {errors.scalpScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="skinScreening"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.skinScreening}
                        >
                          <InputLabel id="skinScreening-label">
                            Skin Issue
                          </InputLabel>
                          <Select
                            labelId="skinScreening-label"
                            label="Skin Issue"
                            {...field}
                          >
                            {skinScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.skinScreening && (
                            <FormHelperText>
                              {errors.skinScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <Controller
                      name="eyesScreening"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.eyesScreening}
                        >
                          <InputLabel id="eyesScreening-label">
                            Eyes Screening
                          </InputLabel>
                          <Select
                            labelId="eyesScreening-label"
                            label="Eyes Screening"
                            {...field}
                          >
                            {eyesScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.eyesScreening && (
                            <FormHelperText>
                              {errors.eyesScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <Controller
                      name="earScreening"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.earsScreening}
                        >
                          <InputLabel id="earScreening-label">
                            Ear Screening
                          </InputLabel>
                          <Select
                            labelId="earScreening-label"
                            label="Ear Screening"
                            {...field}
                            value={field.value || ""}
                          >
                            {earScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.earsScreening && (
                            <FormHelperText>
                              {errors.earsScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="noseScreening"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.noseScreening}
                        >
                          <InputLabel id="noseScreening-label">
                            Nose Screening
                          </InputLabel>
                          <Select
                            labelId="noseScreening-label"
                            label="Nose Screening"
                            {...field}
                          >
                            {noseScreeningOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.noseScreening && (
                            <FormHelperText>
                              {errors.noseScreening.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <Controller
                      name="mouthScreening"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Mouth Screening"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.mouthScreening}
                          helperText={errors.mouthScreening?.message}
                          InputProps={{ placeholder: "Normal" }}
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
                  <Grid item xs={12} sm={6} md={2.2}>
                    <Controller
                      name="neckScreening"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Neck Screening"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.neckScreening}
                          helperText={errors.neckScreening?.message}
                          InputProps={{ placeholder: "Normal" }}
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
                  <Grid item xs={12} sm={6} md={2.2}>
                    <Controller
                      name="throatScreening"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Throat Screening"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.throatScreening}
                          helperText={errors.throatScreening?.message}
                          InputProps={{ placeholder: "Normal" }}
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
                  <Grid item xs={12} sm={6} md={2.2}>
                    <Controller
                      name="lungScreening"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Lung Screening"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.lungScreening}
                          helperText={errors.lungScreening?.message}
                          InputProps={{ placeholder: "Normal" }}
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
                  <Grid item xs={12} sm={6} md={2.2}>
                    <Controller
                      name="heartScreening"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Heart Screening"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.heartScreening}
                          helperText={errors.heartScreening?.message}
                          InputProps={{ placeholder: "Normal" }}
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="abdomen"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Abdomen"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.abdomen}
                          helperText={errors.abdomen?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="deformities"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Deformities"
                          margin="normal"
                          fullWidth
                          {...field}
                          error={!!errors.deformities}
                          helperText={errors.deformities?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedMedicalCheckup ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FacultyMedicalForm;
