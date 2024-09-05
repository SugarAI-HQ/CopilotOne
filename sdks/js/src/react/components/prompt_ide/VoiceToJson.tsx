import {
  textToJson,
  translateZodSchema,
  translateZodSchemaToTypeScript,
} from "@sugar-ai/core";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { z, ZodSchema } from "zod";

export const VoiceToJson: React.FC<{
  schema: ZodSchema<any>; // Zod schema for validation
  userQuery: string; // User query to be passed to GenAI
  examples?: object[]; // Optional schema examples
  onJson: (json: any) => Promise<void>;
  config?: any; // Additional configurations
}> = ({ schema, userQuery, examples = [], onJson, config = {} }) => {
  const [input, setInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Example usage with the userSchema
      const userSchema = z.object({
        name: z.string(),
        age: z.number(),
        email: z.string().email(),
        isActive: z.boolean(),
        roles: z.enum(["admin", "user", "guest"]),
        tags: z.array(z.string()),
        preferences: z
          .object({
            theme: z.enum(["dark", "light"]),
            notifications: z.boolean(),
          })
          .optional(),
      });

      // Translate userSchema to string
      const schemaString = translateZodSchema(userSchema);
      console.log(schemaString);

      const schemaTsString = translateZodSchemaToTypeScript(userSchema);
      console.log(schemaTsString);
      debugger;

      // // Generate JSON output using textToJson and provided query & examples
      // const output = await textToJson(input, schema, userQuery, "", {
      //   examples,
      // });

      // // Validate the output against the provided Zod schema
      // const validatedOutput = schema.parse(output);

      // setJsonOutput(validatedOutput);
      // setError(null);

      // // Trigger the callback with the valid JSON
      // onJson && (await onJson(validatedOutput));
    } catch (err: any) {
      // Handle Zod validation errors or other errors
      setError(err.message || "An error occurred during processing.");
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 max-w-lg mx-auto text-gray-500">
      <TextareaAutosize
        autoComplete="off"
        value={input}
        onChange={handleTextInputChange}
        placeholder={
          !isListening ? "Enter your input or use voice" : "Listening..."
        }
        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 dark:bg-gray-700 text-gray-500 dark:text-gray dark:border-gray-600"
        minRows={5}
      />

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white dark:text-gray py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Submit
        </button>

        {/* Uncomment to use VoiceButtonWithStates */}
        {/* <VoiceButtonWithStates
          onTranscript={handleVoiceInput}
          onListeningChange={(listening) => setIsListening(listening)}
          isListening={isListening}
          className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800"
        /> */}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {jsonOutput && (
        <pre className="p-4 rounded-lg w-full overflow-x-auto">
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default VoiceToJson;
