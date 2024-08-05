import React from "react";
import { i18nMessage, allLanguages, LanguageCode } from "@sugar-ai/core"; // Update the import path accordingly
import { Typography, Box } from "@mui/material";

interface I18nMessageViewProps {
  message: i18nMessage;
  languages: LanguageCode[];
}

const ViewI18nMessage: React.FC<I18nMessageViewProps> = ({
  message,
  languages,
}) => {
  return (
    <Box>
      {languages.map((lang) => (
        <Box key={lang} mb={2}>
          <Typography variant="subtitle1">{allLanguages[lang]}</Typography>
          <Typography variant="body1">
            {message.lang[lang] || "No translation available"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ViewI18nMessage;
