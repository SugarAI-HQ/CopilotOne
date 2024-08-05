import React, { useState } from "react";
import {
  i18nMessage,
  allLanguages,
  LanguageCode,
  i18nMessageSchema,
} from "@sugar-ai/core";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Delete } from "@mui/icons-material";

interface CreateI18nMessageProps {
  initialMessage: i18nMessage;
  initialLanguages: LanguageCode[];
  onSave: (message: i18nMessage) => void;
}

const CreateI18nMessage: React.FC<CreateI18nMessageProps> = ({
  initialMessage,
  initialLanguages,
  onSave,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState(
    Object.keys(allLanguages) as LanguageCode[],
  );

  const { control, handleSubmit, setValue, watch } = useForm<i18nMessage>({
    defaultValues: initialMessage,
    resolver: zodResolver(i18nMessageSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lang",
  });

  // Populate fields based on initialMessage
  React.useEffect(() => {
    const existingLanguages = Object.keys(
      initialMessage.lang,
    ) as LanguageCode[];
    existingLanguages.forEach((lang) => {
      if (!fields.some((field) => Object.keys(field)[0] === lang)) {
        append({ [lang]: initialMessage.lang[lang] });
      }
    });
  }, [initialMessage, append, fields]);

  const handleAddLanguage = (langCode: LanguageCode) => {
    if (!fields.some((field) => Object.keys(field).includes(langCode))) {
      append({ [langCode]: "" });
    }
  };

  const handleRemoveLanguage = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: i18nMessage) => {
    onSave(data);
  };

  const newLangOptions = availableLanguages.filter(
    (lang) => !fields.some((field) => Object.keys(field).includes(lang)),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {fields.map((field, index) => {
          const langCode = Object.keys(field)[0] as LanguageCode;
          return (
            <Box key={index} display="flex" alignItems="center" mb={1}>
              <Controller
                name={`lang.${langCode}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`${allLanguages[langCode]}`}
                    variant="outlined"
                    size="small"
                    style={{ flexGrow: 1, marginRight: 8 }}
                  />
                )}
              />
              <IconButton
                onClick={() => handleRemoveLanguage(index)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          );
        })}
        <Box display="flex" alignItems="center" mb={2}>
          <InputLabel>Add Language</InputLabel>
          <Controller
            name="newLangCode"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                style={{ marginRight: 8 }}
                displayEmpty
                inputProps={{ "aria-label": "Language" }}
                onChange={(e) =>
                  handleAddLanguage(e.target.value as LanguageCode)
                }
              >
                <MenuItem value="" disabled>
                  Select Language
                </MenuItem>
                {newLangOptions.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {allLanguages[lang]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Button
            variant="outlined"
            onClick={() => handleAddLanguage(control.getValues("newLangCode"))}
          >
            Add
          </Button>
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </form>
  );
};

export default CreateI18nMessage;
