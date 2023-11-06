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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axiosInstance from "../../config/axios-instance";

export const HardDeleteFaculty = ({ employeeId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const hardDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(
        `facultyProfile/hardDeleteFaculty/${employeeId}`
      );
      onSuccess(); // Refresh the grid or take any other success action
    } catch (error) {
      console.error("Error deleting faculty:", error);
      // Handle error (show message to user, etc.)
    } finally {
      setLoading(false);
      handleDialogClose();
    }
  };

  return (
    <>
      <IconButton onClick={handleDialogOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this faculty? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={hardDelete}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
