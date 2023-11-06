import React from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

const capitalizeFirstLetter = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AutoCompleteDropdown = ({
  control,
  name,
  options,
  label,
  errors = {},
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth margin="normal" error={!!errors[name]}>
          <Autocomplete
            {...field}
            options={options}
            freeSolo
            onChange={(_, data) => field.onChange(data)}
            onInputChange={(event, newInputValue) => {
              field.onChange(capitalizeFirstLetter(newInputValue));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!errors[name]}
                helperText={errors[name]?.message}
              />
            )}
          />
        </FormControl>
      )}
    />
  );
};

export default AutoCompleteDropdown;
