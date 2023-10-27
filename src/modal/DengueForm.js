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
// Yup imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

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
    if (!dateString) return ""; // handle null or undefined

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return ""; // handle invalid date

    return date.toISOString().split("T")[0];
  };

  const validationSchema = yup.object().shape({
    lrn: yup.string(),
    dateOfOnset: yup
      .date()
      .required("Date of Onset is required")
      .max(
        yup.ref("dateOfAdmission"),
        "Date of Onset must be before Date of Admission"
      ),
    dateOfAdmission: yup
      .date()
      .required("Date of Admission is required")
      .min(
        yup.ref("dateOfOnset"),
        "Date of Admission must be after Date of Onset"
      )
      .max(
        yup.ref("dateOfDischarge"),
        "Date of Admission must be before Date of Discharge"
      ),
    hospitalAdmission: yup.string().required("Hospital Admission is required"),
    dateOfDischarge: yup
      .date()
      .required("Date of Discharge is required")
      .min(
        yup.ref("dateOfAdmission"),
        "Date of Discharge must be after Date of Admission"
      ),
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
      dateOfOnset: "",
      dateOfAdmission: "",
      hospitalAdmission: "",
      dateOfDischarge: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const enrichStudentInfo = (newDengueRecord) => {
    const { studentProfile, ...rest } = newDengueRecord;

    const lrn = studentProfile?.lrn;
    const age = studentProfile?.age;
    const gender = studentProfile?.gender;
    const address = studentProfile?.address;
    const birthDate = studentProfile?.birthDate;
    const name =
      studentProfile && studentProfile.middleName
        ? `${studentProfile.lastName}, ${
            studentProfile.firstName
          } ${studentProfile.middleName.charAt(0)}. ${
            studentProfile.nameExtension
          }`.trim()
        : "N/A";

    return {
      ...rest,
      id: newDengueRecord._id,
      name,
      lrn,
      age,
      gender,
      address,
      birthDate,
      grade: studentProfile?.classProfile?.grade,
      section: studentProfile?.classProfile?.section,
      academicYear: studentProfile?.classProfile?.academicYear,
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
      if (lrnInput.length > 2) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/dengueMonitoring/search/${lrnInput}`
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
        "birthDate",
        "hospitalAdmission",
        "address",
      ];
      keys.forEach((key) => {
        setValue(key, selectedRecord[key] || "");
      });
      setSelectedStudent(selectedRecord);

      const dateFields = ["dateOfOnset", "dateOfAdmission", "dateOfDischarge"];
      dateFields.forEach((dateField) => {
        const dateObject = new Date(selectedRecord[dateField]);
        const timezoneOffset = dateObject.getTimezoneOffset() * 60000; // in ms
        const localISOTime = new Date(dateObject - timezoneOffset)
          .toISOString()
          .split("T")[0];
        setValue(dateField, localISOTime);
      });
    }
  }, [selectedRecord, setValue]);

  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;

    const isClassProfileEqual =
      option.classProfile?.grade === value.classProfile?.grade &&
      option.classProfile?.section === value.classProfile?.section;

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
      isClassProfileEqual
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
            </Grid>
            <Grid container spacing={2}>
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
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Age"
                      fullWidth
                      margin="normal"
                      {...field}
                      value={selectedStudent ? selectedStudent.age : ""}
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
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Address"
                      fullWidth
                      margin="normal"
                      multiline
                      {...field}
                      value={selectedStudent ? selectedStudent.address : ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="dateOfOnset"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Date of Onset"
                      margin="normal"
                      type="date"
                      {...field}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dateOfOnset}
                      helperText={errors.dateOfOnset?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <Controller
                  name="dateOfAdmission"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Date of Admission"
                      margin="normal"
                      type="date"
                      {...field}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dateOfAdmission}
                      helperText={errors.dateOfAdmission?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="dateOfDischarge"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Date of Discharge"
                      margin="normal"
                      type="date"
                      {...field}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dateOfDischarge}
                      helperText={errors.dateOfDischarge?.message}
                    />
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

export default DengueForm;
