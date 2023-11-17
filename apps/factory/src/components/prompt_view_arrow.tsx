import React, { useState } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

type PromptViewArrowProps = {
  promptTemplate: string;
};

const PromptViewArrow: React.FC<PromptViewArrowProps> = ({
  promptTemplate,
}) => {
  const [isTextOpen, setIsTextOpen] = useState(false);

  return (
    <div style={{ paddingLeft: 15, paddingRight: 15 }}>
      <Stack
        className="dark:border-gray-60 w-full rounded-lg border p-3 shadow"
        onClick={() => setIsTextOpen(!isTextOpen)}
        flexDirection={"row"}
      >
        <Box>
          {isTextOpen ? (
            <FaCaretDown size={20} style={{ paddingRight: 5 }} />
          ) : (
            <FaCaretUp size={20} style={{ paddingRight: 5 }} />
          )}
        </Box>
        <Typography className="text-gray-500">
          {isTextOpen ? promptTemplate : "Click to view prompt Template"}
        </Typography>
      </Stack>
    </div>
  );
};

export default PromptViewArrow;
