import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios-instance";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box, CircularProgress } from "@mui/material";
import CustomSnackbar from "../components/CustomSnackbar";

const PasswordResetPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // Extract the token from the URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  const resetPassword = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    try {
      await axiosInstance.post("/resetPassword/reset", {
        token,
        newPassword: password,
      });
      setLoading(false);
      showSnackbar("Password reset successful", "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setLoading(false);
      showSnackbar("Failed to reset password. Please try again.", "error");
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

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={resetPassword}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </Box>
    </>
  );
};

export default PasswordResetPage;
