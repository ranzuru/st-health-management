import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios-instance";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box } from "@mui/material";

const PasswordResetPage = () => {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Extract the token from the URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post("/resetPassword/reset", {
        token,
        newPassword: password,
      });
      console.log("Password reset successful", response.data);
      // Handle success (e.g., show success message, redirect user)
    } catch (error) {
      console.error(error.response || error.message || error);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
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
        sx={{ mt: 2 }}
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default PasswordResetPage;
