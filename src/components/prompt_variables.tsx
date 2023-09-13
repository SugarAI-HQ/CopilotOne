import React, { useState } from "react";
import { Typography, Stack, InputAdornment, Input } from "@mui/material";

function PromptVariables({ vars }) {
  console.log(`variables : ${JSON.stringify(vars)}`);
  let [variables, setVariables] = useState(vars);

  return (
    <>
      <Typography variant="h6">Variables</Typography>
      <Stack spacing={4}>
        {vars &&
          vars.length > 0 &&
          vars.map((v, index) => (
            <div key={index}>
              <Input
                startAdornment={
                  <InputAdornment position="start">{v.type}</InputAdornment>
                }
                placeholder={v.key}
              />
            </div>
          ))}
      </Stack>
    </>
  );
}

export default PromptVariables;
