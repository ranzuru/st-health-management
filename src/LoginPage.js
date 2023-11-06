import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginUser, resetLoginError } from "././redux/actions/authActions.js";
import { useSelector } from "react-redux";

import schoolLogo from "./Data/DonjuanTransparent.png";
import clinicLogo from "./Data/DonjuanStock.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const validation = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
    password: yup.string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation), // Use yupResolver with the schema
  });
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleShowPasswordClick = (event) => {
    event.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(loginUser(data.email, data.password, navigate)).finally(() => {
      setLoading(false);
    });
  };

  const handleCloseWarning = () => {
    dispatch(resetLoginError());
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left-side Image */}
      <Grid
        item
        xs={12}
        sm={4}
        md={7}
        sx={{
          display: isSmallScreen ? "none" : "block",
          minHeight: "100vh",
          backgroundImage: `url(${clinicLogo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Grid>

      {/* Right-side Login Form */}
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
        <Grid item xs={10} sm={8} md={6}>
          {/* Add form components here */}
          <div className="flex flex-col space-y-4 text-center">
            <div className="flex justify-center">
              <img
                src={schoolLogo}
                alt="School Logo"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <h1 className="text-lg font-semibold">
              Don Juan Dela Cruz Central Elementary School
            </h1>
            <div className="flex items-start">
              <h2 className="text-4xl font-bold">Login</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...register("email")}
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...register("password")}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={handleShowPasswordClick}
                        aria-label={
                          showPassword ? "Hide Password" : "Show Password"
                        }
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </InputAdornment>
                  ),
                }}
              />
              <div className="flex justify-between w-full">
                <a
                  href="#forgot-password"
                  className="text-gray-700 hover:underline"
                >
                  Forgot password?
                </a>
                <MuiLink
                  component={RouterLink}
                  to="/register"
                  className="text-black hover:underline"
                >
                  Sign up here
                </MuiLink>
              </div>
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress size={24} color="primary" />
                </div>
              ) : (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="contained"
                    style={{
                      width: "150px",
                      height: "50px",
                      borderRadius: "10px",
                    }}
                    type="submit"
                  >
                    Login
                  </Button>
                </div>
              )}
            </form>
          </div>
        </Grid>
      </Grid>
      <Dialog open={!!errorMessage} onClose={handleCloseWarning}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LoginPage;
