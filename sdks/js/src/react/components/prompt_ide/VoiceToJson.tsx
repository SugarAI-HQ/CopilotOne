import {
  questionSchema,
  translateZodSchema,
  translateZodSchemaToTypeScript,
  useCopilot,
} from "@sugar-ai/core";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { z, ZodSchema } from "zod";

export const VoiceToJson: React.FC<{
  schema: ZodSchema<any>; // Zod schema for validation
  examples?: object[]; // Optional schema examples
  onJson: (json: any) => Promise<void>;
  config?: any; // Additional configurations
}> = ({ schema, examples = [], onJson, config = {} }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };
  const { textToJson } = useCopilot();

  const handleSubmit = async () => {
    const schema = questionSchema;
    try {
      // Translate userSchema to string

      const promptTemplate = `sugar/voice-forms/text-to-json/0.0.1`;
      // Generate JSON output using textToJson and provided query & examples
      const output = await textToJson(schema, userInput, promptTemplate, {
        "@requirement": jdRequirement,
        "@languages": JSON.stringify(["en, hi"]),
        "@samples": JSON.stringify([]),
      });

      setJsonOutput(output);
      setError(null);
      console.log(`output`, output);
      debugger;
      // Trigger the callback with the valid JSON
      // onJson && (await onJson(validatedOutput));
    } catch (err: any) {
      // Handle Zod validation errors or other errors
      setError(err.message || "An error occurred during processing.");
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setUserInput(transcript);
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 max-w-lg mx-auto ">
      <TextareaAutosize
        autoComplete="off"
        value={userInput}
        onChange={handleTextInputChange}
        placeholder={
          !isListening ? "Enter your input or use voice" : "Listening..."
        }
        className="text-gray-800 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 dark:bg-gray-700 text-gray-500 dark:text-gray dark:border-gray-600"
        minRows={5}
      />

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
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

const jdRequirement = `
We need to create questions for forms in following languages ['en'] based on the below requirement

Position: E-commerce Catalog Executive Experience: 1-3 years (Minimum) Gender: Female candidates only
About the Company:
Vaadi Herbals has combined Ayurvedic science with modern technology to develop a whole new range of personal care products. Its range consists of hair care, skin care, face care and body care products enriched with the extracts of best quality natural herbs to cater to the needs of the whole family.
Job Overview:
Vaadi Herbals Pvt Ltd is seeking a dedicated and detail-oriented E-commerce Catalog Executive with 1-3 years of relevant experience. The successful candidate will be responsible for managing and updating product listings across various e-commerce platforms including Amazon, Nykaa, Meesho, Myntra, etc. The role is crucial in ensuring that our products are accurately listed, live, and easily accessible to customers.
Key Responsibilities:
● Product Listings: Create, update, and manage product listings on e-commerce platforms like Amazon, Nykaa, Meesho, Myntra, etc.
● Live Products Monitoring: Ensure that all products are live, visible, and available for purchase on all platforms.
● Quality Assurance: Maintain accurate, detailed, and up-to-date product information, including descriptions, images, pricing, and availability.
● Catalog Maintenance: Regularly review and update the product catalog to reflect current inventory, pricing, promotions, and new product launches.
● Collaboration: Coordinate with the marketing, sales, and inventory teams to ensure product information is consistent across all channels.
● Issue Resolution: Identify and resolve any issues related to product visibility, listings, and catalog management on e-commerce platforms.
● Reporting: Prepare and present regular reports on the performance of product listings and the status of the e-commerce catalog.
Qualifications:
● Experience: 1-3 years of experience in e-commerce catalog management or a similar role.
● Skills:
○ Proficiency in managing product listings on platforms like Amazon, Nykaa,
Meesho, Myntra, etc.
○ Strong organizational skills with a keen eye for detail.
○ Excellent communication skills and ability to work collaboratively in a team
environment.
○ Problem-solving abilities and a proactive approach to managing challenges.
● Education: Relevant degree or certification in e-commerce, business administration, or a related field is preferred.
Work Location:
Vaadi Herbals Pvt Ltd
Unit - 415, 4th Floor, K M Trade Towers, Radisson Blu, Kaushambi, Ghaziabad.
Company Websites:
● www.vaadiherbals.in
● www.vaadiorganics.mu
● www.vaadiorganics.my
● www.vaadiorganics.co.za ● www.vaadinepal.com
Note: This position is open to female candidates only.

Create questions with clear validation and qualficaiion critierias

1.what is your Name ?
2.Please share your official Email ID.
3.What is your Contact number?
4.How many Years of experience do you have as a e-commerce executive?
5.Do you have experience of handling E-commerce portals/ website ? 
7.please elaborate your current roles and responsibilities.
8.Are you fine with the job location? 
11. What is your Current CTC?
12. What is your expected CTC?
13. What would be your Notice period ?

`;
