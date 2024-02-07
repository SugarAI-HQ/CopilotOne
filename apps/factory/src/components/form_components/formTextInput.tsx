import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FormInputProps } from "./formInputProps";

interface Props extends FormInputProps {
  readonly: boolean;
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormTextInput({
  name,
  control,
  label,
  error,
  helperText,
  readonly, // onChange,
  required,
}: Props) {
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
            required={required}
            error={error}
            helperText={helperText}
            InputProps={{
              readOnly: readonly,
            }}
            // onChange={onChange}
            autoComplete="off"
            disabled={readonly}
          />
        )}
      />
    </FormControl>
  );
}
