import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

const PromptOutput = ({
  output,
  modelType,
}: {
  output: string;
  modelType: string;
}) => {
  return (
    <Box>
      {modelType === ModelTypeSchema.Enum.TEXT2TEXT ? (
        <Typography variant="body2" textAlign={"left"}>
          {output}
        </Typography>
      ) : (
        <img className="h-48 w-48 object-fill " src={output} alt="Image" />
      )}
    </Box>
  );
};

export default PromptOutput;
