import { useState, useEffect } from "react";
// axiosInstance import
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
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
// Yup imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

const ClassEnrollmentForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewEnrolledStudents,
    selectedRecord,
    onUpdate,
    isEditing,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedLRN, setSelectedLRN] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lrnInput, setLrnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lrnOptions, setLrnOptions] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [classProfiles, setClassProfiles] = useState([]);
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
    lrn: yup.string(),
    schoolYear: yup.string().required("School year is required"),
    grade: yup.string().required("Grade is required"),
    section: yup.string().required("Section is required"),
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
      lrn: "",
      name: "",
      age: "",
      gender: "",
      birthDate: "",
      schoolYear: "",
      grade: "",
      section: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const enrichEnrollmentInfo = (newEnrollment) => {
    const { student, academicYear, classProfile, ...rest } = newEnrollment;
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
    const schoolYear = academicYear.schoolYear;
    const grade = classProfile.grade;
    const section = classProfile.section;

    const advisorFirstName = classProfile?.faculty?.firstName;
    const advisorLastName = classProfile?.faculty?.lastName;
    const faculty =
      advisorLastName || advisorFirstName
        ? `${advisorLastName || ""}, ${advisorFirstName || ""}`.trim()
        : "N/A";
    return {
      ...rest,
      id: newEnrollment._id,
      lrn,
      age,
      gender,
      address,
      birthDate,
      name,
      schoolYear,
      faculty,
      grade,
      section,
    };
  };

  const handleCreateClassEnrollment = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedLRN,
      };

      const response = await axiosInstance.post(
        "/classEnrollment/create",
        payload
      );

      if (response.data && response.data.newEnrollment) {
        let enrichedNewEnrollment = enrichEnrollmentInfo(
          response.data.newEnrollment
        );

        if (typeof addNewEnrolledStudents === "function") {
          addNewEnrolledStudents(enrichedNewEnrollment);
        }

        showSnackbar("Successfully added class enrollment", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding class enrollment:", error);
      let errorMessage = error.response?.data?.error
        ? error.response.data.error
        : "An error occurred during adding";

      showSnackbar(errorMessage, "error");
    }
  };

  const handleUpdateClassEnrollment = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedRecord.lrn, // Assuming `selectedRecord` is available in this context
      };
      const response = await axiosInstance.put(
        `/classEnrollment/update/${payload.lrn}`,
        payload
      );

      if (response.data && response.data.enrollment) {
        const enrichedUpdatedEnrollment = enrichEnrollmentInfo(
          response.data.enrollment
        );
        if (onUpdate) {
          onUpdate(enrichedUpdatedEnrollment);
        }
        console.log("Updated Data:", response.data.enrollment);
        showSnackbar("Successfully updated class enrollment", "success");
        handleClose();
      } else {
        const errorMsg =
          (response.data && response.data.error) || "Update operation failed";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      console.error(
        "An error occurred during updating class enrollment:",
        error
      );

      const errorMsg =
        error.response?.data?.error || "An error occurred during updating";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleSaveOrUpdate = async (data) => {
    try {
      if (selectedRecord && selectedRecord.lrn) {
        await handleUpdateClassEnrollment(data);
      } else {
        await handleCreateClassEnrollment(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdateMedicalCheckup", error);
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
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/classEnrollment/search/${lrnInput}`
          );
          setLrnOptions(response.data);
        } catch (error) {
          console.error("An error occurred while fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [lrnInput]);

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

  const selectedGrade = watch("grade", "");
  let gradeOptions = Array.from(
    new Set(classProfiles.map((cp) => cp.grade))
  ).sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]));
  const sectionOptions = classProfiles
    .filter((cp) => cp.grade === selectedGrade)
    .map((cp) => cp.section);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/classEnrollment/fetchGradesAndSections"
        );
        const updatedClassProfiles = response.data.map((classProfile) => {
          return {
            ...classProfile,
          };
        });
        setClassProfiles(updatedClassProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      const keys = [
        "lrn",
        "name",
        "age",
        "gender",
        "birthDate",
        "schoolYear",
        "grade",
        "section",
      ];
      keys.forEach((key) => {
        setValue(key, selectedRecord[key] || "");
      });
      setSelectedStudent(selectedRecord);
    }
  }, [selectedRecord, setValue]);

  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;

    return (
      option.lrn === value.lrn &&
      option.firstName === value.firstName &&
      option.lastName === value.lastName &&
      option.middleName === value.middleName &&
      option.nameExtension === value.nameExtension &&
      option.birthday === value.birthday &&
      option.age === value.age &&
      option.gender === value.gender
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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        className="overflow-auto"
      >
        <DialogTitle>
          {selectedRecord ? "Edit Student" : "Add Enrollee Record"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter student details:</DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
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
                          fullWidth
                          margin="normal"
                          label="Student's LRN"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
                <ReadOnlyTextField
                  control={control}
                  name="gender"
                  label="Gender"
                  value={selectedStudent ? selectedStudent.gender : ""}
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
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
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
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <FormControl required fullWidth margin="normal">
                      <InputLabel id="grade-label">Grade Level</InputLabel>
                      <Select
                        labelId="grade-label"
                        label="Grade Level"
                        {...field}
                      >
                        {gradeOptions.map((grade, index) => (
                          <MenuItem key={index} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={!!errors.grade}>
                        {errors.grade?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <FormControl required fullWidth margin="normal">
                      <InputLabel id="section-label">Section</InputLabel>
                      <Select
                        labelId="section-label"
                        label="Section"
                        {...field}
                        value={
                          sectionOptions.includes(field.value)
                            ? field.value
                            : ""
                        }
                      >
                        {sectionOptions.map((section, index) => (
                          <MenuItem key={index} value={section}>
                            {section}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={!!errors.section}>
                        {errors.section?.message}
                      </FormHelperText>
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
              {selectedRecord ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ClassEnrollmentForm;
