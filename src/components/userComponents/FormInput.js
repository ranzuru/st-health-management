import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const FormInput = ({ control, name, label, error, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            // Your custom logic
            let value = e.target.value;
            // Only accept letters and spaces, and capitalize the first letter of each word
            value = value
              .replace(/[^a-zA-Z ]/g, "")
              .replace(/(^\w|\s\w)/g, (letter) => letter.toUpperCase());
            // Call the onChange function with the modified value
            onChange(value);
          }}
          {...rest}
        />
      )}
    />
  );
};

export default FormInput;
