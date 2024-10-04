import type { Meta, StoryObj } from "@storybook/react";
import { LanguageProvider, WorkflowProvider } from "@sugar-ai/core";
import { fn } from "@storybook/test";

import { Streamingi18nText } from "../react/components/streaming/Streamingi18nText";
// Correctly wrap the story in LanguageProvider (as a value, not a type)

// const withLanguageProvider = (Story, context) => (
//   <LanguageProvider>
//     <Story {...context} />
//   </LanguageProvider>
// );

const withLanguageProvider = (Story, context) => (
  <LanguageProvider>
    <WorkflowProvider>
      <Story {...context} />
    </WorkflowProvider>
  </LanguageProvider>
);

const meta = {
  title: "Example/Streamingi18nText",
  component: Streamingi18nText,
  decorators: [withLanguageProvider],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    klasses: { control: "text" },
    style: { control: "object" },
    auto: { control: "boolean" },
    message: { control: "object" },
    // messageKey: { control: "text" },
    beforeSpeak: { action: "beforeSpeak" },
    afterSpeak: { action: "afterSpeak" },
  },
  args: { auto: false, beforeSpeak: fn(), afterSpeak: fn() },
} satisfies Meta<typeof Streamingi18nText>;

export default meta;
type Story = StoryObj<typeof meta>;

// <Streamingi18nText
//             klasses="sai-vf-welcome-message"
//             auto={false}
//             ref={welcomeMessageRef}
//             message={welcomeMessage}
//             formConfig={voiceForm?.formConfig}
//           />

export const Primary: Story = {
  args: {
    auto: true,
    message: { lang: { en: "Hello, this is a streaming i18n text!" } }, // Example message structure
  },
};

// export const WithMessageKey: Story = {
//   args: {
//     messageKey: "welcomeMessage", // Example message key
//   },
// };

// export const CustomStyle: Story = {
//   args: {
//     style: { color: "blue", fontSize: "20px" },
//     message: { text: "Styled Streaming i18n Text!" },
//   },
// };

// export const FastForward: Story = {
//   args: {
//     message: { text: "Fast forward example!" },
//     beforeSpeak: () => console.log("Before Speak Triggered"),
//     afterSpeak: () => console.log("After Speak Triggered"),
//   },
// };
