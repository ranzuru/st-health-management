import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  initiateLogin,
  verifyOtp,
  resetLoginError,
  resendOtp,
} from "././redux/actions/authActions.js";
import { useSelector } from "react-redux";
import PasswordResetRequestDialog from "./components/resetPasswordComponents/PasswordResetRequestDialog.js";
import OtpInput from "./components/otpComponents/otpInput.js";

import schoolLogo from "./Data/DonjuanTransparent.webp";
import clinicLogo from "./Data/DonjuanStock.webp";
import EmailField from "./components/LoginComponents/EmailField.js";
import PasswordField from "./components/LoginComponents/PasswordField.js";
import { validation } from "./components/LoginComponents/LoginValidation.js";
import ErrorDialog from "./components/LoginComponents/ErrorDialog.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const [showPassword, setShowPassword] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [tempAuthToken, setTempAuthToken] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation), // Use yupResolver with the schema
  });

  useEffect(() => {
    let intervalId;
    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(initiateLogin(data.email, data.password))
      .then(({ tempAuthToken, otpToken }) => {
        setTempAuthToken(tempAuthToken);
        setOtpToken(otpToken);
        setOtpDialogOpen(true);
      })
      .catch((error) => {
        // Handle error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to close the dialog
  const handleClose = () => {
    setOtpDialogOpen(false);
  };

  const handleOtpSubmit = (otpValue) => {
    dispatch(verifyOtp(tempAuthToken, otpToken, otpValue, navigate));
  };

  const handleCloseWarning = () => {
    dispatch(resetLoginError());
  };

  const handleOpenDialog = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleResendOtp = () => {
    if (!tempAuthToken) {
      return;
    }

    dispatch(resendOtp(tempAuthToken))
      .then((newOtpTokenResponse) => {
        setOtpToken(newOtpTokenResponse && newOtpTokenResponse.otpToken); // Update the state with the new OTP token
        setTimeLeft(60);
        // ...other code
      })
      .catch((error) => {
        // ...error handling
      });
  };

  return (
    <>
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
                <EmailField register={register} errors={errors} />
                <PasswordField
                  register={register}
                  errors={errors}
                  showPassword={showPassword}
                  onShowPasswordClick={handleShowPasswordClick}
                />
                <div className="flex justify-between w-full">
                  <a
                    href="#forgot-password"
                    onClick={handleOpenDialog}
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
      </Grid>
      <ErrorDialog
        open={!!errorMessage}
        errorMessage={errorMessage}
        onClose={handleCloseWarning}
      />
      <PasswordResetRequestDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
      />

      <OtpInput
        open={otpDialogOpen}
        handleClose={handleClose}
        onSubmit={handleOtpSubmit}
        onResendOtp={handleResendOtp}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
      />
    </>
  );
};

export default LoginPage;
