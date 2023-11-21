import React, { useState } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

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
        sx={{ backgroundColor: "var(--sugarcube-component-bg-color)" }}
      >
        <Box>
          {isTextOpen ? (
            <FaCaretDown
              size={20}
              style={{ paddingRight: 5, color: "var(--sugarhub-text-color)" }}
            />
          ) : (
            <FaCaretRight
              size={20}
              style={{ paddingRight: 5, color: "var(--sugarhub-text-color)" }}
            />
          )}
        </Box>
        <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
          {isTextOpen ? promptTemplate : "Click to view prompt Template"}
        </Typography>
      </Stack>
    </div>
  );
};

export default PromptViewArrow;
