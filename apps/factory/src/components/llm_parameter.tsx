import React from "react";
import { Box, Typography, Slider, Input, TextField } from "@mui/material";

function LLMParameter({
  label,
  parameter,
  handleParameterChange,
  min,
  max,
  step,
}: {
  label: string;
  parameter: number;
  handleParameterChange: any;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box flex="1">
        <Typography fontSize="md" fontWeight="bold">
          {label}
        </Typography>
      </Box>

      <Box flex="3" sx={{ m: 1 }}>
        <Slider
          value={parameter}
          onChange={handleParameterChange}
          min={min}
          max={max}
          step={step}
        />
      </Box>

      <Box flex="1" ml="1rem">
        <TextField
          value={parameter}
          variant="standard"
          onChange={(e) => handleParameterChange(e.target.value)}
          inputProps={{
            min,
            max,
            step,
          }}
          // sx={{
          //   borderBottom: '1px solid gray',
          //   borderRadius: 0,
          //   p: 0,
          //   py: 1
          // }}
        />
      </Box>
    </Box>
  );
}

export default LLMParameter;
