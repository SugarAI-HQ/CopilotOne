import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { packageVisibility } from "~/validators/base";
import type { FormInputProps } from "./formInputProps";

const options = [
  {
    label: "Public",
    value: packageVisibility.enum.PUBLIC,
  },
  {
    label: "Private",
    value: packageVisibility.enum.PRIVATE,
  },
];

export function FormRadioInput({ name, control, label }: FormInputProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup {...field} aria-label={name}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.value}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}
