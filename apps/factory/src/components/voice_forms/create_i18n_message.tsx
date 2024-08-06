import React, { useEffect, useRef } from "react";
import {
  i18nMessage,
  allLanguages,
  LanguageCode,
  i18nMessageSchema,
} from "@sugar-ai/core";
import { TextField, Box, Typography, IconButton } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Delete } from "@mui/icons-material";
import classNames from "classnames";

interface CreateI18nMessageProps {
  fieldKey: string;
  fieldName: string;
  initialMessage: i18nMessage;
  allowedLanguages: LanguageCode[];
  onSave: (key: string, message: i18nMessage) => void;
  minLength?: number;
  maxLength?: number;
}

const CreateI18nMessage: React.FC<CreateI18nMessageProps> = ({
  fieldKey,
  fieldName,
  initialMessage,
  allowedLanguages,
  onSave,
  minLength = 1,
  maxLength = 255,
}) => {
  const {
    control,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<i18nMessage>({
    defaultValues: initialMessage,
    resolver: zodResolver(i18nMessageSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
    rules: { minLength: minLength, maxLength: maxLength },
  });

  const updateLanguagesSet = useRef(new Set());

  useEffect(() => {
    if (!initialMessage) {
      return;
    }

    console.log(`field ${fieldName}: ${JSON.stringify(initialMessage)}`);

    const existingLanguages = allowedLanguages || [];

    // Set of existing language codes for quick lookup
    const existingLanguageSet = new Set(existingLanguages);

    // Filter and remove languages that are no longer allowed
    fields.forEach((field, index) => {
      const langCode = Object.keys(field)[0] as LanguageCode;
      if (!existingLanguageSet.has(langCode)) {
        remove(index);
        updateLanguagesSet.current.delete(langCode);
      }
    });

    // Add new languages only if they are not already present
    existingLanguages.forEach((lang) => {
      if (
        !updateLanguagesSet.current.has(lang) &&
        !fields.some((field) => Object.keys(field)[0] === lang)
      ) {
        updateLanguagesSet.current.add(lang);
        append({ [lang]: initialMessage.lang[lang] || "" });
      }
    });
  }, [allowedLanguages, initialMessage, append, remove]);

  useEffect(() => {
    const subscription = watch((data) => {
      // Ensure the keys are consistent and log the data
      // console.log(`${fieldKey} : ${JSON.stringify(data.lang)}`);

      // // Check if data.lang is an object and has valid language codes
      // if (data.lang && typeof data.lang === "object") {
      //   const validData = Object.keys(data.lang).reduce((acc, key) => {
      //     if (allowedLanguages.includes(key as LanguageCode)) {
      //       acc[key] = data.lang[key];
      //     }
      //     return acc;
      //   }, {} as i18nMessage);

      //   onSave(fieldKey, { lang: validData } as i18nMessage);
      // }
      if (data.fields && data.fields) {
        // @ts-ignore
        const arr: Array<any> = Array.from(data.fields);
        const validData = arr.reduce((acc, rec) => {
          // console.log(rec);
          const k = Object.keys(rec)[0] as LanguageCode;

          if (allowedLanguages.includes(k)) {
            acc[k] = rec[k];
          }
          return acc;
        }, {} as i18nMessage);
        onSave(fieldKey, { lang: validData } as i18nMessage);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, fieldKey, allowedLanguages]);

  const handleRemoveLanguage = (index: number) => {
    remove(index);
  };

  return (
    <Box className="rounded-lg border-2 border-gray-700 p-4 shadow-md dark:border-gray-600">
      <Typography className="mb-4 text-3xl font-bold">{fieldName}</Typography>
      <Box className="space-y-4">
        {fields.map((field, index) => {
          const langCode = Object.keys(field)[0] as LanguageCode;
          return (
            <Box key={index} className="mt-4 flex items-center space-x-4">
              <Controller
                // name={`lang.${langCode}`}
                name={`fields.${index}.${langCode}`}
                control={control}
                defaultValue={field[langCode]} // Set defaultValue for each field
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={allLanguages[langCode]}
                    variant="outlined"
                    size="small"
                    className="flex-grow"
                    error={!!errors.fields?.[index]?.name}
                    helperText={errors.fields?.[index]?.name?.message || ""}
                    onChange={(e) => {
                      // field.value = e.target.value;
                      // field.onChange(e);
                      setValue(`fields.${index}.${langCode}`, e.target.value, {
                        shouldValidate: true,
                      });
                      // handleFieldChange(index, e.target.value);
                    }}
                    inputProps={{ minLength, maxLength }}
                    InputProps={{
                      className: classNames(
                        "text-gray-900 dark:bg-gray-700 dark:text-gray-200",
                        "border-gray-300 dark:border-gray-600",
                      ),
                    }}
                  />
                )}
              />
              {/* Uncomment if needed */}
              {/* <IconButton
                onClick={() => handleRemoveLanguage(index)}
                size="small"
                className="text-red-500 hover:text-red-700"
              >
                <Delete />
              </IconButton> */}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CreateI18nMessage;
