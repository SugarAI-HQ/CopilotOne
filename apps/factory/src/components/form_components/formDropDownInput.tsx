import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";
import type { FormInputProps } from "./formInputProps";
import { providerModels } from "~/validators/base";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";

interface Props extends FormInputProps {
  defaultValue: ModelTypeType | undefined;
  readonly: boolean;
}

export function FormDropDownInput({
  name,
  control,
  label,
  defaultValue,
  readonly,
}: Props) {
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
            disabled={readonly}
          >
            {Object.entries(providerModels).map(([modelType, modelConfig]) => (
              <MenuItem
                key={modelType}
                value={modelType}
                disabled={!modelConfig.enabled}
                selected={defaultValue === modelType ? true : false}
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
