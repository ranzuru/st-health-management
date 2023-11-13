// EmailField.js
import { TextField } from "@mui/material";

const EmailField = ({ register, errors }) => {
  return (
    <TextField
      label="Email"
      fullWidth
      margin="normal"
      {...register("email")}
      autoComplete="email"
      error={!!errors.email}
      helperText={errors.email?.message}
    />
  );
};

export default EmailField;
