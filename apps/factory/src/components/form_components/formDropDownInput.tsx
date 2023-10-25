import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";
import type { FormInputProps } from "./formInputProps";
import { providerModels } from "~/validators/base";

export function FormDropDownInput({ name, control, label }: FormInputProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select {...field} aria-label={name}>
            {Object.entries(providerModels).map(([modelType, modelConfig]) => (
              <MenuItem
                key={modelType}
                value={modelType}
                disabled={!modelConfig.enabled}
              >
                {modelConfig.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
