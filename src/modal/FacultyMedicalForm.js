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
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { facultyCheckupValidation } from "../schemas/facultyCheckupValidation";
import {
  visionScreeningOptions,
  auditoryScreeningOptions,
  scalpScreeningOptions,
  skinScreeningOptions,
  eyesScreeningOptions,
  earScreeningOptions,
  noseScreeningOptions,
  mouthNeckThroatOptions,
  lungsHeartOptions,
  abdomenOptions,
  deformitiesOptions,
} from "../constants/dropdownOptions";
import AutoCompleteDropdown from "../constants/autoCompleteDropdown";
import { parseISO } from "date-fns";
import VitalSignInput from "../constants/vitalSignInput";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CustomSnackbar from "../components/CustomSnackbar";

const FacultyMedicalForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewMedicalCheckup,
    selectedRecord,
    onCheckupUpdate,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [employeeIdOptions, setEmployeeIdOptions] = useState([]);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
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
      employeeId: "",
      weightKg: "",
      heightCmp: "",
      temperature: "",
      bloodPressure: "",
      schoolYear: "",
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
      remarks: "",
    },
    resolver: yupResolver(facultyCheckupValidation),
  });

  const enrichMedicalCheckup = (newCheckup, classProfileData) => {
    const { facultyProfile, academicYear, ...rest } = newCheckup;

    const name =
      facultyProfile && facultyProfile.middleName
        ? `${facultyProfile.lastName}, ${
            facultyProfile.firstName
          } ${facultyProfile.middleName.charAt(0)}. ${
            facultyProfile.nameExtension
          }`.trim()
        : "N/A";

    return {
      ...rest,
      id: rest._id,
      employeeId: facultyProfile?.employeeId,
      name,
      age: facultyProfile.age,
      gender: facultyProfile.gender,
      birthDate: facultyProfile?.birthDate,
      section: classProfileData?.section,
      grade: classProfileData?.section,
      schoolYear: academicYear?.schoolYear,
    };
  };

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
        employeeId: selectedRecord.employeeId,
      };
      const response = await axiosInstance.put(
        `/facultyMedical/update/${payload.employeeId}`,
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
      if (selectedRecord && selectedRecord.employeeId) {
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

  const handleClose = () => {
    reset();
    onClose();
    setSelectedEmployeeId(null);
    setEmployeeIdInput("");
    setSelectedFaculty(null);
  };

  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const res = await axiosInstance.get(
          "/classEnrollment/fetchActiveSchoolYears"
        );
        setSchoolYears(res.data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    };

    fetchSchoolYears();
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      const keys = [
        "employeeId",
        "name",
        "gender",
        "birthDate",
        "schoolYear",
        "heightCm",
        "weightKg",
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
        "remarks",
      ];
      keys.forEach((key) => {
        setValue(key, selectedRecord[key] || "");
      });
      setSelectedFaculty(selectedRecord);
      const dateFields = ["dateOfExamination"];
      dateFields.forEach((dateField) => {
        const parsedDate = selectedRecord[dateField]
          ? parseISO(selectedRecord[dateField])
          : null;
        setValue(dateField, parsedDate);
      });
    }
  }, [selectedRecord, setValue]);

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
  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;

    const isAcademicYear =
      option.academicYear?.schoolYear === value.academicYear?.schoolYear;

    return (
      option.lrn === value.lrn &&
      option.lastName === value.lastName &&
      option.firstName === value.firstName &&
      option.middleName === value.middleName &&
      option.nameExtension === value.nameExtension &&
      option.age === value.age &&
      option.gender === value.gender &&
      option.birthDate === value.birthDate &&
      isAcademicYear
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
                            isOptionEqualToValue={isOptionEqualToValue}
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name="schoolYear"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.schoolYear}
                          >
                            <InputLabel id="school-year-label">
                              School Year
                            </InputLabel>
                            <Select
                              labelId="school-year-label"
                              label="School Year"
                              {...field}
                            >
                              {schoolYears.map((year, index) => (
                                <MenuItem key={index} value={year}>
                                  {year}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.schoolYear && (
                              <FormHelperText>
                                {errors.schoolYear.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
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
                  Faculty's Basic Info:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ReadOnlyTextField
                      control={control}
                      name="name"
                      label="Name"
                      value={
                        selectedFaculty
                          ? selectedFaculty.middleName &&
                            selectedFaculty.firstName &&
                            selectedFaculty.lastName
                            ? `${selectedFaculty.lastName}, ${
                                selectedFaculty.firstName
                              } ${selectedFaculty.middleName.charAt(0)}. ${
                                selectedFaculty.nameExtension
                              }`.trim()
                            : selectedFaculty.name
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="gender"
                      label="Gender"
                      value={selectedFaculty ? selectedFaculty.gender : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="age"
                      label="Age"
                      value={selectedFaculty ? selectedFaculty.age : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <ReadOnlyTextField
                      control={control}
                      name="birthDate"
                      label="Birthday"
                      value={
                        selectedFaculty && selectedFaculty.birthDate
                          ? formatDate(selectedFaculty.birthDate)
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
                  Faculty's Vital Statistics:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <VitalSignInput
                      control={control}
                      name="heightCm"
                      label="Height (cm)"
                      placeholder="120"
                      adornmentText="cm"
                      error={!!errors.heightCm}
                      helperText={errors.heightCm?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <VitalSignInput
                      control={control}
                      name="weightKg"
                      label="WeightKg (kg)"
                      placeholder="20"
                      adornmentText="kg"
                      error={!!errors.weightKg}
                      helperText={errors.weightKg?.message}
                      onInputValidation={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                    />
                  </Grid>
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
                  <Grid item xs={12} sm={6} md={2}>
                    <AutoCompleteDropdown
                      control={control}
                      name="skinScreening"
                      options={skinScreeningOptions}
                      label="Skin Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <AutoCompleteDropdown
                      control={control}
                      name="eyesScreening"
                      options={eyesScreeningOptions}
                      label="Eyes Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <AutoCompleteDropdown
                      control={control}
                      name="earScreening"
                      options={earScreeningOptions}
                      label="Ear Issue"
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
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
                </Grid>
                <Grid container spacing={2}>
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

export default FacultyMedicalForm;
