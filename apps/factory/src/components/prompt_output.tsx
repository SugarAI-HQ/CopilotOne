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
import { LogSchema } from "~/validators/prompt_log";

const PromptOutput = ({ pl, cube }: { pl: LogSchema; cube?: boolean }) => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--sugarcube-component-bg-color)",
        color: "white",
        padding: "0.5rem 0.5rem",
        borderRadius: "0.5rem",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <PromptCompletion
        pl={pl}
        imgClassName={"h-48 w-48"}
        textAnimation={true}
        cube={cube}
      />
    </Box>
  );
};

export default PromptOutput;
