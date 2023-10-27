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
// Imports Validation
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// React-hook-form imports
import { useForm, Controller } from "react-hook-form";
// axios-instance
import axiosInstance from "../config/axios-instance";
// csv reader
import Papa from "papaparse";

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
    return date.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const nutritionalStatusValidationSchema = Yup.object().shape({
    dateMeasured: Yup.date()
      .required("Date measured is required")
      .max(new Date(), "Date cannot be in the future"),
    lrn: Yup.string(),
    weightKg: Yup.number()
      .transform((value, originalValue) =>
        isNaN(originalValue) || originalValue === "" ? null : value
      )
      .positive("Weight must be positive")
      .max(150, "Weight cannot be more than 150 kg")
      .test("is-null", "Weight is required", (value) => value !== null),
    heightCm: Yup.number()
      .transform((value, originalValue) =>
        isNaN(originalValue) || originalValue === "" ? null : value
      )
      .positive("Height must be positive")
      .max(250, "Height cannot be more than 250 cm")
      .test("is-null", "Height is required", (value) => value !== null),
    BMI: Yup.number()
      .transform((value, originalValue) =>
        isNaN(originalValue) || originalValue === "" ? null : value
      )
      .positive("BMI must be positive")
      .test("is-null", "BMI is required", (value) => value !== null),
    BMIClassification: Yup.string()
      .required("BMI Classification is required")
      .oneOf(
        ["Severely Wasted", "Wasted", "Normal", "Overweight", "Obese"],
        "Invalid BMI Classification"
      ),
    heightForAge: Yup.string()
      .required("Height for Age is required")
      .oneOf(
        ["Severely Stunted", "Stunted", "Normal", "Tall"],
        "Invalid Height for Age classification"
      ),
    beneficiaryOfSBFP: Yup.boolean()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .required("Beneficiary of SBFP is required"),
    measurementType: Yup.string().required("Measurement Type is required"),
    remarks: Yup.string().max(500, "Remarks cannot exceed 500 characters"),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      dateMeasured: getTodayDate(),
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
    const { studentProfile } = newRecord;

    const name =
      studentProfile && studentProfile.middleName
        ? `${studentProfile.lastName}, ${
            studentProfile.firstName
          } ${studentProfile.middleName.charAt(0)}. ${
            studentProfile.nameExtension || ""
          }`.trim()
        : "N/A";

    return {
      ...newRecord,
      id: newRecord._id,
      lrn: studentProfile?.lrn,
      gender: studentProfile?.gender,
      age: studentProfile?.age,
      birthDate: studentProfile?.birthDate,
      grade: studentProfile?.classProfile?.grade,
      section: studentProfile?.classProfile?.section,
      name,
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
      console.error("An error occurred during adding record:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
        const errorMsg =
          error.response.data.error || "An error occurred during adding";
        showSnackbar(errorMsg, "error");
      } else {
        showSnackbar("An error occurred during adding", "error");
      }
    }
  };

  const handleUpdateNutritionalStatus = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedRecord.lrn, // using selectedRecord's LRN here
        measurementType: data.measurementType, // using the measurementType from the form data
      };

      // Incorporate LRN and measurementType in the URL
      const response = await axiosInstance.put(
        `/nutritionalStatus/update/${payload.lrn}/${payload.measurementType}`,
        payload
      );

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
      console.error("Server responded with:", error.response.data);
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

  const handleSaveOrUpdate = (data) => {
    if (selectedRecord && selectedRecord.lrn) {
      handleUpdateNutritionalStatus(data);
    } else {
      handleCreateNutritionalStatus(data);
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
      if (lrnInput.length > 2) {
        // Change to any number suitable to start a search
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/studentProfile/search/${lrnInput}`
          );
          setLrnOptions(response.data);
        } catch (error) {
          console.error("Error fetching LRN:", error);
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
      const formattedDate = new Date(selectedRecord.dateMeasured)
        .toISOString()
        .split("T")[0];
      setSelectedStudent(selectedRecord);
      setValue("lrn", selectedRecord.lrn || "");
      setValue("dateMeasured", formattedDate);
      setValue("name", selectedRecord.name || "");
      setValue("gender", selectedRecord.gender || "");
      setValue("age", selectedRecord.age || "");
      setValue("birthDate", selectedRecord.birthDate || "");
      setValue("grade", selectedRecord.grade || "");
      setValue("section", selectedRecord.section || "");
      setValue("heightCm", selectedRecord.heightCm || "");
      setValue("weightKg", selectedRecord.weightKg || "");
      setValue("BMI", selectedRecord.BMI || "");
      setValue("BMIClassification", selectedRecord.BMIClassification || "");
      setValue("heightForAge", selectedRecord.heightForAge || "");
      setValue("beneficiaryOfSBFP", selectedRecord.beneficiaryOfSBFP || "");
      setValue("measurementType", selectedRecord.measurementType || "");
      setValue("remarks", selectedRecord.remarks || "");
    }
  }, [selectedRecord, setValue]);

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="dateMeasured"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date Measured"
                      margin="normal"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dateMeasured}
                      helperText={errors?.dateMeasured?.message}
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
                      isOptionEqualToValue={(option, value) =>
                        option.lrn === value.lrn &&
                        option.lastName === value.lastName &&
                        option.firstName === value.firstName &&
                        option.middleName === value.middleName &&
                        option.nameExtension === value.nameExtension &&
                        option.gender === value.gender &&
                        option.age === value.age &&
                        option.birthDate === value.birthDate &&
                        option.classProfile.grade ===
                          value.classProfile.grade &&
                        option.classProfile.section ===
                          value.classProfile.section
                      }
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
                          error={!!errors.lrn}
                          helperText={errors?.lrn?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Name"
                      margin="normal"
                      fullWidth
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
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Gender"
                      margin="normal"
                      fullWidth
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
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Age"
                      margin="normal"
                      fullWidth
                      {...field}
                      value={selectedStudent ? selectedStudent.age : ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Birthday"
                      margin="normal"
                      fullWidth
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
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Grade Level"
                      margin="normal"
                      fullWidth
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
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Section"
                      margin="normal"
                      fullWidth
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

                        // Check if the value matches the desired pattern (only numbers, possibly a single dot)
                        const regex = /^\d*\.?\d*$/;
                        if (regex.test(value)) {
                          // Check if value starts with a ".", if so prepend "0"
                          if (value.startsWith(".")) {
                            event.target.value = "0" + value;
                          }
                          field.onChange(event); // If valid, propagate the onChange event
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

                        // Check if the value matches the desired pattern (only numbers, possibly a single dot)
                        const regex = /^\d*\.?\d*$/;
                        if (regex.test(value)) {
                          // Check if value starts with a ".", if so prepend "0"
                          if (value.startsWith(".")) {
                            event.target.value = "0" + value;
                          }
                          field.onChange(event); // If valid, propagate the onChange event
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
