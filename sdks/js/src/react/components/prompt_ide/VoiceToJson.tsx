import { textToJson } from "@sugar-ai/core";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import VoiceButtonWithStates from "~/react/assistants/components/voice";

export const VoiceToJson: React.FC<{
  schema: any;
  onJson: (json: any) => Promise<void>;
  editorConfig: any;
}> = ({ schema, onJson, editorConfig = {} }) => {
  const [input, setInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<object | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    // Mock function call
    // const output = { message: , input: input };
    const output = await textToJson(input, {}, "", "", {});

    setJsonOutput(output);
    onJson && (await onJson(output));
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
        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2  dark:bg-gray-700 text-gray-500 dark:text-gray dark:border-gray-600"
        minRows={5}
      />

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white dark:text-gray py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Submit
        </button>

        {/* <VoiceButtonWithStates
          // onTranscript={handleVoiceInput}
          // onListeningChange={(listening) => setIsListening(listening)}
          islistening={isListening}
          // className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800"
        /> */}
      </div>

      {jsonOutput && (
        <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg w-full overflow-x-auto">
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default VoiceToJson;
