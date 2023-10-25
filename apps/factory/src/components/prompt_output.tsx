import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import PromptCompletion from "./prompt_completion";

const PromptOutput = ({
  output,
  modelType,
}: {
  output: string;
  modelType: ModelTypeType;
}) => {
  return (
    <Box>
      <PromptCompletion
        modelType={modelType}
        output={output}
        imgClassName={"h-48 w-48 object-fill"}
      />
    </Box>
  );
};

export default PromptOutput;
