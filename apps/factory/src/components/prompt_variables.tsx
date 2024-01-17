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
  cube,
}: {
  vars: Array<PromptVariableProps> | undefined;
  onChange: (key: string, value: string) => void;
  mode: DisplayModes;
  cube?: boolean;
}) {
  // console.log(`variables : ${JSON.stringify(vars)}`);
  const handleValueChange = (key: string, value: string) => {
    onChange(key, value);
  };

  return (
    <Box padding={2}>
      <Typography
        variant="h6"
        sx={{ color: "var(--sugarhub-text-color)", marginBottom: "1rem" }}
      >
        {cube ? "Enter Input" : "Variables"}
      </Typography>
      <Stack spacing={2}>
        {vars &&
          vars.length > 0 &&
          vars.map((v, index) => (
            <PromptVariable
              key={"pv-" + index}
              pv={v}
              onChange={handleValueChange}
              mode={mode}
              cube={cube}
            />
          ))}
      </Stack>
    </Box>
  );
}

export default PromptVariables;
