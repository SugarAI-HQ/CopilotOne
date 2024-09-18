import { type CopilotConfigType } from "@sugar-ai/core";
import { env } from "~/env.mjs";

export function getCopilotConfig(
  promptPackage: string | null = null,
  color: string | null = null,
): CopilotConfigType {
  const copilotPackage =
    promptPackage ?? "sugar/copilotexample/todoexample/0.0.3";
  const themeColor = color ?? "#0057FF";

  let copilotConfig: CopilotConfigType = {
    copilotId: env["NEXT_PUBLIC_COPILOT_ID"] as string,
    server: {
      endpoint: env["NEXT_PUBLIC_COPILOT_ENDPOINT"] as string,
      token: env["NEXT_PUBLIC_COPILOT_SECRET"] as string,
    },
    ai: {
      defaultPromptTemplate: copilotPackage,
      defaultPromptVariables: {
        "#AGENT_NAME": "Tudy",
      },
      successResponse: "Task Done",
      failureResponse: "I am not able to do this",
    },
    nudges: {
      welcome: {
        textMode: "manual",
        text: "Hi, I am John. How may I help you today?",
        delay: 1,
        enabled: true,
        chatHistorySize: 0,
      },
    },
    style: {
      container: { position: "bottom-center" },

      theme: { primaryColor: themeColor },
      voiceButton: {
        bgColor: themeColor,
        iconSize: "28",
      },
    },
  };

  console.log("copilotConfig", copilotConfig);

  return copilotConfig;
}
