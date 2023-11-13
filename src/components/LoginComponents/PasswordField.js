import { TextField, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({
  register,
  errors,
  showPassword,
  onShowPasswordClick,
}) => {
  return (
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
              onClick={onShowPasswordClick}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
