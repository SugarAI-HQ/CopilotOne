import { Box, Typography } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

type OutputTextAnimationProps = {
  output: string;
  modelType: string;
  tokens?: number;
};

const OutputTextAnimation: React.FC<OutputTextAnimationProps> = ({
  output,
  modelType,
  tokens,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    if (modelType === ModelTypeSchema.Enum.TEXT2TEXT) {
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex <= output.length) {
          setDisplayedText(output.slice(0, currentIndex));
          currentIndex++;
          scrollToBottom();
        } else {
          clearInterval(intervalId);
        }
      }, 10);

      return () => clearInterval(intervalId);
    } else {
      setDisplayedText(output);
      scrollToBottom();
      if (containerRef.current) containerRef.current.scrollLeft = 0;
    }
  }, [output, modelType]);

  return (
    <Box
      ref={containerRef}
      sx={{
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "Highlight",
        },
        maxHeight: "250px",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "none",
        },
      }}
    >
      {tokens ? (
        <>
          {displayedText}
          <p>tokens: {tokens}</p>
        </>
      ) : (
        <Typography variant="body2" textAlign={"left"}>
          <pre>
            <code
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {displayedText}
            </code>
          </pre>
        </Typography>
      )}
    </Box>
  );
};

export default OutputTextAnimation;
