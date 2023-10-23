import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FormInputProps } from "./formInputProps";

export function FormTextInput({
  name,
  control,
  label,
  error,
  helperText,
}: FormInputProps) {
  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            fullWidth
            error={error}
            helperText={helperText}
          />
        )}
      />
    </FormControl>
  );
}
