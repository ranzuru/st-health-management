import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios-instance";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { medicalCheckupValidation } from "../schemas/medicalCheckupValidation";
import CustomSnackbar from "../components/CustomSnackbar";
import {
  visionScreeningOptions,
  auditoryScreeningOptions,
  scalpScreeningOptions,
  skinScreeningOptions,
  eyesScreeningOptions,
  earScreeningOptions,
  noseScreeningOptions,
  ageMenarcheOptions,
  mouthNeckThroatOptions,
  lungsHeartOptions,
  abdomenOptions,
  deformitiesOptions,
} from "../constants/dropdownOptions";
import AutoCompleteDropdown from "../constants/autoCompleteDropdown";
import { parseISO } from "date-fns";
import CustomRadioGroup from "../constants/customRadioGroup";
import VitalSignInput from "../constants/vitalSignInput";

const MedicalCheckupForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewMedicalCheckup,
    selectedRecord,
    isEditing,
    onCheckupUpdate,
  } = props;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      dateOfExamination: new Date(),
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
      remarks: "",
    },
    resolver: yupResolver(medicalCheckupValidation),
  });

  const enrichMedicalCheckup = (newCheckup) => {
    const {
      classEnrollment: { student, academicYear, classProfile } = {},
      nutritionalStatus = {},
      ...rest
    } = newCheckup;

    const lrn = student?.lrn;
    const age = student?.age;
    const gender = student?.gender;
    const address = student?.address;
    const birthDate = student?.birthDate;
    const name =
      student && (student.firstName || student.lastName)
        ? `${student.lastName || ""}, ${student.firstName || ""}${
            student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
          } ${student.nameExtension || ""}`.trim()
        : "N/A";
    const schoolYear = academicYear?.schoolYear;
    const grade = classProfile?.grade;
    const section = classProfile?.section;

    const heightCm = nutritionalStatus?.heightCm || "N/A";
    const weightKg = nutritionalStatus?.weightKg || "N/A";
    const BMIClassification = nutritionalStatus?.BMIClassification || "N/A";
    const heightForAge = nutritionalStatus?.heightForAge || "N/A";

    return {
      ...rest,
      id: newCheckup._id,
      name,
      lrn,
      age,
      gender,
      address,
      birthDate,
      grade,
      section,
      schoolYear,
      heightCm,
      weightKg,
      BMIClassification,
      heightForAge,
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
      handleAPIError(error);
    }
  };

  const handleUpdateMedicalCheckup = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedRecord.lrn,
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
      handleAPIError(error);
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedRecord && selectedRecord.lrn) {
        await handleUpdateMedicalCheckup(data);
      } else {
        await handleCreateMedicalCheckup(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdateMedicalCheckup", error);
    }
  };

  const handleAPIError = (error) => {
    if (error.response && error.response.data) {
      console.error("Server responded with:", error.response.data);
      const errorMsg =
        error.response.data.error || "An error occurred during adding";
      showSnackbar(errorMsg, "error");
    } else {
      showSnackbar("An error occurred during adding", "error");
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

          if (!response.data.data.length) {
            showSnackbar(
              "No student with the provided LRN found in the system.",
              "error"
            );
          } else {
            setLrnOptions(response.data.data);
            if (response.data.message) {
              showSnackbar(response.data.message, "warning");
            }
          }
        } catch (error) {
          showSnackbar(
            error.response && error.response.data.error
              ? error.response.data.error
              : "An error occurred while fetching data.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [lrnInput]);

  const handleClose = () => {
    reset();
    onClose();
    setSelectedLRN(null);
    setLrnInput("");
    setSelectedStudent(null);
  };

  useEffect(() => {
    if (selectedRecord && selectedRecord.lrn) {
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
        "remarks",
      ];

      keys.forEach((key) => {
        setValue(
          key,
          selectedRecord[key] !== null && selectedRecord[key] !== undefined
            ? selectedRecord[key]
            : ""
        );
      });

      const defaultNutritionalStatus = {
        heightCm: "N/A",
        weightKg: "N/A",
        BMI: "N/A",
        BMIClassification: "N/A",
        heightForAge: "N/A",
      };

      const studentData = {
        ...defaultNutritionalStatus,
        ...(selectedRecord || {}),
      };

      setSelectedStudent(studentData);

      const dateFields = ["dateOfExamination"];
      dateFields.forEach((dateField) => {
        const parsedDate = selectedRecord[dateField]
          ? parseISO(selectedRecord[dateField])
          : null;
        setValue(dateField, parsedDate);
      });

      setValue("ironSupplementation", !!selectedRecord.ironSupplementation);
      setValue("deworming", !!selectedRecord.deworming);
    } else {
      setSelectedStudent("N/A");
    }
  }, [selectedRecord, setValue]);

  const isOptionEqual = (option, value) => {
    if (!option || !value) return false;

    const isClassProfileEqual =
      option.classProfile?.grade === value.classProfile?.grade &&
      option.classProfile?.section === value.classProfile?.section;

    const isNutritionEqual =
      option.nutritionalStatus?.heightCm ===
        value.nutritionalStatus?.heightCm &&
      option.nutritionalStatus?.weightKg ===
        value.nutritionalStatus?.weightKg &&
      option.nutritionalStatus?.BMI === value.nutritionalStatus?.BMI &&
      option.nutritionalStatus?.BMIClassification ===
        value.nutritionalStatus?.BMIClassification &&
      option.nutritionalStatus?.heightForAge ===
        value.nutritionalStatus?.heightForAge;

    const isAcademicYearEqual =
      option.academicYear?.schoolYear === value.academicYear?.schoolYear;

    return (
      option.lrn === value.lrn &&
      option.lastName === value.lastName &&
      option.firstName === value.firstName &&
      option.middleName === value.middleName &&
      option.nameExtension === value.nameExtension &&
      option.gender === value.gender &&
      option.birthDate === value.birthDate &&
      isClassProfileEqual &&
      isNutritionEqual &&
      isAcademicYearEqual
    );
  };

  const ReadOnlyTextField = ({ control, name, label, value }) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            label={label}
            fullWidth
            margin="normal"
            {...field}
            value={value || ""}
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      />
    );
  };

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        className="overflow-auto"
      >
        <DialogTitle>
          {selectedRecord ? "Edit Medical Checkup" : "Add Medical Checkup"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Enter medical checkup details:
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            {...field}
                            label="Date of Examination"
                            maxDate={new Date()}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                margin: "normal",
                                error: !!error,
                                helperText: error?.message,
                              },
                            }}
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
                            freeSolo
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
                      <ReadOnlyTextField
                        control={control}
                        name="schoolYear"
                        label="School Year"
                        value={
                          selectedStudent
                            ? selectedStudent.academicYear
                              ? selectedStudent.academicYear.schoolYear
                              : selectedStudent.schoolYear
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </LocalizationProvider>
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
                    <ReadOnlyTextField
                      control={control}
                      name="name"
                      label="Name"
                      value={
                        selectedStudent
                          ? selectedStudent.firstName &&
                            selectedStudent.lastName
                            ? `${selectedStudent.lastName}, ${
                                selectedStudent.firstName
                              }${
                                selectedStudent.middleName
                                  ? ` ${selectedStudent.middleName.charAt(0)}.`
                                  : ""
                              } ${selectedStudent.nameExtension || ""}`.trim()
                            : selectedStudent.name || ""
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="grade"
                      label="Grade"
                      value={
                        selectedStudent
                          ? selectedStudent.classProfile
                            ? selectedStudent.classProfile.grade
                            : selectedStudent.grade
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="section"
                      label="Section"
                      value={
                        selectedStudent
                          ? selectedStudent.classProfile
                            ? selectedStudent.classProfile.section
                            : selectedStudent.section
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="gender"
                      label="Gender"
                      value={
                        selectedStudent
                          ? selectedStudent.classProfile
                            ? selectedStudent.classProfile.grade
                            : selectedStudent.grade
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="birthDate"
                      label="Birthday"
                      value={
                        selectedStudent
                          ? formatDate(selectedStudent.birthDate)
                          : ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <ReadOnlyTextField
                      control={control}
                      name="heightCm"
                      label="Height (cm)"
                      value={
                        selectedStudent
                          ? selectedStudent.nutritionalStatus
                            ? selectedStudent.nutritionalStatus.heightCm
                            : selectedStudent.heightCm
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <ReadOnlyTextField
                      control={control}
                      name="weightKg"
                      label="Weight (kg)"
                      value={
                        selectedStudent
                          ? selectedStudent.nutritionalStatus
                            ? selectedStudent.nutritionalStatus.weightKg
                            : selectedStudent.weightKg
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <ReadOnlyTextField
                      control={control}
                      name="BMI"
                      label="BMI"
                      value={
                        selectedStudent
                          ? selectedStudent.nutritionalStatus
                            ? selectedStudent.nutritionalStatus.BMI
                            : selectedStudent.BMI
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="BMIClassification"
                      label="BMI Classification"
                      value={
                        selectedStudent
                          ? selectedStudent.nutritionalStatus
                            ? selectedStudent.nutritionalStatus
                                .BMIClassification
                            : selectedStudent.BMIClassification
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="heightForAge"
                      label="Height For Age"
                      value={
                        selectedStudent
                          ? selectedStudent.nutritionalStatus
                            ? selectedStudent.nutritionalStatus.heightForAge
                            : selectedStudent.heightForAge
                          : ""
                      }
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
                    <VitalSignInput
                      control={control}
                      name="temperature"
                      label="Temperature"
                      placeholder="36"
                      adornmentText="°C"
                      error={!!errors.temperature}
                      helperText={errors.temperature?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.8}>
                    <VitalSignInput
                      name="bloodPressure"
                      control={control}
                      label="Blood Pressure"
                      placeholder="120/80"
                      adornmentText="mmHg"
                      error={!!errors.bloodPressure}
                      helperText={errors.bloodPressure?.message}
                      onInputValidation={(e) => {
                        const value = e.target.value;
                        const lastChar = value.charAt(value.length - 1);
                        if (isNaN(lastChar) && lastChar !== "/") {
                          e.target.value = value.substring(0, value.length - 1);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <VitalSignInput
                      name="heartRate"
                      control={control}
                      label="Heart Rate"
                      placeholder="80"
                      adornmentText="BPM"
                      error={!!errors.heartRate}
                      helperText={errors.heartRate?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <VitalSignInput
                      name="pulseRate"
                      control={control}
                      label="Pulse Rate"
                      placeholder="80"
                      adornmentText="BPM"
                      error={!!errors.pulseRate}
                      helperText={errors.pulseRate?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <VitalSignInput
                      name="respiratoryRate"
                      control={control}
                      label="Respiratory Rate"
                      placeholder="e.g. 20"
                      adornmentText="breaths/min"
                      error={!!errors.respiratoryRate}
                      helperText={errors.respiratoryRate?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
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
                    <AutoCompleteDropdown
                      control={control}
                      name="visionScreeningLeft"
                      options={visionScreeningOptions}
                      label="Vision (Left)"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="visionScreeningRight"
                      options={visionScreeningOptions}
                      label="Vision (Right)"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="auditoryScreeningLeft"
                      options={auditoryScreeningOptions}
                      label="Hearing (Left)"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="auditoryScreeningRight"
                      options={auditoryScreeningOptions}
                      label="Hearing (Right)"
                      errors={errors}
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
                    <AutoCompleteDropdown
                      control={control}
                      name="scalpScreening"
                      options={scalpScreeningOptions}
                      label="Scalp Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="skinScreening"
                      options={skinScreeningOptions}
                      label="Skin Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="eyesScreening"
                      options={eyesScreeningOptions}
                      label="Eyes Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="earScreening"
                      options={earScreeningOptions}
                      label="Ear Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="noseScreening"
                      options={noseScreeningOptions}
                      label="Nose Issue"
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="mouthScreening"
                      options={mouthNeckThroatOptions}
                      label="Mouth Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="neckScreening"
                      options={mouthNeckThroatOptions}
                      label="Neck Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="throatScreening"
                      options={mouthNeckThroatOptions}
                      label="Throat Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="lungScreening"
                      options={lungsHeartOptions}
                      label="Lungs Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="heartScreening"
                      options={lungsHeartOptions}
                      label="Heart Issue"
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="abdomen"
                      options={abdomenOptions}
                      label="Abdomen Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="deformities"
                      options={deformitiesOptions}
                      label="Deformities"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AutoCompleteDropdown
                      control={control}
                      name="menarche"
                      options={ageMenarcheOptions}
                      label="Menarche"
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
                    <CustomRadioGroup
                      control={control}
                      name="ironSupplementation"
                      label="Iron Supplementation"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomRadioGroup
                      control={control}
                      name="deworming"
                      label="Deworming"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks"
                          margin="normal"
                          multiline
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
              {selectedRecord ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MedicalCheckupForm;
