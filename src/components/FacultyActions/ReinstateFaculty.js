import { useState } from "react";
import {
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import axiosInstance from "../../config/axios-instance";

export const ReinstateFaculty = ({ employeeId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const reinstate = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`facultyProfile/reinstateFaculty/${employeeId}`);
      onSuccess(); // Refresh the grid or take any other success action
    } catch (error) {
      console.error("Error reinstating saculty:", error);
    } finally {
      setLoading(false);
      handleDialogClose();
    }
  };

  return (
    <>
      <IconButton onClick={handleDialogOpen} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : <ReplayIcon />}
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Reinstatement"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reinstate this faculty?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={reinstate}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Reinstate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
