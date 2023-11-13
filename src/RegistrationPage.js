// src/RegistrationPage.js
import React, { useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import clinicLogo from "./Data/DonjuanStock.webp";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import axiosInstance from "./config/axios-instance";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const RegistrationPage = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .min(10, "must be 10 digits"),
    email: Yup.string().email("Invalid email").required("Email is required"),
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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    },
    resolver: yupResolver(validationSchema), // Use yupResolver with the schema
  });

  const handleShowPasswordClick = (event) => {
    event.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPasswordClick = (event) => {
    event.preventDefault();
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/auth/register", data);
      showSnackbar("Successfully created an account", "success");
      reset();
      setEmailExists(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showSnackbar(error.response.data.error, "error");
        setEmailExists(true);
      } else {
        showSnackbar("An error occurred during registration", "error");
      }
    }
  };

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
      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        {/* Left-side Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            display: isSmallScreen ? "none" : "block",
            backgroundImage: `url(${clinicLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></Grid>

        {/* Right-side Registration Form */}
        <Grid
          item
          xs={12}
          sm={7}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isSmallScreen ? "transparent" : "#FFF",
          }}
        >
          <div
            className="flex justify-center items-center h-full w-full"
            style={{
              padding: "6px",
              width: isSmallScreen ? "80%" : "auto",
              margin: isSmallScreen ? "0 auto" : "0",
            }}
          >
            <div className="w-full max-w-lg">
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                {/* Add new Grid item for "Create an account" */}
                <Grid item xs={12}>
                  <div className="flex justify-center mb-6">
                    <h2 className="text-4xl font-bold">Create an account</h2>
                  </div>
                </Grid>
                {/* Separate First Name and Last Name */}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="First Name"
                            fullWidth
                            margin="normal"
                            {...field}
                            helperText={errors.firstName?.message}
                            error={!!errors.firstName}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Last Name"
                            fullWidth
                            margin="normal"
                            {...field}
                            helperText={errors.lastName?.message}
                            error={!!errors.lastName}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Contact Number"
                            fullWidth
                            margin="normal"
                            {...field}
                            required
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                            onBlur={field.onBlur}
                            onChange={(e) => {
                              // Use slice(0, 10) to keep only the first 10 characters
                              const numericValue = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              // Update the input field with the sliced value
                              field.onChange(numericValue);
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +63
                                </InputAdornment>
                              ),
                              placeholder: "995 215 5436",
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            {...field}
                            error={!!errors.email || emailExists}
                            helperText={
                              errors.email?.message ||
                              (emailExists && "Email already exists")
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            {...field}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <button
                                    type="button"
                                    onClick={handleShowPasswordClick}
                                    aria-label={
                                      showPassword
                                        ? "Hide Password"
                                        : "Show Password"
                                    }
                                    style={{
                                      cursor: "pointer",
                                      background: "none",
                                      border: "none",
                                    }}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            {...field}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <button
                                    type="button"
                                    onClick={handleShowConfirmPasswordClick}
                                    aria-label={
                                      showConfirmPassword
                                        ? "Hide Password"
                                        : "Show Password"
                                    }
                                    style={{
                                      cursor: "pointer",
                                      background: "none",
                                      border: "none",
                                    }}
                                  >
                                    {showConfirmPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <FormControl required fullWidth margin="normal">
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                              labelId="gender-label"
                              label="Gender"
                              {...field}
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.gender}>
                              {errors.gender?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <FormControl required fullWidth margin="normal">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                              labelId="role-label"
                              label="Role"
                              {...field}
                            >
                              <MenuItem value="Principal">
                                Principal
                              </MenuItem>
                              <MenuItem value="Administrator">
                                Administrator
                              </MenuItem>
                              <MenuItem value="Office Staff">
                                Office Staff
                              </MenuItem>
                              <MenuItem value="IT Staff">
                                IT Staff
                              </MenuItem>
                              <MenuItem value="Doctor">
                                Doctor
                              </MenuItem>
                              <MenuItem value="District Nurse">
                                District Nurse
                              </MenuItem>
                              <MenuItem value="School Nurse">
                                School Nurse
                              </MenuItem>
                              <MenuItem value="Feeding Program Head">
                                Feeding Program Head
                              </MenuItem>
                              <MenuItem value="Medical Program Head">
                                Medical Program Head
                              </MenuItem>
                              <MenuItem value="Dengue Program Head">
                                Dengue Program Head
                              </MenuItem>
                              <MenuItem value="Deworming Program Head">
                                De-worming Program Head
                              </MenuItem>
                              <MenuItem value="Intern">
                                Intern
                              </MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.role}>
                              {errors.role?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <div className="flex justify-center">
                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      style={{
                        width: "150px",
                        height: "50px",
                        marginTop: "20px",
                        borderRadius: "10px",
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </form>
                <div className="flex justify-center mt-2">
                  <span style={{ color: "#707070" }}>
                    Already have an account?
                  </span>{" "}
                  <Link to="/" className="font-semibold">
                    Login here
                  </Link>
                </div>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default RegistrationPage;
