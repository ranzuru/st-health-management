import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axiosInstance from "../config/axios-instance.js";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SettingsInfo() {
  const [firstNameDialogOpen, setFirstNameDialogOpen] = useState(false);
  const [lastNameDialogOpen, setLastNameDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showOldPasswordIcon, setShowOldPasswordIcon] = useState(false);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmNewPasswordIcon, setConfirmNewPasswordIcon] =
    useState(false);

  const [userSettings, setUserSettings] = useState(null);
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(true);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(true);
  const [isOldPasswordFieldEmpty, setIsOldPasswordFieldEmpty] = useState(true);
  const [isNewPasswordFieldEmpty, setIsNewPasswordFieldEmpty] = useState(true);
  const [isConfirmNewPasswordFieldEmpty, setIsConfirmNewPasswordFieldEmpty] =
    useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    const passwordsAreMatching = newPassword === confirmNewPassword;
    const isPasswordLongEnough = newPassword.length >= 6;

    setPasswordsMatch(passwordsAreMatching);
    setIsPasswordValid(isPasswordLongEnough);

    setIsSaveButtonDisabled(
      isOldPasswordFieldEmpty ||
        isNewPasswordFieldEmpty ||
        isConfirmNewPasswordFieldEmpty ||
        !passwordsAreMatching ||
        !isPasswordLongEnough
    );
  }, [
    newPassword,
    confirmNewPassword,
    isOldPasswordFieldEmpty,
    isNewPasswordFieldEmpty,
    isConfirmNewPasswordFieldEmpty,
    passwordsMatch,
  ]);

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleShowOldPasswordClick = () => {
    setShowOldPasswordIcon((prevShowOldPassword) => !prevShowOldPassword);
  };

  const handleShowNewPasswordClick = () => {
    setShowNewPasswordIcon((prevShowNewPassword) => !prevShowNewPassword);
  };

  const handleShowConfirmNewPasswordClick = () => {
    setConfirmNewPasswordIcon(
      (prevShowConfirmNewPassword) => !prevShowConfirmNewPassword
    );
  };

  const fetchUserSettings = () => {
    const apiUrl = "/settings/user/fetchSettings";
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setUserSettings(response.data.userSettings);
      })
      .catch((error) => {
        console.error("Error fetching user settings:", error);
      });
  };

  useEffect(() => {
    fetchUserSettings();
  }, []);

  // Function to update first name
  const updateFirstName = async (newFirstName) => {
    try {
      const response = await axiosInstance.put(
        `settings/user/updateFirstName`,
        {
          firstName: newFirstName,
        }
      );
      if (response.data.message === "First name updated successfully") {
        // ... (Your existing code)
        showSnackbar("First name updated successfully", "success");
      } else {
        showSnackbar("Update failed", "error");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Function to update last name
  const updateLastName = async (newLastName) => {
    try {
      const response = await axiosInstance.put(`settings/user/updateLastName`, {
        lastName: newLastName,
      });
      if (response.data.message === "Last name updated successfully") {
        // ... (Your existing code)
        showSnackbar("Last name updated successfully", "success");
      } else {
        showSnackbar("Update failed", "error");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Function to update password
  const updatePassword = async (passwordObj) => {
    try {
      const response = await axiosInstance.put(`settings/user/updatePassword`, {
        oldPassword: passwordObj.oldPassword,
        newPassword: passwordObj.newPassword,
        confirmPassword: passwordObj.confirmNewPassword,
      });
      if (response.data.message === "Password updated successfully") {
        showSnackbar("Password updated successfully", "success");
      } else {
        showSnackbar("Update failed", "error");
      }
      return response.data;
    } catch (error) {
      showSnackbar("Old password is wrong", "error");
      throw error;
    }
  };

  const handleEditClick = (field) => {
    // Open the dialog for the clicked field
    switch (field) {
      case "firstName":
        setFirstNameDialogOpen(true);
        break;
      case "lastName":
        setLastNameDialogOpen(true);
        break;
      case "password":
        setPasswordDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseDialog = (field) => {
    switch (field) {
      case "firstName":
        setFirstNameDialogOpen(false);
        break;
      case "lastName":
        setLastNameDialogOpen(false);
        break;
      case "password":
        setPasswordDialogOpen(false);
        break;
      default:
        break;
    }
  };

  const resetTextFieldValue = (field) => {
    switch (field) {
      case "firstName":
        setFirstName("");
        break;
      case "lastName":
        setLastName("");
        break;
      case "password":
        setOldPassword("");
        break;
      case "newPassword":
        setNewPassword("");
        break;
      case "confirmNewPassword":
        setConfirmNewPassword("");
        break;
      default:
        break;
    }
  };

  const handleSaveChanges = async (field, value) => {
    try {
      switch (field) {
        case "firstName":
          await updateFirstName(value);
          break;
        case "lastName":
          await updateLastName(value);
          break;
        case "password":
          // Create a properly structured passwordObj here
          const passwordObj = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
          };
          await updatePassword(passwordObj);
          break;
        default:
          break;
      }
      fetchUserSettings();
      resetTextFieldValue(field);
      handleCloseDialog(field);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleCancelClick = (field) => {
    // Reset the TextField value
    resetTextFieldValue(field);
    // Close the dialog
    handleCloseDialog(field);
  };

  return (
    <Paper elevation={3} className="flex-1 flex flex-col space-y-4">
      <div className="bg-gray-100 p-8">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.5rem", md: "1.5rem" },
            fontWeight: "bold",
          }}
        >
          Edit Profile
        </Typography>
      </div>
      {userSettings !== null ? (
        <>
          <Card
            variant="outlined"
            className="m-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
            onClick={() => handleEditClick("firstName")}
          >
            <CardContent>
              <Typography variant="h6">
                <span className="font-normal">First Name:</span>{" "}
                <span className="font-bold">{userSettings.firstName}</span>
              </Typography>
            </CardContent>
            <KeyboardArrowRightIcon className="mr-4" />
          </Card>
        </>
      ) : (
        <div className="flex justify-center items-center h-40">
          <CircularProgress size={48} /> {/* Display loading spinner */}
        </div>
      )}
      {userSettings !== null ? (
        <Card
          variant="outlined"
          className="m-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
          onClick={() => handleEditClick("lastName")}
        >
          <CardContent>
            <Typography variant="h6">
              <span className="font-normal">Last Name:</span>{" "}
              <span className="font-bold">{userSettings.lastName}</span>
            </Typography>
          </CardContent>
          <KeyboardArrowRightIcon className="mr-4" />
        </Card>
      ) : (
        <div className="flex justify-center items-center h-40">
          <CircularProgress size={48} /> {/* Display loading spinner */}
        </div>
      )}
      {userSettings !== null ? (
        <Card
          variant="outlined"
          className="m-4 flex items-center justify-between cursor-not-allowed"
          sx={{
            backgroundColor: "rgba(229, 229, 229, 0.3)",
          }}
          onClick={() => handleEditClick("email")}
        >
          <CardContent>
            <Typography variant="h6">
              <span className="font-normal">Email:</span>{" "}
              <span className="font-bold">{userSettings.email}</span>
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center items-center h-40">
          <CircularProgress size={48} /> {/* Display loading spinner */}
        </div>
      )}
      {userSettings !== null ? (
        <Card
          variant="outlined"
          className="m-4 flex items-center justify-between cursor-not-allowed"
          sx={{
            backgroundColor: "rgba(229, 229, 229, 0.3)",
          }}
          onClick={() => handleEditClick("phoneNumber")}
        >
          <CardContent>
            <Typography variant="h6">
              <span className="font-normal">Phone Number:</span>{" "}
              <span className="font-bold">{userSettings.phoneNumber}</span>
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center items-center h-40">
          <CircularProgress size={48} /> {/* Display loading spinner */}
        </div>
      )}
      <Card
        variant="outlined"
        className="m-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
        onClick={() => handleEditClick("password")}
      >
        <CardContent>
          <Typography variant="h6">
            <span className="font-normal">Password:</span>{" "}
          </Typography>
        </CardContent>
        <KeyboardArrowRightIcon className="mr-4" />
      </Card>
      <Dialog
        open={firstNameDialogOpen}
        onClose={() => handleCloseDialog("firstName")}
        fullWidth
      >
        <DialogTitle>Edit First Name</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalizedValue = value
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                setFirstName(capitalizedValue);
                setIsFirstNameEmpty(value.trim() === "");
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("firstName")}>Cancel</Button>
          <Button
            onClick={() => handleSaveChanges("firstName", firstName)}
            color="primary"
            disabled={isFirstNameEmpty}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Last Name Dialog */}
      <Dialog
        open={lastNameDialogOpen}
        onClose={() => handleCloseDialog("lastName")}
        fullWidth
      >
        <DialogTitle>Edit Last Name</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalizedValue = value
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                setLastName(capitalizedValue);
                setIsLastNameEmpty(value.trim() === "");
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("lastName")}>Cancel</Button>
          <Button
            onClick={() => handleSaveChanges("lastName", lastName)}
            color="primary"
            disabled={isLastNameEmpty}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => handleCloseDialog("password")}
        fullWidth
      >
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <TextField
              name="oldPassword"
              label="Old Password"
              type={showOldPasswordIcon ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showOldPasswordIcon ? (
                      <VisibilityOffIcon
                        onClick={handleShowOldPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={handleShowOldPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
              onChange={(e) => {
                const value = e.target.value;
                setOldPassword(value);
                setIsOldPasswordFieldEmpty(value.trim() === ""); // Check if the value is empty
              }}
            />

            {/* New Password TextField */}
            <TextField
              name="newPassword"
              label="New Password"
              type={showNewPasswordIcon ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showNewPasswordIcon ? (
                      <VisibilityOffIcon
                        onClick={handleShowNewPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={handleShowNewPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value); // Assuming you have a state variable for new password
                setPasswordsMatch(newPassword === confirmNewPassword);
                setIsNewPasswordFieldEmpty(value.trim() === "");
              }}
            />
            {/* New Password Confirm TextField */}
            <TextField
              name="confirmNewPassword"
              label="Confirm New Password"
              type={showConfirmNewPasswordIcon ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showConfirmNewPasswordIcon ? (
                      <VisibilityOffIcon
                        onClick={handleShowConfirmNewPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={handleShowConfirmNewPasswordClick}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmNewPassword(value);
                setPasswordsMatch(newPassword === value);
                setIsConfirmNewPasswordFieldEmpty(value.trim() === "");
              }}
            />
            {/* Validation Message */}
            <div style={{ color: "red", display: "block", marginTop: "8px" }}>
              {!isPasswordValid && (
                <span>
                  New password should be at least 6 characters long
                  <br />
                </span>
              )}
              {!passwordsMatch && <span>Passwords do not match</span>}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("password")}>Cancel</Button>
          <Button
            onClick={() =>
              handleSaveChanges(
                "password",
                oldPassword,
                newPassword,
                confirmNewPassword
              )
            }
            color="primary"
            disabled={isSaveButtonDisabled} // Use the new state variable here
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
    </Paper>
  );
}

export default SettingsInfo;
