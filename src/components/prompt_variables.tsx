import React, { useState } from "react";
import { Typography, Stack, InputAdornment, Input, Box, TextField } from "@mui/material";
import { PromptVariable } from "./prompt_variable";

export interface PromptVariableProps {
  key: string,
  value: string,
  type: string,
  [key: string]: any;
}

function PromptVariables({ vars, onChange }: { vars: Array<PromptVariableProps>, onChange: (key:string, value: string) => void }) {
  // console.log(`variables : ${JSON.stringify(vars)}`);
  const handleValueChange = (key:string, value:string) => {
    onChange(key, value);
  }

  return (
    <Box padding={2}>
      <Typography variant="h6">Variables</Typography>
      <Stack spacing={2}>
        {vars &&
          vars.length > 0 &&
          vars.map((v, index) => (
              <PromptVariable
                key={'pv-'+index}
                pv={v}
                onChange={handleValueChange}
              />
          ))}
      </Stack>
    </Box>
  );
}

export default PromptVariables;
