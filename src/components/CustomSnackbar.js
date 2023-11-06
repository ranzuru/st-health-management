// CustomSnackbar.js
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomSnackbar = ({ open, handleClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
