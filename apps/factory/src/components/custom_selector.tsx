import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

interface SelectProps {
  label: string;
  options: { value: string | undefined; label: string | undefined }[];
  value: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleSelectChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
