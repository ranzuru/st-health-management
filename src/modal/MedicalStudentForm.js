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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
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
const ageMenarcheOptions = [];
for (let i = 10; i <= 16; i++) {
  ageMenarcheOptions.push(`${i} years old`);
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 2 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MedicalCheckupForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewMedicalCheckup,
    selectedMedicalCheckup,
    isEditing,
    onCheckupUpdate,
  } = props;
  const [focusState, setFocusState] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lrnOptions, setLrnOptions] = useState([]);
  const [lrnInput, setLrnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLRN, setSelectedLRN] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
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
    lrn: yup.string(),
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
    ironSupplementation: yup.boolean(),
    deworming: yup.boolean(),
    menarche: yup.string(),
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
      lrn: "",
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
      ironSupplementation: false,
      deworming: false,
      menarche: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const enrichMedicalCheckup = (newCheckup) => {
    const { studentProfile, nutritionalStatus, ...rest } = newCheckup;

    // Extracts details from studentProfile and nutritionalStatus
    const lrn = studentProfile?.lrn;
    const age = studentProfile?.age;
    const gender = studentProfile?.gender;
    const birthDate = studentProfile?.birthDate;

    // For name, you can use a similar pattern as you did in your second function
    const name =
      studentProfile && studentProfile.middleName
        ? `${studentProfile.lastName}, ${
            studentProfile.firstName
          } ${studentProfile.middleName.charAt(0)}. ${
            studentProfile.nameExtension
          }`.trim()
        : "N/A";

    // Combines everything
    return {
      ...rest,
      id: newCheckup._id,
      name,
      lrn,
      age,
      birthDate,
      gender,
      grade: studentProfile?.classProfile?.grade,
      section: studentProfile?.classProfile?.section,
      academicYear: studentProfile?.classProfile?.academicYear,
      heightCm: nutritionalStatus?.heightCm,
      weightKg: nutritionalStatus?.weightKg,
      BMIClassification: nutritionalStatus?.BMIClassification,
      heightForAge: nutritionalStatus?.heightForAge,
    };
  };

  const handleCreateMedicalCheckup = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedLRN, // include selectedLRN
      };

      const response = await axiosInstance.post(
        "/medicalCheckup/create",
        payload
      );
      if (response.data && response.data.newCheckup) {
        let enrichedNewCheckup = enrichMedicalCheckup(response.data.newCheckup);

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
    try {
      const payload = {
        ...data,
        lrn: selectedMedicalCheckup.lrn,
      };
      const response = await axiosInstance.put(
        `/medicalCheckup/update/${payload.lrn}`,
        payload
      );

      if (response.data && response.data._id) {
        const enrichedUpdatedRecord = enrichMedicalCheckup(response.data);
        if (onCheckupUpdate) {
          onCheckupUpdate(enrichedUpdatedRecord);
        }

        showSnackbar("Successfully updated record", "success");
        handleClose();
      } else {
        const errorMsg =
          (response.data && response.data.error) || "Operation failed";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
        const errorMsg =
          error.response.data.error || "An error occurred during updating";
        showSnackbar(errorMsg, "error");
      } else {
        showSnackbar("An error occurred during updating", "error");
      }
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedMedicalCheckup && selectedMedicalCheckup.lrn) {
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
      if (lrnInput.length > 2) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/medicalCheckup/search/${lrnInput}`
          );
          setLrnOptions(response.data);
        } catch (error) {}
        setLoading(false);
      }
    };

    fetchData();
  }, [lrnInput]);

  const handleClose = () => {
    reset();
    onClose();
    setFocusState({});
    setSelectedLRN(null);
    setLrnInput("");
    setSelectedStudent(null);
  };

  useEffect(() => {
    if (selectedMedicalCheckup && selectedMedicalCheckup.lrn) {
      const keys = [
        "academicYear",
        "lrn",
        "name",
        "grade",
        "section",
        "gender",
        "birthDate",
        "heightCm",
        "weightKg",
        "BMI",
        "BMIClassification",
        "heightForAge",
        "beneficiaryOfSBFP",
        "temperature",
        "bloodPressure",
        "heartRate",
        "pulseRate",
        "respiratoryRate",
        "visionScreeningLeft",
        "visionScreeningRight",
        "auditoryScreeningLeft",
        "auditoryScreeningRight",
        "scalpScreening",
        "skinScreening",
        "eyesScreening",
        "earScreening",
        "noseScreening",
        "mouthScreening",
        "neckScreening",
        "throatScreening",
        "lungScreening",
        "heartScreening",
        "abdomen",
        "deformities",
        "menarche",
      ];

      const formattedDate = new Date(selectedMedicalCheckup.dateOfExamination)
        .toISOString()
        .split("T")[0];
      setSelectedStudent(selectedMedicalCheckup);
      setSelectedLRN(selectedMedicalCheckup.lrn);
      console.log("Here:", selectedMedicalCheckup.lrn);
      setValue("dateOfExamination", formattedDate);

      keys.forEach((key) => {
        setValue(key, selectedMedicalCheckup[key] || "");
      });

      setValue(
        "ironSupplementation",
        !!selectedMedicalCheckup.ironSupplementation
      );
      setValue("deworming", !!selectedMedicalCheckup.deworming);
    }
  }, [selectedMedicalCheckup, setValue]);

  const isOptionEqual = (option, value) => {
    if (!option || !value) return false;

    const isClassProfileEqual =
      option.classProfile?.grade === value.classProfile?.grade &&
      option.classProfile?.section === value.classProfile?.section &&
      option.classProfile?.academicYear === value.classProfile?.academicYear;

    const isNutritionEqual =
      option.nutritionalStatus?.heightCm ===
        value.nutritionalStatus?.heightCm &&
      option.nutritionalStatus?.weightKg ===
        value.nutritionalStatus?.weightKg &&
      option.nutritionalStatus?.BMI === value.nutritionalStatus?.BMI &&
      option.nutritionalStatus?.BMIClassification ===
        value.nutritionalStatus?.BMIClassification &&
      option.nutritionalStatus?.heightForAge ===
        value.nutritionalStatus?.heightForAge &&
      option.nutritionalStatus?.beneficiaryOfSBFP ===
        value.nutritionalStatus?.beneficiaryOfSBFP;

    return (
      option.lrn === value.lrn &&
      option.lastName === value.lastName &&
      option.firstName === value.firstName &&
      option.middleName === value.middleName &&
      option.nameExtension === value.nameExtension &&
      option.gender === value.gender &&
      option.birthDate === value.birthDate &&
      isClassProfileEqual &&
      isNutritionEqual
    );
  };

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
                      name="lrn"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={lrnOptions}
                          getOptionLabel={(option) => option.lrn || ""}
                          value={
                            lrnOptions.find(
                              (option) => option.lrn === selectedLRN
                            ) || null
                          }
                          inputValue={lrnInput}
                          loading={loading}
                          loadingText="Loading..."
                          disabled={isEditing}
                          isOptionEqualToValue={isOptionEqual}
                          onInputChange={(_, newInputValue) => {
                            setLrnInput(newInputValue);
                          }}
                          onChange={(_, newValue) => {
                            setSelectedStudent(newValue);
                            setSelectedLRN(newValue ? newValue.lrn : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              label="Student's LRN"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Controller
                      name="academicYear"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Academic Year"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.classProfile
                                ? selectedStudent.classProfile.academicYear
                                : selectedStudent.academicYear
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
                  Student's Basic Info:
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
                            selectedStudent
                              ? selectedStudent.middleName &&
                                selectedStudent.firstName &&
                                selectedStudent.lastName
                                ? `${selectedStudent.lastName}, ${
                                    selectedStudent.firstName
                                  } ${selectedStudent.middleName.charAt(0)}. ${
                                    selectedStudent.nameExtension
                                  }`.trim()
                                : selectedStudent.name
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
                      name="grade"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Grade Level"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.classProfile
                                ? selectedStudent.classProfile.grade
                                : selectedStudent.grade
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
                      name="section"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Section"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.classProfile
                                ? selectedStudent.classProfile.section
                                : selectedStudent.section
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
                          value={selectedStudent ? selectedStudent.gender : ""}
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
                            selectedStudent
                              ? formatDate(selectedStudent.birthDate)
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="heightCm"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Height"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus.heightCm
                                : selectedStudent.heightCm
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
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
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus.weightKg
                                : selectedStudent.weightKg
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="BMI"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="BMI"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus.BMI
                                : selectedStudent.BMI
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
                      name="BMIClassification"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="BMI Classification"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus
                                    .BMIClassification
                                : selectedStudent.BMIClassification
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
                      name="heightForAge"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Height For Age"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus.heightForAge
                                : selectedStudent.heightForAge
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <Controller
                      name="beneficiaryOfSBFP"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="SBFP Beneficiary"
                          fullWidth
                          margin="normal"
                          {...field}
                          value={
                            selectedStudent
                              ? selectedStudent.nutritionalStatus
                                ? selectedStudent.nutritionalStatus
                                    .beneficiaryOfSBFP
                                  ? "Yes"
                                  : "No"
                                : selectedStudent.beneficiaryOfSBFP
                                ? "Yes"
                                : "No"
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
                  Vital Signs:
                </Typography>
                <Grid container spacing={2}>
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
            <Card
              variant="outlined"
              style={{ marginBottom: "16px", overflow: "hidden" }}
              className="rounded-md shadow-md"
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="ironSupplementation"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                          <FormLabel component="legend">
                            Iron Supplementation
                          </FormLabel>
                          <RadioGroup
                            row
                            name="row-radio-buttons-group"
                            {...field}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="deworming"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                          <FormLabel component="legend">Deworming</FormLabel>
                          <RadioGroup
                            row
                            name="row-radio-buttons-group"
                            {...field}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="menarche"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="menarche-label">Menarche</InputLabel>
                          <Select
                            labelId="menarche-label"
                            label="Menarche"
                            {...field}
                            MenuProps={MenuProps}
                          >
                            {ageMenarcheOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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

export default MedicalCheckupForm;
