import React, { useEffect, useState } from "react";
import { Box, Chip, TextField, Autocomplete } from "@mui/material";
import { LanguageCode, allLanguages } from "@sugar-ai/core";

interface LanguagesSelectorProps {
  initialLanguages: LanguageCode[];
  onAddLanguage: (langCode: LanguageCode) => void;
  onRemoveLanguage: (langCode: LanguageCode) => void;
}

const LanguagesSelector: React.FC<LanguagesSelectorProps> = ({
  initialLanguages,
  onAddLanguage,
  onRemoveLanguage,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<LanguageCode[]>(
    [],
  );
  const [selectedLanguages, setSelectedLanguages] =
    useState<LanguageCode[]>(initialLanguages);
  const [inputValue, setInputValue] = useState<LanguageCode | null>(null);

  useEffect(() => {
    const newLangOptions = (Object.keys(allLanguages) as LanguageCode[]).filter(
      (lang) => !selectedLanguages.includes(lang),
    );
    setAvailableLanguages(newLangOptions);
  }, [selectedLanguages]);

  const handleAddLanguage = (langCode: LanguageCode | null) => {
    if (langCode && !selectedLanguages.includes(langCode)) {
      setSelectedLanguages((prev) => [...prev, langCode]);
      onAddLanguage(langCode);
      setInputValue(null); // Clear the Autocomplete input
    }
  };

  const handleRemoveLanguage = (langCode: LanguageCode) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang !== langCode));
    onRemoveLanguage(langCode);
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
      {selectedLanguages.map((langCode) => (
        <Chip
          key={langCode}
          label={allLanguages[langCode]}
          onDelete={() => handleRemoveLanguage(langCode)}
          color="primary"
          style={{ margin: "4px" }}
        />
      ))}
      <Autocomplete
        value={inputValue}
        clearOnBlur={true}
        onChange={(_, newValue) => handleAddLanguage(newValue)}
        options={availableLanguages}
        getOptionLabel={(option) => allLanguages[option]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Language"
            variant="outlined"
            size="small"
            style={{ width: "200px" }}
          />
        )}
      />
    </Box>
  );
};

export default LanguagesSelector;
