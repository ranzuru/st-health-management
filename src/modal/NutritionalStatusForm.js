import { useState, useEffect } from "react";
// MUI components import
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// Imports Validation
import { nutritionalStatusValidationSchema } from "../schemas/nutritionalStatusValidation";
import { yupResolver } from "@hookform/resolvers/yup";
// React-hook-form imports
import { useForm, Controller } from "react-hook-form";
// axios-instance
import axiosInstance from "../config/axios-instance";
// csv reader
import Papa from "papaparse";
import { parseISO } from "date-fns";

const NutritionalStatusForm = (props) => {
  const {
    open = false,
    onClose,
    initialData,
    selectedRecord,
    addNewNutritionalStatus,
    isEditing,
    onCheckUpdate,
  } = props;
  const [lrnInput, setLrnInput] = useState(
    selectedRecord ? selectedRecord.lrn : ""
  );
  const [loading, setLoading] = useState(false);
  const [lrnOptions, setLrnOptions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedLRN, setSelectedLRN] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [bmiData, setBmiData] = useState([]);
  const [heightForAgeData, setHeightForAgeData] = useState([]);

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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      dateMeasured: new Date(),
      lrn: "",
      weightKg: "",
      heightCm: "",
      BMI: "",
      BMIClassification: "",
      heightForAge: "",
      beneficiaryOfSBFP: false,
      measurementType: "",
      remarks: "",
    },
    resolver: yupResolver(nutritionalStatusValidationSchema),
  });

  const enrichNewRecord = (newRecord) => {
    const {
      classEnrollment: { student, academicYear, classProfile } = {},
      ...rest
    } = newRecord;

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

    return {
      ...rest,
      id: newRecord._id,
      name,
      lrn,
      age,
      gender,
      address,
      birthDate,
      grade,
      section,
      schoolYear,
    };
  };

  const handleCreateNutritionalStatus = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedLRN,
      };
      const response = await axiosInstance.post(
        "/nutritionalStatus/create",
        payload
      );
      if (response.data && response.data.newRecord) {
        let enrichedNewRecord = enrichNewRecord(response.data.newRecord);
        if (typeof addNewNutritionalStatus === "function") {
          addNewNutritionalStatus(enrichedNewRecord);
        }

        showSnackbar("Successfully added record", "success");
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

  const handleUpdateNutritionalStatus = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedRecord.lrn,
        measurementType: data.measurementType,
      };

      console.log("Payload before UPDATE API call:", payload);
      const response = await axiosInstance.put(
        `/nutritionalStatus/update/${payload.lrn}/${payload.measurementType}`,
        payload
      );
      console.log("Server response after UPDATE:", response.data);
      if (response.data && response.data._id) {
        const enrichedUpdatedRecord = enrichNewRecord(response.data);

        if (onCheckUpdate) {
          onCheckUpdate(enrichedUpdatedRecord);
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

  const handleSaveOrUpdate = (data) => {
    if (selectedRecord && selectedRecord.lrn) {
      handleUpdateNutritionalStatus(data);
    } else {
      handleCreateNutritionalStatus(data);
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

  const handleClose = () => {
    reset();
    onClose();
    setSelectedLRN(null);
    setLrnInput("");
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (lrnInput.length > 0) {
        // Change to any number suitable to start a search
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/nutritionalStatus/search/${lrnInput}`
          );
          setLrnOptions(response.data);
        } catch (error) {
          showSnackbar(
            "No student with the provided LRN found in the system.",
            "error"
          );
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [lrnInput]);

  const loadCSVData = () => {
    Papa.parse(process.env.PUBLIC_URL + "/bmi/combined_bmi_updated.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: function (results) {
        setBmiData(results.data);
      },
    });
    // Load Height-for-Age Data
    Papa.parse(process.env.PUBLIC_URL + "/bmi/HeightForAge_Combined.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: function (results) {
        setHeightForAgeData(results.data);
      },
    });
  };

  useEffect(() => {
    loadCSVData();
  }, []);

  const height = watch("heightCm"); // Watch the height field
  const weight = watch("weightKg"); // Watch the weight field
  useEffect(() => {
    if (height && weight && selectedStudent) {
      const birthDate = new Date(selectedStudent.birthDate);
      const now = new Date();
      const ageInMonths = Math.floor(
        (now - birthDate) / (1000 * 60 * 60 * 24 * 30.44)
      );

      // Calculate BMI
      const calculatedBmi = (
        parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)
      ).toFixed(2);
      // Find the BMI category
      const bmiCategory = bmiData.find((row) => {
        return (
          row.Month === ageInMonths && row.Gender === selectedStudent.gender
        );
      });

      if (bmiCategory) {
        let categoryLabel = "Unknown";
        const bmiValue = parseFloat(calculatedBmi);

        const epsilon = 0.01;

        if (bmiValue <= parseFloat(bmiCategory["Wasted From"]) + epsilon) {
          categoryLabel = "Severely Wasted";
        } else if (
          bmiValue >= parseFloat(bmiCategory["Wasted From"]) - epsilon &&
          bmiValue <= parseFloat(bmiCategory["Wasted To"]) + epsilon
        ) {
          categoryLabel = "Wasted";
        } else if (
          bmiValue >= parseFloat(bmiCategory["Normal From"]) - epsilon &&
          bmiValue <= parseFloat(bmiCategory["Normal To"]) + epsilon
        ) {
          categoryLabel = "Normal";
        } else if (
          bmiValue >= parseFloat(bmiCategory["Overweight From"]) - epsilon &&
          bmiValue <= parseFloat(bmiCategory["Overweight To"]) + epsilon
        ) {
          categoryLabel = "Overweight";
        } else if (
          bmiValue >
          parseFloat(bmiCategory["Overweight To"]) - epsilon
        ) {
          categoryLabel = "Obese";
        }

        setValue("BMIClassification", categoryLabel);
      }

      const heightCategory = heightForAgeData.find((row) => {
        return (
          row.Months === ageInMonths && row.Gender === selectedStudent.gender
        );
      });

      if (heightCategory) {
        let categoryLabel = "Unknown";
        const heightValue = parseFloat(height).toFixed(2);

        const trimKeys = (obj) => {
          return Object.keys(obj).reduce(
            (acc, key) => ({
              ...acc,
              [key.trim()]: obj[key],
            }),
            {}
          );
        };

        const trimmedHeightCategory = trimKeys(heightCategory);

        const epsilon = 0.1; // Small epsilon value for comparison

        if (
          heightValue <=
          parseFloat(trimmedHeightCategory["Severely Stunted"]) + epsilon
        ) {
          categoryLabel = "Severely Stunted";
        } else if (
          heightValue >=
            parseFloat(trimmedHeightCategory["Stunted Start"]) - epsilon &&
          heightValue <=
            parseFloat(trimmedHeightCategory["Stunted End"]) + epsilon
        ) {
          categoryLabel = "Stunted";
        } else if (
          heightValue >=
            parseFloat(trimmedHeightCategory["Normal Start"]) - epsilon &&
          heightValue <=
            parseFloat(trimmedHeightCategory["Normal End"]) + epsilon
        ) {
          categoryLabel = "Normal";
        } else if (
          heightValue >=
          parseFloat(trimmedHeightCategory["Tall"]) - epsilon
        ) {
          categoryLabel = "Tall";
        }

        setValue("heightForAge", categoryLabel);
      }

      setValue("BMI", calculatedBmi);
    }
  }, [height, weight, selectedStudent, bmiData, heightForAgeData, setValue]);

  const BMIClassification = watch("BMIClassification");

  useEffect(() => {
    if (
      BMIClassification === "Wasted" ||
      BMIClassification === "Severely Wasted"
    ) {
      setValue("beneficiaryOfSBFP", true);
    } else {
      setValue("beneficiaryOfSBFP", false);
    }
  }, [BMIClassification, setValue]);

  useEffect(() => {
    if (selectedRecord) {
      const keys = [
        "lrn",
        "name",
        "age",
        "gender",
        "grade",
        "section",
        "schoolYear",
        "birthDate",
        "address",
        "heightCm",
        "weightKg",
        "BMI",
        "BMIClassification",
        "heightForAge",
        "beneficiaryOfSBFP",
        "measurementType",
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

      setSelectedStudent(selectedRecord);
      const dateFields = ["dateMeasured"];
      dateFields.forEach((dateField) => {
        const parsedDate = selectedRecord[dateField]
          ? parseISO(selectedRecord[dateField])
          : null;
        setValue(dateField, parsedDate);
      });
    }
  }, [selectedRecord, setValue]);

  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;

    const isClassProfileEqual =
      option.classProfile?.grade === value.classProfile?.grade &&
      option.classProfile?.section === value.classProfile?.section;

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
      isClassProfileEqual &&
      isAcademicYear
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
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>
          {selectedRecord ? "Edit Record" : "Create Record"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Enter nutritional status record:
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5}>
                  <Controller
                    name="dateMeasured"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Date Measure"
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: { marginTop: "15px" },
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        isOptionEqualToValue={isOptionEqualToValue}
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
              </Grid>
            </LocalizationProvider>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <ReadOnlyTextField
                  control={control}
                  name="name"
                  label="Name"
                  value={
                    selectedStudent
                      ? selectedStudent.firstName && selectedStudent.lastName
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
                  name="age"
                  label="Age"
                  value={selectedStudent ? selectedStudent.age : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ReadOnlyTextField
                  control={control}
                  name="birthDate"
                  label="Birthday"
                  value={
                    selectedStudent ? formatDate(selectedStudent.birthDate) : ""
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.5}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="heightCm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Height(cm)"
                      margin="normal"
                      fullWidth
                      error={!!errors.heightCm}
                      helperText={errors?.heightCm?.message}
                      onChange={(event) => {
                        const value = event.target.value;
                        const regex = /^\d*\.?\d*$/;
                        if (regex.test(value)) {
                          if (value.startsWith(".")) {
                            event.target.value = "0" + value;
                          }
                          field.onChange(event);
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="weightKg"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Weight(kg)"
                      margin="normal"
                      fullWidth
                      error={!!errors.weightKg}
                      helperText={errors?.weightKg?.message}
                      onChange={(event) => {
                        const value = event.target.value;
                        const regex = /^\d*\.?\d*$/;
                        if (regex.test(value)) {
                          if (value.startsWith(".")) {
                            event.target.value = "0" + value;
                          }
                          field.onChange(event);
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="BMI"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="BMI"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.BMI}
                      helperText={errors?.BMI?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="BMIClassification"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="BMI Classification"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.BMIClassification}
                      helperText={errors?.BMIClassification?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="heightForAge"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Height For Age"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.heightForAge}
                      helperText={errors?.heightForAge?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.8}>
                <Controller
                  name="beneficiaryOfSBFP"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={!!errors.beneficiaryOfSBFP}
                    >
                      <InputLabel id="beneficiaryOfSBFP-label">
                        Beneficiary of SBFP
                      </InputLabel>
                      <Select
                        labelId="beneficiaryOfSBFP-label"
                        label="Beneficiary of SBFP"
                        {...field}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                      <FormHelperText>
                        {errors?.beneficiaryOfSBFP?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.8}>
                <Controller
                  name="measurementType"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={!!errors.measurementType}
                    >
                      <InputLabel id="measurementType-label">
                        Measurement Type
                      </InputLabel>
                      <Select
                        labelId="measurementType-label"
                        label="Measurement Type"
                        {...field}
                      >
                        <MenuItem value="PRE">Pre</MenuItem>
                        <MenuItem value="POST">Post</MenuItem>
                      </Select>
                      <FormHelperText>
                        {errors?.measurementType?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Remarks"
                  margin="normal"
                  multiline
                  error={!!errors.remarks}
                  helperText={errors?.remarks?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedRecord ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NutritionalStatusForm;
