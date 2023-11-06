import { useState } from "react";
import { Controller } from "react-hook-form";
import { TextField, InputAdornment } from "@mui/material";

const VitalSignInput = ({
  control,
  name,
  label,
  placeholder,
  adornmentText,
  error,
  helperText,
  onInputValidation,
  handleChange,
}) => {
  const [focusState, setFocusState] = useState({});

  const handleFocus = (field) => {
    setFocusState((prevFocusState) => ({ ...prevFocusState, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusState((prevFocusState) => ({ ...prevFocusState, [field]: false }));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          label={label}
          margin="normal"
          fullWidth
          {...field}
          onChange={(e) => {
            if (handleChange) {
              handleChange(e);
            }
            field.onChange(e);
          }}
          error={!!error}
          helperText={helperText}
          onFocus={() => handleFocus(name)}
          onBlur={() => handleBlur(name)}
          InputProps={{
            endAdornment:
              field.value || focusState[name] ? (
                <InputAdornment position="end">{adornmentText}</InputAdornment>
              ) : null,
            placeholder: placeholder,
          }}
          onInput={(e) => {
            if (onInputValidation) {
              onInputValidation(e);
            }
          }}
        />
      )}
    />
  );
};

export default VitalSignInput;
