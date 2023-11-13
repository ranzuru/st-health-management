import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axiosInstance from "../config/axios-instance";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import CustomSnackbar from "../components/CustomSnackbar";

const FacultyMedicalInfoDialog = ({
  open,
  onClose,
  facultyMedical,
  refreshRecord,
}) => {
  const [isArchiveConfirmationOpen, setIsArchiveConfirmationOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const showArchiveConfirmation = () => {
    setIsArchiveConfirmationOpen(true);
  };

  const closeArchiveConfirmation = () => {
    setIsArchiveConfirmationOpen(false);
  };

  const handleArchive = async () => {
    closeArchiveConfirmation(); // Close the confirmation dialog before proceeding

    try {
      const response = await axiosInstance.put(
        `facultyMedical/archive/${facultyMedical.id}`
      );

      if (response.status === 200) {
        showSnackbar("Faculty medical record archived successfully", "success");
        onClose(); // Close the student medical info dialog
        refreshRecord(); // Refresh the data
      } else {
        showSnackbar(
          `Failed to archive faculty medical record with status: ${response.status}`,
          "error"
        );
      }
    } catch (error) {
      showSnackbar(
        `Error when trying to archive faculty medical record:,
        ${error}`,
        "error"
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        open={isArchiveConfirmationOpen}
        onClose={closeArchiveConfirmation}
      >
        <DialogTitle>Archive Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to archive this student's medical record?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeArchiveConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleArchive} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle className="bg-gray-100 text-gray-800">
          Student Medical Information
        </DialogTitle>
        <DialogContent className="divide-y divide-gray-200">
          {facultyMedical ? (
            <div className="space-y-6 p-4">
              <div>
                <Typography variant="h6" className="font-semibold">
                  Basic Information
                </Typography>
                <div className="space-y-4">
                  {Object.entries({
                    "Date Of Examination": formatDate(
                      facultyMedical.dateOfExamination
                    ),
                    "Employee Id": facultyMedical.employeeId,
                    Name: facultyMedical.name,
                    Age: facultyMedical.age,
                    Gender: facultyMedical.gender,
                    "Birth Date": formatDate(facultyMedical.birthDate),
                    "School Year": facultyMedical.schoolYear,
                  }).map(([label, value]) => (
                    <Typography
                      key={label}
                      variant="subtitle1"
                      className="font-semibold"
                    >
                      {label}: <span className="text-gray-600">{value}</span>
                    </Typography>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="h6" className="font-semibold">
                  Health Metrics
                </Typography>
                <div className="space-y-4">
                  {Object.entries({
                    "Height (cm)": facultyMedical.heightCm,
                    "Weight (kg)": facultyMedical.weightKg,
                    Temperature: facultyMedical.temperature,
                    "Blood Pressure": facultyMedical.bloodPressure,
                    "Heart Rate": facultyMedical.heartRate,
                    "Pulse Rate": facultyMedical.pulseRate,
                    "Respiratory Rate": facultyMedical.respiratoryRate,
                  }).map(([label, value]) => (
                    <Typography
                      key={label}
                      variant="subtitle1"
                      className="font-semibold"
                    >
                      {label}: <span className="text-gray-600">{value}</span>
                    </Typography>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="h6" className="font-semibold">
                  Screening Results
                </Typography>
                <div className="space-y-4">
                  {Object.entries({
                    "Vision Screening (Left)":
                      facultyMedical.visionScreeningLeft,
                    "Vision Screening (Right)":
                      facultyMedical.visionScreeningRight,
                    "Auditory Screening (Left)":
                      facultyMedical.auditoryScreeningLeft,
                    "Auditory Screening (Right)":
                      facultyMedical.auditoryScreeningRight,
                    "Scalp Screening": facultyMedical.scalpScreening,
                    "Skin Screening": facultyMedical.skinScreening,
                    "Eyes Screening": facultyMedical.eyesScreening,
                    "Ear Screening": facultyMedical.earScreening,
                    "Nose Screening": facultyMedical.noseScreening,
                    "Mouth Screening": facultyMedical.mouthScreening,
                    "Neck Screening": facultyMedical.neckScreening,
                    "Throat Screening": facultyMedical.throatScreening,
                    "Lung Screening": facultyMedical.lungScreening,
                    "Heart Screening": facultyMedical.heartScreening,
                    Abdomen: facultyMedical.abdomen,
                    Deformities: facultyMedical.deformities,

                    Remarks: facultyMedical.remarks,
                  }).map(([label, value]) => (
                    <Typography
                      key={label}
                      variant="subtitle1"
                      className="font-semibold"
                    >
                      {label}: <span className="text-gray-600">{value}</span>
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Typography className="py-4 text-center text-gray-600">
              No faculty medical information available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <Button
            startIcon={<ArchiveRoundedIcon />}
            variant="outlined"
            color="secondary"
            onClick={showArchiveConfirmation}
          >
            Archive
          </Button>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FacultyMedicalInfoDialog;
