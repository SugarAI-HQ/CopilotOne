import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewI18nMessage from "../view_i18n_message";
import FileCopyIcon from "@mui/icons-material/FileCopy";

import { LanguageCode, Question } from "@sugar-ai/core";

interface QuestionViewProps {
  question: Question;
  languages: LanguageCode[];
  onEdit: (id: string) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  languages,
  onEdit,
  onClone,
  onDelete,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    languages[0] || "en",
  );

  const handleLanguageChange = (
    event: React.SyntheticEvent,
    newValue: LanguageCode,
  ) => {
    setSelectedLanguage(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%", // Ensure the Paper takes full width
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "60%", // Fix the width of the main content area
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pr: 2,
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            aria-label="language tabs"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {languages.map((language) => (
              <Tab key={language} label={language} value={language} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            <ViewI18nMessage
              klassName="text-4xl font-semibold"
              message={question.question_text}
              languages={[selectedLanguage]}
            />
          </Typography>

          {question.question_params?.options?.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" className="font-semibold">
                Options:
              </Typography>
              <Grid container sx={{ mt: 1 }} spacing={1}>
                {question.question_params.options.map((option, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2">
                      <ViewI18nMessage
                        message={option}
                        languages={[selectedLanguage]}
                      />
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "40%", // Fix the width of the actions and qualification area
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          ml: 2,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
          }}
        >
          <Chip label={question.question_type} color="primary" sx={{}} />
          <Chip
            label={question.qualification?.type}
            color="secondary"
            sx={{ ml: 1 }}
          />
        </Box>
        {question.qualification && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              {question.qualification.criteria}
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: "auto", display: "flex" }}>
          <IconButton color="primary" onClick={() => onEdit(question.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => onClone(question.id)}>
            <FileCopyIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => onDelete(question.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuestionView;
