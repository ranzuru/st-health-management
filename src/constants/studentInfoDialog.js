import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StatusBadge from "../components/StatusBadge";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import axiosInstance from "../config/axios-instance";

const StudentInfoDialog = ({
  open,
  onClose,
  student,
  refreshStudents,
  currentType,
}) => {
  const [isArchiveConfirmationOpen, setIsArchiveConfirmationOpen] =
    useState(false);

  const showArchiveConfirmation = () => {
    setIsArchiveConfirmationOpen(true);
  };

  const closeArchiveConfirmation = () => {
    setIsArchiveConfirmationOpen(false);
  };
  const studentStatusColors = {
    Active: {
      bgColor: "#DFF0D8",
      textColor: "#4CAF50",
      borderColor: "#4CAF50",
    },
    Archived: {
      bgColor: "#FEEBC8",
      textColor: "#FF9800",
      borderColor: "#FF9800",
    },
    Inactive: {
      bgColor: "#EBDEF0",
      textColor: "#8E44AD",
      borderColor: "#8E44AD",
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleArchive = async () => {
    closeArchiveConfirmation(); // Close the confirmation dialog before proceeding

    try {
      const response = await axiosInstance.put(
        `studentProfile/archiveStudent/${student.lrn}`
      );

      if (response.status === 200) {
        console.log("Student archived successfully");
        onClose(); // Close the student info dialog
        refreshStudents(); // Refresh the list of students
      } else {
        console.error(
          "Failed to archive student with status: ",
          response.status
        );
      }
    } catch (error) {
      console.error("Error when trying to archive student:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isArchiveConfirmationOpen}
        onClose={closeArchiveConfirmation}
      >
        <DialogTitle>Archive Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to archive this student?
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
          Student Information
        </DialogTitle>
        <DialogContent className="divide-y divide-gray-200">
          {student ? (
            <div className="space-y-4 p-4">
              <Typography variant="subtitle1" className="font-semibold">
                LRN: <span className="text-gray-600">{student.lrn}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Name: <span className="text-gray-600">{student.name}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Gender: <span className="text-gray-600">{student.gender}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Birthday:{" "}
                <span className="text-gray-600">
                  {formatDate(student.birthDate)}
                </span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Age: <span className="text-gray-600">{student.age}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                4P's Member:{" "}
                <span className="text-gray-600">
                  {student.is4p ? "Yes" : "No"}
                </span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Parent/Guardian Name:{" "}
                <span className="text-gray-600">{student.parentName1}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Parent/Guardian Contact:{" "}
                <span className="text-gray-600">{student.parentContact1}</span>
              </Typography>
              {student.parentName2 && (
                <Typography variant="subtitle1" className="font-semibold">
                  Parent/Guardian Name2:{" "}
                  <span className="text-gray-600">{student.parentName2}</span>
                </Typography>
              )}
              {student.parentContact2 && (
                <Typography variant="subtitle1" className="font-semibold">
                  Parent/Guardian Contact2:{" "}
                  <span className="text-gray-600">
                    {student.parentContact2}
                  </span>
                </Typography>
              )}
              <Typography variant="subtitle1" className="font-semibold">
                Address:{" "}
                <span className="text-gray-600">{student.address}</span>
              </Typography>
              <Typography variant="subtitle1" className="font-semibold">
                Status:{" "}
                <StatusBadge
                  value={student.status}
                  colorMapping={studentStatusColors}
                />
              </Typography>
            </div>
          ) : (
            <Typography className="py-4 text-center text-gray-600">
              No student data available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100">
          {currentType !== "Archived" && (
            <Button
              startIcon={<ArchiveRoundedIcon />}
              variant="outlined"
              color="secondary" // Adjust if needed
              onClick={showArchiveConfirmation}
            >
              Archive
            </Button>
          )}
          <Button variant="outlined" color="primary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentInfoDialog;
