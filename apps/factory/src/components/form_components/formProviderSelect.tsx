import React, { ReactNode } from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import type { FormInputProps } from "./formInputProps";
import { Provider, providerModels } from "~/validators/base";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";

interface Props<T extends string | number> extends FormInputProps {
  name: string;
  control: any; // Adjust the type of 'control' based on your requirements
  label: string;
  modelType: ModelTypeType;
  defaultValue: T | undefined;
  readonly: boolean;

  onChange: (event: SelectChangeEvent<any>, child: ReactNode) => void;
}

export function FormProviderSelectInput<T extends string | number>({
  name,
  control,
  label,
  modelType,
  defaultValue,

  onChange,
  readonly,
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
            defaultValue={defaultValue}
            inputProps={{
              readOnly: readonly,
            }}
            onChange={onChange}
          >
            {providerModels[modelType].providers.map((provider: Provider) => (
              <MenuItem
                key={provider.name}
                value={provider.name}
                disabled={!provider.enabled}
              >
                {provider.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
