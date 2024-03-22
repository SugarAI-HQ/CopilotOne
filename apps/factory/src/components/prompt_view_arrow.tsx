import React, { useEffect, useState } from "react";
import { Stack, Box, Typography, Grid } from "@mui/material";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { PromptDataType } from "~/validators/prompt_version";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface PromptViewArrowProps {
  promptInputs: PromptDataType | undefined;
  haveroleUserAssistant: number | undefined;
  promptTemplate: string;
}

const PromptViewArrow: React.FC<PromptViewArrowProps> = ({
  promptTemplate,
  promptInputs,
  haveroleUserAssistant,
}) => {
  const [isTextOpen, setIsTextOpen] = useState(false);

  useEffect(() => {
    console.log(promptInputs);
  }, []);

  return (
    <div style={{ paddingLeft: 15, paddingRight: 15 }}>
      <Stack
        className="dark:border-gray-60 w-full rounded-lg border p-3 shadow"
        flexDirection={"row"}
        sx={{ backgroundColor: "var(--sugarcube-component-bg-color)" }}
      >
        <Box
          onClick={() => setIsTextOpen(!isTextOpen)}
          sx={{ cursor: "pointer" }}
        >
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
        {isTextOpen ? (
          <>
            <PromptView
              promptInputs={promptInputs}
              haveroleUserAssistant={haveroleUserAssistant}
              promptTemplate={promptTemplate}
            />
          </>
        ) : (
          <>
            <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
              Click to view Prompt Template
            </Typography>
          </>
        )}
      </Stack>
    </div>
  );
};

export const PromptView = ({
  promptInputs,
  haveroleUserAssistant,
  promptTemplate,
}: PromptViewArrowProps) => {
  return (
    <>
      {haveroleUserAssistant !== 0 && haveroleUserAssistant !== 3 ? (
        <TableContainer
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            widith: "100%",
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "var(--sugarhub-text-color)" }}>
                  ROLE
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--sugarhub-text-color)" }}
                >
                  CONTENT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promptInputs?.map((promptInput) => (
                <TableRow
                  key={promptInput.role}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ color: "var(--sugarhub-text-color)" }}
                  >
                    {promptInput.role}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "var(--sugarhub-text-color)",
                      overflowWrap: "break-word",
                    }}
                  >
                    {promptInput.content}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
            {promptTemplate}
          </Typography>
        </>
      )}
    </>
  );
};

export default PromptViewArrow;
