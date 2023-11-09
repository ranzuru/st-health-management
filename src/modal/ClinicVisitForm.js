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
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import { when } from "yup";

const ClinicVisitForm = (props) => {
  const { open = false, onClose, onDocumentCreate, selectedDocument, initialData } = props;
  const [medicineOption, setMedicineOption] = useState([]);
  const [pcpOption, setPcpOption] = useState([]);
  const [issueDate, setIssueDate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    patient_id: yup.string().nullable(),
    patient_name: yup.string().nullable(),
    patient_age: yup.number().min(1, "Age must be at least 1").required("Age is required"),
    patient_type: yup.string().required("Type is required"),
    pcp_id: yup.string().required("Primary Care Provider (PCP) is required"),
    medicine_id: yup.string().required("Medicine is required"),
    quantity: yup.number().required("Quantity is required"),
    dosage: yup.string().required("Dosage is required"),
    frequency: yup.string().required("Frequency is required"),
    duration: yup.string().required("Duration LRN is required"),
    issueDate: yup.date().required("Date of Issue is required"),
    reason: yup.string().required("Reason/s is required"),
  });

  const handleIssueDateChange = (date) => {
    setIssueDate(date || null);
    setValue("issueDate", date);
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
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      patient_id: "",
      patient_name: "",
      patient_age: 1,
      patient_type: "Student",
      pcp_id: "",
      medicine_id: "",
      quantity: 1,
      dosage: "300ml",
      frequency: "1/day",
      duration: "1day",
      issueDate: new Date(),
      reason: "",
    },
  });

  // Function to format date string to YYYY-MM-DD
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await axiosInstance.get(
          "/medicineInventory/getBatchTotalWithExpiration"
        );
        if (response.data) {
          // Map advisers to options for the dropdown
          const options = response.data.map((data) => ({
            value: data._id, // Use the unique identifier for the value
            label: `${data.MedicineItemData.product} [Qty: ${data.presentBatchQty}] [Exp: ${dateFormat(data.expirationDate)}]`,
          }));
          setMedicineOption(options);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching medicine data:",
          error
        );
      }
      try {
        const response = await axiosInstance.get(
          "/facultyProfile/fetchFacultyProfiles"
        );
        const adviserRoles = ["Doctor", "District Nurse", "School Nurse", "Intern"];
        if (response.data) {
          // Filter faculty profiles to include only specified roles
        const adjustedResponse = response.data.filter((faculty) => adviserRoles.includes(faculty.role));
          // Map advisers to options for the dropdown
          const options = adjustedResponse.map((adviser) => ({
            value: adviser.employeeId, // Use the unique identifier for the value
            label: `[${adviser.role}] ${adviser.firstName} ${adviser.lastName}`, // Display name
          }));
          setPcpOption(options);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching faculty profiles:",
          error
        );
      }
    };

    fetchDropdownData();

    if (selectedDocument && selectedDocument._id) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [selectedDocument]);

  const handleCreate = async (data) => {
    try {
      
      let itemData, inData, disposalData, adjustmentData;
      try {
        inData = await axiosInstance.get(`medicineInventory/getIn/${data.medicine_id}`);
      } catch (error) {
        showSnackbar("Operation failed: Medicine ID mismatch", "error");
        return;
      }

      try {
        itemData = await axiosInstance.get(`medicineInventory/getItem/${inData.data.itemId}`);
      } catch (error) {
        if (error.response?.data?.error === "Record not found") {
          showSnackbar("Operation failed: Item ID mismatch", "error");
          return;
        }
      }
      
      try {
        disposalData = await axiosInstance.get(`medicineInventory/getDisposalBatchId/${inData.data.batchId}`);
        adjustmentData = await axiosInstance.get(`medicineInventory/getAdjustmentBatchId/${inData.data.batchId}`);
      } catch (error) {
        showSnackbar("Operation failed: Batch ID mismatch", "error");
        return;
      }
      
      let oldOverallQuantity, presentDisposalQuantity, updatedOverallQuantity, batchOverallQuantity, disposalTotal, inQuantity, additionAdjustmentTotal, subtractionAdjustmentTotal;

      oldOverallQuantity = itemData.data.overallQuantity
      presentDisposalQuantity = data.quantity;
      inQuantity = inData.data.quantity;
      disposalTotal = disposalData.data.disposalTotal || 0;
      additionAdjustmentTotal = adjustmentData.data.additionTotal || 0;
      subtractionAdjustmentTotal = adjustmentData.data.subtractionTotal || 0;
      
      const presentBatchFormula = () => {
        // PRESENT BATCH QTY WITHOUT DISPOSAL TOTAL
        // in + total addition adjustment - total subtraction adjustment
        // in + total addition adjustment
        // in - total subtraction adjustment
        const adjustedAndIn = inQuantity + additionAdjustmentTotal - subtractionAdjustmentTotal;
        // PRESENT BATCH QTY WITH DISPOSAL TOTAL
        // (in + total addition adjustment - total subtraction adjustment) - previous disposal/s
        // (in + total addition adjustment) - previous disposal/s
        // (in - total subtraction adjustment) - previous disposal/s
        return Math.abs(adjustedAndIn - disposalTotal);
      };
      
      const updatedOverallFormula = () => {
        // present disposal - old overall
        return Math.abs(presentDisposalQuantity - oldOverallQuantity);
      };
      
      // check if the present disposal is less than the current batch overall
      // (present disposal - (PRESENT BATCH QTY WITHOUT DISPOSAL TOTAL) - old overall
      // (present disposal - (PRESENT BATCH QTY WITH DISPOSAL TOTAL) - old overall
      const isOperationValid = (presentBatchQuantity) => {
        if (presentDisposalQuantity <= presentBatchQuantity) {
          updatedOverallQuantity = updatedOverallFormula();
        } else {
          showSnackbar(`Operation Failed: Disposal Quantity (${presentDisposalQuantity}) > Batch Quantity (${presentBatchQuantity})`, "error");
        }
      };
      
      if (!disposalTotal) {
        if (!additionAdjustmentTotal && !subtractionAdjustmentTotal) {
          if (presentDisposalQuantity <= inQuantity) {
            isOperationValid(inQuantity);
          } else {
            showSnackbar(`Operation Failed: Disposal Quantity (${presentDisposalQuantity}) > Batch Quantity (${inQuantity})`, "error");
          }
        } else {
          batchOverallQuantity = presentBatchFormula();
          isOperationValid(batchOverallQuantity);
        }
      } else {
        batchOverallQuantity = Math.abs(inQuantity - disposalTotal);
        isOperationValid(batchOverallQuantity);
      }

      const response = await axiosInstance.post(
        "clinicVisit/post",
        data
      );

      const disposalCustomData = {
        itemId: inData.data.itemId,
        batchId: inData.data.batchId,
        quantity: data.quantity,
        reason: `Clinic Visit Record ID: ${response.data._id}`,
      }
      
      await axiosInstance.post("medicineInventory/postDisposal", disposalCustomData);
  
      await axiosInstance.put(`medicineInventory/putItem/${inData.data.itemId}`, {
        overallQuantity: updatedOverallQuantity,
      });
      
      if (response.data._id) {
        if (typeof onDocumentCreate === "function") {
          onDocumentCreate(response.data);
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
    // Check if selectedDocument is not undefined or null
    if (selectedDocument) {
      // Check if selectedDocument._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(
            `clinicVisit/put/${selectedDocument._id}`,
            data
          );
          if (response.data._id) {
            if (typeof props.onDocumentUpdate === "function") {
              props.onDocumentUpdate(response.data);
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
    handleIssueDateChange(new Date());
  };
  // useEffect to populate form fields when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {

      setValue("patient_id", selectedDocument.patient_id || "");
      setValue("patient_name", selectedDocument.patient_name || "");
      setValue("patient_age", selectedDocument.patient_age || "");
      setValue("patient_type", selectedDocument.patient_type || "");
      setValue("pcp_id", selectedDocument.pcp_id || "");
      setValue("medicine_id", selectedDocument.medicine_id || "");
      setValue("quantity", selectedDocument.quantity || "");
      setValue("dosage", selectedDocument.dosage || "");
      setValue("frequency", selectedDocument.frequency || "");
      setValue("duration", selectedDocument.duration || "");
      setValue("issueDate", selectedDocument.issueDate || "");
      setValue("reason", selectedDocument.reason || "");
      setValue("admissionHospital", selectedDocument.admissionHospital || "");

      const issueDate = new Date(selectedDocument.issueDate);

      setIssueDate(issueDate);
    }
  }, [selectedDocument, setValue, medicineOption, pcpOption]);

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
          {selectedDocument ? "Edit Record" : "Add Record"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter clinic visit record details:</DialogContentText>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Patient ID (Stud. LRN/ Empl. ID)"
              {...register("patient_id")}
              fullWidth
              required={watch("patient_type") !== "Other"}
              disabled={isUpdate || watch("patient_type") === "Other"}
              error={!!errors.patient_id}
              helperText={errors.patient_id?.message}
            />
              </Grid>
              <Grid item xs={12} sm={7} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Patient Name"
              {...register("patient_name")}
              fullWidth
              required={watch("patient_type") === "Other"}
              disabled={isUpdate || watch("patient_type") !== "Other"}
              error={!!errors.patient_name}
              helperText={errors.patient_name?.message}
            />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Age"
              {...register("patient_age")}
              fullWidth
              required
              type="number"
              inputProps={{ min: 1, step: "1" }}
              disabled={isUpdate}
              error={!!errors.patient_age}
              helperText={errors.patient_age?.message}
            />
              </Grid>
              <Grid item xs={12} sm={4} className="flex items-center">
              <Controller
              name="patient_type"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.patient_type}
                >
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select labelId="type-label" label="Type" {...field} disabled={isUpdate}>
                      <MenuItem value="Student">Student</MenuItem>
                      <MenuItem value="Faculty">Faculty</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.patient_type && (
                    <FormHelperText>{errors.patient_type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl error={!!errors.issueDate} margin="normal">
                  <DatePicker
                    label="Issue Date"
                    value={issueDate}
                    onChange={handleIssueDateChange}
                  />
                  <FormHelperText>
                    {errors.issueDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Controller
              name="pcp_id"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.pcp_id}
                >
                  <InputLabel id="pcp-label">Primary Care Provider (PCP)</InputLabel>
                  <Select labelId="pcp-label" label="Primary Care Provider (PCP)" {...field} disabled={isUpdate}>
                    {pcpOption.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.pcp_id && (
                    <FormHelperText>{errors.pcp_id.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="medicine_id"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.medicine_id}
                >
                  <InputLabel id="medicine-label">Medicine</InputLabel>
                  <Select labelId="medicine-label" label="Medicine" {...field} disabled={isUpdate}>
                    {medicineOption.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.medicine_id && (
                    <FormHelperText>{errors.medicine_id.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} className="flex items-center">
                <TextField
                autoFocus
                margin="normal"
                label="Quantity"
                {...register("quantity")}
                fullWidth
                required
                type="number"
                inputProps={{ min: 0, step: "1" }}
                disabled={isUpdate}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                />
                </Grid>
                <Grid item xs={12} sm={6} className="flex items-center">
                <TextField
                autoFocus
                margin="normal"
                label="Dosage"
                {...register("dosage")}
                fullWidth
                required
                disabled={isUpdate}
                error={!!errors.dosage}
                helperText={errors.dosage?.message}
                />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Frequency"
              {...register("frequency")}
              fullWidth
              required
              disabled={isUpdate}
              error={!!errors.frequency}
              helperText={errors.frequency?.message}
            />
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <TextField
              autoFocus
              margin="normal"
              label="Duration"
              {...register("duration")}
              fullWidth
              required
              disabled={isUpdate}
              error={!!errors.duration}
              helperText={errors.duration?.message}
            />
              </Grid>
            </Grid>
            <TextField
            autoFocus
              margin="normal"
              label="Reason/s"
              {...register("reason")}
              fullWidth
              required
              multiline
              error={!!errors.reason}
              helperText={errors.reason?.message}
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

export default ClinicVisitForm;