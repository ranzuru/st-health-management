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
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// Yup imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { parseISO } from "date-fns";

const DengueForm = (props) => {
  const {
    open,
    onClose,
    initialData,
    addNewDengueRecord,
    selectedRecord,
    onCheckupUpdate,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedLRN, setSelectedLRN] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lrnInput, setLrnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lrnOptions, setLrnOptions] = useState([]);
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

  const validationSchema = yup.object().shape({
    lrn: yup.string(),
    dateOfOnset: yup.date().required("Date of Onset is required"),
    dateOfAdmission: yup.date().nullable(),
    hospitalAdmission: yup.string().nullable(),
    dateOfDischarge: yup.date().nullable(),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      lrn: "",
      dateOfOnset: null,
      dateOfAdmission: null,
      hospitalAdmission: "",
      dateOfDischarge: null,
    },
    resolver: yupResolver(validationSchema),
  });

  const enrichStudentInfo = (newDengueRecord) => {
    const {
      classEnrollment: { student, academicYear, classProfile } = {},
      ...rest
    } = newDengueRecord;

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
      id: newDengueRecord._id,
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

  const handleCreateDengueRecord = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedLRN,
      };

      const response = await axiosInstance.post(
        "/dengueMonitoring/create",
        payload
      );
      if (response.data && response.data.newDengueRecord) {
        let enrichedNewStudentInfo = enrichStudentInfo(
          response.data.newDengueRecord
        );

        if (typeof addNewDengueRecord === "function") {
          addNewDengueRecord(enrichedNewStudentInfo);
        }
        showSnackbar("Successfully added dengue record", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding dengue record:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showSnackbar(error.response.data.error, "error");
      } else {
        showSnackbar("An error occurred during adding", "error");
      }
    }
  };

  const handleUpdateDengueRecord = async (data) => {
    try {
      const payload = {
        ...data,
        lrn: selectedRecord.lrn,
      };
      const response = await axiosInstance.put(
        `/dengueMonitoring/update/${payload.lrn}`,
        payload
      );

      if (response.data && response.data._id) {
        const enrichedUpdatedRecord = enrichStudentInfo(response.data);
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
      if (selectedRecord && selectedRecord.lrn) {
        await handleUpdateDengueRecord(data);
      } else {
        await handleCreateDengueRecord(data);
      }
    } catch (error) {
      console.error("Error in handleSaveOrUpdateMedicalCheckup", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (lrnInput.length > 0) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/dengueMonitoring/search/${lrnInput}`
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

  const handleClose = () => {
    reset();
    onClose();
    setSelectedLRN(null);
    setLrnInput("");
    setSelectedStudent(null);
  };

  useEffect(() => {
    if (selectedRecord) {
      const keys = [
        "lrn",
        "name",
        "age",
        "gender",
        "grade",
        "section",
        "hospitalAdmission",
        "birthDate",
        "address",
      ];
      keys.forEach((key) => {
        setValue(key, selectedRecord[key] || "");
      });
      setSelectedStudent(selectedRecord);

      const dateFields = ["dateOfOnset", "dateOfAdmission", "dateOfDischarge"];
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
      option.address === value.address &&
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
            multiline={name === "address"}
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
          {selectedRecord ? "Edit Dengue Record" : "Add Dengue Record"}
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
                  label="Sender"
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
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <ReadOnlyTextField
                  control={control}
                  name="address"
                  label="Address"
                  value={selectedStudent ? selectedStudent.address : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="hospitalAdmission"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Hospital Admission"
                      margin="normal"
                      fullWidth
                      {...field}
                      error={!!errors.hospitalAdmission}
                      helperText={errors.hospitalAdmission?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5}>
                  <Controller
                    name="dateOfOnset"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Date On Set"
                        required
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="dateOfAdmission"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Date of Admission"
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="dateOfDischarge"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Date of Discharge"
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
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

export default DengueForm;
