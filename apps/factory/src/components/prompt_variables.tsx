import React, { useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import { PromptVariable } from "./prompt_variable";
import { DisplayModes } from "~/validators/base";

export interface PromptVariableProps {
  key: string;
  value: string;
  type: string;
  [key: string]: string;
}

function PromptVariables({
  vars,
  onChange,
  mode,
}: {
  vars: Array<PromptVariableProps>;
  onChange: (key: string, value: string) => void;
  mode: DisplayModes;
}) {
  // console.log(`variables : ${JSON.stringify(vars)}`);
  const handleValueChange = (key: string, value: string) => {
    onChange(key, value);
  };

  return (
    <Box padding={2}>
      <Typography variant="h6">Variables</Typography>
      <Stack spacing={2}>
        {vars &&
          vars.length > 0 &&
          vars.map((v, index) => (
            <PromptVariable
              key={"pv-" + index}
              pv={v}
              onChange={handleValueChange}
            />
          ))}
      </Stack>
    </Box>
  );
}

export default PromptVariables;
