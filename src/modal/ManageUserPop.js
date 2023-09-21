import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";

const AddUserDialog = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .min(10, "Your phone number must be 10 digits"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Invalid email format"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
    role: Yup.string().required("Role is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      gender: "", // Set the default gender value here
      role: "", // Set the default role value here
    },
  });

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data, e) => {
    try {
      // Make an HTTP POST request to your API endpoint
      await axios.post("http://localhost:8080/auth/register", data);
      // Check if Snackbar is not open before setting the success message

      // Update snackbar state
      setSnackbarMessage("Account created successfully!");
      setSnackbarSeverity("success");
      // Ensure snackbarOpen is set to true after a delay
      setTimeout(() => {
        setSnackbarOpen(true);
      }, 500);

      // Close the form after setting the snackbar
      onClose();
      // Clear the form data
      reset();
      e.target.reset();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If the server responds with a 400 status code (email exists), show an error message
        setEmailExists(true);
      } else {
        // Handle any other network or server errors
        setSnackbarMessage("An error occurred during registration.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      // Always set Snackbar open to true after the try-catch block
      setSnackbarOpen(true);
    }
  };

  const onCancel = () => {
    // Call reset to clear all form fields
    reset();
    onClose();
    setEmailExists(false);
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>ADD USER</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            Please fill in the user details.
          </DialogContentText>
          <TextField
            name="firstName"
            label="First Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("firstName")}
            error={!!errors.firstName} // Show error state if there's a validation error
            helperText={errors.firstName?.message} // Display the error message
          />
          <TextField
            name="lastName"
            label="Last Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("lastName")}
            error={!!errors.lastName} // Show error state if there's a validation error
            helperText={errors.lastName?.message} // Display the error message
          />
          <TextField
            name="phoneNumber"
            label="Mobile Number"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("phoneNumber")}
            onChange={(e) => {
              // Use slice(0, 10) to keep only the first 10 characters
              const numericValue = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);
              // Update the input field with the sliced value
              e.target.value = numericValue;
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
              placeholder: "995 215 5436",
            }}
            error={!!errors.phoneNumber} // Show error state if there's a validation error
            helperText={errors.phoneNumber?.message} // Display the error message
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email || emailExists} // Show error state if there's a validation error
            helperText={
              errors.email?.message || (emailExists && "Email already exists")
            }
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* Toggle password visibility */}
                  {showPassword ? (
                    <VisibilityOffIcon
                      onClick={handleShowPasswordClick}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <VisibilityIcon
                      onClick={handleShowPasswordClick}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
            error={!!errors.password} // Show error state if there's a validation error
            helperText={errors.password?.message} // Display the error message
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("confirmPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* Toggle password visibility */}
                  {showConfirmPassword ? (
                    <VisibilityOffIcon
                      onClick={handleShowConfirmPasswordClick}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <VisibilityIcon
                      onClick={handleShowConfirmPasswordClick}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
            error={!!errors.confirmPassword} // Show error state if there's a validation error
            helperText={errors.confirmPassword?.message} // Display the error message
          />
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              defaultValue=""
              {...register("gender")}
              label="Gender"
              error={!!errors.gender}
            >
              <MenuItem value="" disabled>
                Select your gender
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <FormHelperText error={!!errors.gender}>
              {errors.gender?.message}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              defaultValue=""
              {...register("role")}
              label="Role"
              error={!!errors.role}
            >
              <MenuItem value="" disabled>
                Select your role
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Nurse">Nurse</MenuItem>
              <MenuItem value="District Nurse">District Nurse</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </Select>
            <FormHelperText error={!!errors.role}>
              {errors.role?.message}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
          >
            Add User
          </Button>
        </DialogActions>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={500}
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: "top", // Position at the top
            horizontal: "center", // Position at the center horizontally
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </form>
    </Dialog>
  );
};

export default AddUserDialog;
