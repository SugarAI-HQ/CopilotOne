import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";
import type { FormInputProps } from "./formInputProps";

interface Props<T extends string | number> extends FormInputProps {
  name: string;
  control: any; // Adjust the type of 'control' based on your requirements
  label: string;
  defaultValue: T | undefined;
  readonly: boolean;
  enumValues: Record<string, T>;
}

export function FormSelectInput<T extends string | number>({
  name,
  control,
  label,
  defaultValue,
  readonly,
  enumValues,
}: Props<T>) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            {...field}
            aria-label={name}
            inputProps={{
              readOnly: readonly,
            }}
          >
            {Object.entries(enumValues).map(([value, label]) => (
              <MenuItem
                key={value}
                value={value}
                selected={defaultValue === value ? true : false}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
