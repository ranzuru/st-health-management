import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Button, Typography, DialogContentText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../../config/axios-instance";
import CustomSnackbar from "../CustomSnackbar";

const PasswordResetRequestDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(open);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  const handleClose = () => {
    setDialogOpen(false);
    onClose();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Clear the error when the user modifies the email
    if (error) setError("");
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Your API call to request the reset email
      await axiosInstance.post("/resetPassword/request-reset-email", { email });
      showSnackbar("Check your inbox for the reset link", "success");
      handleClose();
    } catch (error) {
      showSnackbar("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
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
        open={dialogOpen}
        onClose={onClose}
        className="bg-white"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Password Reset Request</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter you email:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            onChange={handleEmailChange}
            error={!!error}
            helperText={error}
            className="mt-4"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={onClose} variant="outlined">
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <SendIcon />
                <Typography variant="body1">Send</Typography>
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PasswordResetRequestDialog;
