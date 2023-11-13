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

const StudentMedicalInfoDialog = ({
  open,
  onClose,
  studentMedical,
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
        `medicalCheckup/archive/${studentMedical.id}`
      );

      if (response.status === 200) {
        showSnackbar("Student medical record archived successfully", "success");
        onClose(); // Close the student medical info dialog
        refreshRecord(); // Refresh the data
      } else {
        showSnackbar(
          `Failed to archive student medical record with status: ${response.status}`,
          "error"
        );
      }
    } catch (error) {
      showSnackbar(
        `Error when trying to archive student medical record:,
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
          {studentMedical ? (
            <div className="space-y-6 p-4">
              <div>
                <Typography variant="h6" className="font-semibold">
                  Basic Information
                </Typography>
                <div className="space-y-4">
                  {Object.entries({
                    "Date Of Examination": formatDate(
                      studentMedical.dateOfExamination
                    ),
                    "Student LRN": studentMedical.lrn,
                    Name: studentMedical.name,
                    Age: studentMedical.age,
                    Gender: studentMedical.gender,
                    "Birth Date": formatDate(studentMedical.birthDate),
                    Address: studentMedical.address,
                    Grade: studentMedical.grade,
                    Section: studentMedical.section,
                    "School Year": studentMedical.schoolYear,
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
                    "Height (cm)": studentMedical.heightCm,
                    "Weight (kg)": studentMedical.weightKg,
                    BMI: studentMedical.BMI,
                    "BMI Classification": studentMedical.BMIClassification,
                    "Height for Age": studentMedical.heightForAge,
                    "Iron Supplementation": studentMedical.ironSupplementation
                      ? "Yes"
                      : "No",
                    Deworming: studentMedical.deworming ? "Yes" : "No",
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
                    "Pulse Rate": studentMedical.pulseRate,
                    "Respiratory Rate": studentMedical.respiratoryRate,
                    "Vision Screening (Left)":
                      studentMedical.visionScreeningLeft,
                    "Vision Screening (Right)":
                      studentMedical.visionScreeningRight,
                    "Auditory Screening (Left)":
                      studentMedical.auditoryScreeningLeft,
                    "Auditory Screening (Right)":
                      studentMedical.auditoryScreeningRight,
                    "Scalp Screening": studentMedical.scalpScreening,
                    "Skin Screening": studentMedical.skinScreening,
                    "Eyes Screening": studentMedical.eyesScreening,
                    "Ear Screening": studentMedical.earScreening,
                    "Nose Screening": studentMedical.noseScreening,
                    "Mouth Screening": studentMedical.mouthScreening,
                    "Neck Screening": studentMedical.neckScreening,
                    "Throat Screening": studentMedical.throatScreening,
                    "Lung Screening": studentMedical.lungScreening,
                    "Heart Screening": studentMedical.heartScreening,
                    Abdomen: studentMedical.abdomen,
                    Deformities: studentMedical.deformities,
                    Menarche: studentMedical.menarche,
                    Temperature: studentMedical.temperature,
                    "Blood Pressure": studentMedical.bloodPressure,
                    "Heart Rate": studentMedical.heartRate,
                    Remarks: studentMedical.remarks,
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
              No student medical information available.
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

export default StudentMedicalInfoDialog;
