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
import clinicLogo from "./Data/DonjuanStock.png";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axiosInstance from "./config/axios-instance.js";

const RegistrationPage = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [error, setError] = useState("");
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .min(10, "must be 10 digits"),
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axiosInstance.post(
          "auth/register",
          values
        );
        console.log(response.data); // Display response from the server

        resetForm();
        setSnackbarMessage("Account created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // setSnackbarOpen(true);
      } catch (error) {
        setError("An error occurred during registration."); // Set an error message
        setSnackbarMessage("An error occurred during registration.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  console.log("touched:", formik.touched.gender);
  console.log("errors:", formik.errors.gender);
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left-side Image */}

      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          display: isSmallScreen ? "none" : "block",
          minHeight: "100vh",
        }}
      >
        <div className="flex justify-center items-center h-full">
          <img
            src={clinicLogo}
            alt="Clinic Logo"
            style={{ width: "100%", height: "100vh" }}
          />
        </div>
      </Grid>

      {/* Right-side Registration Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: isSmallScreen ? "transparent" : "#FFF",
        }}
      >
        <div className="flex justify-center items-center h-full">
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
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                margin="normal"
                sx={{ width: "270px", margin: "0 15px" }}
                {...formik.getFieldProps("firstName")} // Use getFieldProps to handle props
                InputProps={{
                  value: formik.values.firstName,
                  onChange: (e) => {
                    const input = e.target.value;
                    const capitalizedInput = input
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    formik.setFieldValue("firstName", capitalizedInput);
                  },
                }}
                helperText={
                  formik.touched.firstName && formik.errors.firstName ? (
                    <span style={{ color: "red" }}>
                      {formik.errors.firstName}
                    </span>
                  ) : (
                    ""
                  )
                }
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                sx={{ width: "270px", margin: "0 15px" }}
                {...formik.getFieldProps("lastName")}
                InputProps={{
                  value: formik.values.lastName,
                  onChange: (e) => {
                    const input = e.target.value;
                    const capitalizedInput = input
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    formik.setFieldValue("lastName", capitalizedInput);
                  },
                }}
                helperText={
                  formik.touched.lastName && formik.errors.lastName ? (
                    <span style={{ color: "red" }}>
                      {formik.errors.lastName}
                    </span>
                  ) : (
                    ""
                  )
                }
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
              />
            </Grid>
            {/* Continue with the rest of the form */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                margin="normal"
                {...formik.getFieldProps("phoneNumber")}
                onChange={(e) => {
                  const formattedPhoneNumber = e.target.value.replace(
                    /\D/g,
                    ""
                  ); // Remove non-numeric characters
                  formik.setFieldValue(
                    "phoneNumber",
                    formattedPhoneNumber.slice(0, 10)
                  ); // Limit to 11 digits
                }}
                InputProps={{
                  ...formik.getFieldProps("phoneNumber").inputProps,
                  startAdornment: (
                    <InputAdornment position="start">+63</InputAdornment>
                  ),
                  placeholder: "995 215 5436",
                }}
                sx={{ width: "270px", margin: "0 15px" }}
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <span style={{ color: "red" }}>
                      {formik.errors.phoneNumber}
                    </span>
                  ) : (
                    ""
                  )
                }
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                sx={{ width: "270px", margin: "0 15px" }}
                {...formik.getFieldProps("email")}
                helperText={
                  formik.touched.email && formik.errors.email ? (
                    <span style={{ color: "red" }}>{formik.errors.email}</span>
                  ) : (
                    ""
                  )
                }
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...formik.getFieldProps("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle password visibility */}
                      {showPassword ? (
                        <VisibilityOff
                          onClick={handleShowPasswordClick}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <Visibility
                          onClick={handleShowPasswordClick}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: "270px", margin: "0 15px" }}
                helperText={
                  formik.touched.password && formik.errors.password ? (
                    <span style={{ color: "red" }}>
                      {formik.errors.password}
                    </span>
                  ) : (
                    ""
                  )
                }
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...formik.getFieldProps("confirmPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle confirm password visibility */}
                      {showConfirmPassword ? (
                        <VisibilityOff
                          onClick={handleShowConfirmPasswordClick}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <Visibility
                          onClick={handleShowConfirmPasswordClick}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: "270px", margin: "0 15px" }}
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <span style={{ color: "red" }}>
                      {formik.errors.confirmPassword}
                    </span>
                  ) : (
                    ""
                  )
                }
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <Select
                name="gender"
                label="Gender"
                fullWidth
                margin="normal"
                {...formik.getFieldProps("gender")}
                displayEmpty
                inputProps={{ "aria-label": "Select your role" }}
                sx={{ width: "270px", margin: "0 15px" }}
                helperText={
                  formik.touched.gender && formik.errors.gender ? (
                    <span style={{ color: "red" }}>{formik.errors.gender}</span>
                  ) : (
                    ""
                  )
                }
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <MenuItem value="" disabled>
                  Select your gender
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: isSmallScreen ? "center" : "flex-start",
                width: isSmallScreen ? "80%" : "auto",
                margin: isSmallScreen ? "0 auto" : "0",
              }}
            >
              <Select
                name="role"
                label="Role"
                fullWidth
                margin="normal"
                {...formik.getFieldProps("role")}
                displayEmpty
                inputProps={{ "aria-label": "Select your role" }}
                sx={{ width: "270px", margin: "0 15px" }}
                helperText={
                  formik.touched.role && formik.errors.role ? (
                    <span style={{ color: "red" }}>{formik.errors.role}</span>
                  ) : (
                    ""
                  )
                }
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="" disabled>
                  Select your role
                </MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
                <MenuItem value="District Nurse">District Nurse</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <div className="flex justify-center mt-4">
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    width: "150px",
                    height: "50px",
                    marginTop: "20px",
                    borderRadius: "10px",
                    backgroundColor: formik.isValid ? "#020826" : "#CCCCCC",
                    color: formik.isValid ? "#FFFFFF" : "#707070",
                  }}
                  onClick={formik.handleSubmit}
                  disabled={
                    !formik.isValid ||
                    Object.values(formik.values).some((value) => value === "")
                  }
                >
                  Register
                </Button>
              </div>
            </Grid>
            <div className="flex justify-center mt-2">
              <span style={{ color: "#707070" }}>Already have an account?</span>{" "}
              <Link to="/" className="font-semibold">
                Login here
              </Link>
            </div>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
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
        </div>
      </Grid>
    </Grid>
  );
};

export default RegistrationPage;
