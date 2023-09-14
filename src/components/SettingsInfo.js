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

function SettingsInfo() {
  const [firstNameDialogOpen, setFirstNameDialogOpen] = useState(false);
  const [lastNameDialogOpen, setLastNameDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setConfirmNewPassword] = useState(false);

  const [userSettings, setUserSettings] = useState(null);

  const handleShowOldPasswordClick = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };

  const handleShowNewPasswordClick = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = "/settings/user/fetchSettings"; // Relative URL based on Axios base URL
    // Make a GET request to fetch user settings using your Axios instance
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setUserSettings(response.data.userSettings);
      })
      .catch((error) => {
        console.error("Error fetching user settings:", error);
      });
  }, []);

  const handleShowConfirmNewPasswordClick = () => {
    setConfirmNewPassword(
      (prevShowConfirmNewPassword) => !prevShowConfirmNewPassword
    );
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
        setPassword("");
        break;
      default:
        break;
    }
  };

  const handleSaveChanges = (field, value) => {
    // Perform any actions needed to save changes for the specified field
    // Close the dialog for the specified field
    handleCloseDialog(field);
    // Update the state with the new value
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
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
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("firstName")}>Cancel</Button>
          <Button
            onClick={() => handleSaveChanges("firstName", firstName)}
            color="primary"
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
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("lastName")}>Cancel</Button>
          <Button
            onClick={() => handleSaveChanges("lastName", lastName)}
            color="primary"
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
              type={showOldPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showOldPassword ? (
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
            />

            {/* New Password TextField */}
            <TextField
              name="newPassword"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showNewPassword ? (
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
            />
            {/* New Password Confirm TextField */}
            <TextField
              name="confirmNewPassword"
              label="Confirm New Password"
              type={showConfirmNewPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    {showConfirmNewPassword ? (
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
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelClick("password")}>Cancel</Button>
          <Button
            onClick={() => handleSaveChanges("password", password)}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default SettingsInfo;
