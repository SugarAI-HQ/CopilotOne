import React from "react";
import { i18nMessage, allLanguages, LanguageCode } from "@sugar-ai/core";
import { Typography, Box } from "@mui/material";

interface I18nMessageViewProps {
  message: i18nMessage;
  languages: LanguageCode[];
  klassName?: string;
}

const ViewI18nMessage: React.FC<I18nMessageViewProps> = ({
  message,
  languages,
  klassName = "",
}) => {
  return (
    <Box className="flex flex-wrap">
      {languages.map((lang) => (
        <Box key={lang} className={`mb-1 mr-4 flex items-center`}>
          <Typography
            component={"span"}
            variant="subtitle2"
            sx={{ fontWeight: "bold", mr: 1 }}
          >
            {/* {allLanguages[lang]}: */}
          </Typography>
          <Typography
            component={"span"}
            variant="subtitle1"
            className={`klassName font-semibold`}
          >
            {message.lang[lang] || "No translation available"}
          </Typography>

          {/* <Typography
            variant="subtitle1"
            className="mr-1 text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            {allLanguages[lang]}:
          </Typography>
          <Typography
            variant="body"
            className="text-sm text-gray-800 dark:text-gray-100"
          >
            {message.lang[lang] || "No translation available"}
          </Typography> */}
        </Box>
      ))}
    </Box>
  );
};

export default ViewI18nMessage;
