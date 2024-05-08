import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import {
  GenerateOutput,
  generateInput,
  generateOutput,
  SkillChoicesType,
  generateLiteOutput,
  GenerateLiteOutput,
} from "~/validators/service";
import {
  generateLLmConfig,
  generatePrompt,
  generatePromptFromJson,
  hasImageModels,
  replaceDataVariables,
} from "~/utils/template";
import { promptEnvironment } from "~/validators/base";
import { LlmGateway } from "~/services/llm_gateways";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { LlmErrorResponse } from "~/validators/llm_respose";
import { getEditorVersion } from "~/utils/template";
import { Prompt, PromptDataType } from "~/validators/prompt_version";
import { lookupEmbedding } from "./embedding";
import { TemplateVariablesType } from "~/validators/prompt_log";
import { TRPCError } from "@trpc/server";
import { createTrackTime } from "~/utils/performance";
import { env } from "~/env.mjs";

export const serviceRouter = createTRPCRouter({
  generate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/{username}/{packageName}/{template}/{versionOrEnvironment}/generate",
        tags: ["prompts"],
        summary: "Generate prompt completion",
      },
    })
    .input(generateInput)
    .use(promptMiddleware)
    .output(generateOutput)
    .mutation(async ({ ctx, input }) => {
      const { trackTime, resetTime, getStats } = createTrackTime();
      resetTime();
      trackTime("start");
      // const userId = input.userId;
      let userId = ctx.jwt?.id as string;

      // let userId = pt.runMode === PromptRunModesSchema.Enum.ALL
      //     ? (env.DEMO_USER_ID as string)
      //     : (ctx.jwt?.id as string);

      let copilotId = input?.copilotId as string;
      let pl;

      let errorResponse: LlmErrorResponse | null = null;

      // 0. Load latest Prompt version
      let [pv, pt] = await getPv(ctx, input);
      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);

      if (pv && userId && userId != "") {
        const modelType: ModelTypeType = pv.llmModelType;
        console.log(`data >>>> ${JSON.stringify(input)}`);

        // 1. Caching and Data Gathering
        let chatId = input.chat?.id as string;
        let userQuery: null | string = null;

        // 1.1 Semantic Caching
        // TODO

        // 1.2 create chat if not existing and load messages history

        chatId = await findOrCreateChatAndLoadHistory(
          ctx,
          copilotId,
          chatId,
          input,
        );
        trackTime("load_chat");

        // 1.3 Extract user query from last message
        if (input.messages && input.messages?.length > 0) {
          const lastMessage = input.messages[input.messages?.length - 1];
          userQuery = lastMessage?.content as string;
        }

        // 2. Build Prompt

        // 2.1 Load Embeddings Data if prompt have any context variables

        let embeddingVariables: any = {};
        let matches: any = [];

        if (input.scope && userQuery) {
          // Check prompt version have any variables related to context or not
          const contextVars = (pv.variables as TemplateVariablesType).filter(
            (v) => v.type + v.key == "$VIEW_CONTEXT",
          );

          if (contextVars.length > 0) {
            matches = await lookupEmbedding(
              userId,
              copilotId,
              userQuery,
              input.scope,
            );
          }

          embeddingVariables["$VIEW_CONTEXT" as any] =
            matches.length > 0 ? matches[0]?.doc : "Empty";

          embeddingVariables["$USER_QUERY" as any] = userQuery;
          trackTime("embeddings");
        }

        // 2.2 Build variables
        const templateVariables = {
          ...input.variables, //#
          ...embeddingVariables, //$
        };

        // 2.3 Generate Prompt using template
        let prompt: Prompt = "";
        if (hasImageModels(modelType)) {
          prompt = generatePrompt(pv.template, input.variables || {});
        } else {
          // here decide whether to take template data or promptData
          if (getEditorVersion(modelType, pv.llmProvider, pv.llmModel)) {
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            prompt = generatePromptFromJson(
              pv.promptData.data,
              templateVariables,
            ) as PromptDataType;
            // console.log(prompt);
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          } else {
            prompt = generatePrompt(pv.template, templateVariables);
          }
        }
        trackTime("generate_prompt");

        console.log(`prompt >>>> ${JSON.stringify(prompt, null, 2)}`);

        // 3. Get LLM Response
        // 3.1 Get LLM Config
        const llmConfig = generateLLmConfig(pv.llmConfig);
        trackTime("load_llm_config");

        // 3.1 Generate LLM Response
        const rr = await LlmGateway({
          prompt,
          messages: input.messages!,
          skills: input.skills!,
          skillChoice: input.skillChoice as SkillChoicesType,
          llmModel: pv.llmModel,
          llmProvider: pv.llmProvider,
          llmConfig: llmConfig,
          llmModelType: pv.llmModelType,
          isDevelopment: input.isDevelopment,
          attachments: input.attachments,
        });
        trackTime("llm_gateway_response");

        console.log(
          `llm response >>>> ${JSON.stringify(rr.response, null, 2)}`,
        );
        console.log(
          `llm performance >>>> ${JSON.stringify(rr.performance, null, 2)}`,
        );

        // 4. Save Data
        // 4.1 Save Chat History
        if (input.chat?.message && copilotId) {
          await saveChatMessages(
            ctx,
            userId,
            chatId,
            copilotId,
            input,
            rr,
            trackTime,
          );
        }

        const variables = replaceDataVariables(input.variables || {});
        trackTime("end");
        // 4.2 Save prompt data to database
        try {
          pl = await ctx.prisma.promptLog.create({
            data: {
              userId: userId,
              promptPackageId: pv.promptPackageId,
              promptTemplateId: pv.promptTemplateId,
              promptVersionId: pv.id,
              // error:

              environment: input.environment,

              version: pv.version,
              prompt: JSON.stringify(prompt),
              // completion: rr.data?.completion as string,
              llmResponse: rr.response,

              llmModelType: pv.llmModelType,
              llmProvider: pv.llmProvider,
              llmModel: pv.llmModel,
              llmConfig: llmConfig,
              promptVariables: variables,
              latency: (rr.performance?.latency as number) || 0,
              prompt_tokens: (rr?.performance?.prompt_tokens as number) || 0,
              completion_tokens:
                (rr?.performance?.completion_tokens as number) || 0,
              total_tokens: (rr?.performance?.total_tokens as number) || 0,
              extras: rr?.performance?.extra ? rr?.performance?.extra : {},
              stats: { ...getStats(), ...{ llmStats: rr.performance } },
              copilotId: copilotId,
            },
          });
          trackTime("save_prompt_data");
        } catch (error) {
          trackTime("save_prompt_data_failed");
          console.error("Error creating promptLog:", error);
        }
        if (chatId) {
          pl = { ...pl, chat: { id: chatId as string } };
        }
      }

      pl = { ...pl, stats: getStats() };
      return pl as GenerateOutput;
    }),
});

export const serviceLiteRouter = createTRPCRouter({
  generate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/{username}/{packageName}/{template}/{versionOrEnvironment}/generate/lite",
        tags: ["prompts"],
        summary: "Generate prompt completion",
      },
    })
    .input(generateInput)
    .use(promptMiddleware)
    .output(generateLiteOutput)
    .mutation(async ({ ctx, input }) => {
      const { trackTime, resetTime, getStats } = createTrackTime();
      resetTime();
      trackTime("start");
      let userId = ctx.jwt?.id as string;

      let copilotId = input?.copilotId as string;
      let pl;

      let errorResponse: LlmErrorResponse | null = null;

      // 0. Load latest Prompt version
      let [pv, pt] = await getPv(ctx, input);
      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);

      if (pv && userId && userId != "") {
        const modelType: ModelTypeType = pv.llmModelType;
        console.log(`data >>>> ${JSON.stringify(input)}`);

        // 1. Caching and Data Gathering
        let chatId = input.chat?.id as string;
        let userQuery: null | string = null;

        // 1.1 Semantic Caching
        // TODO

        // 1.2 create chat if not existing and load messages history

        chatId = await findOrCreateChatAndLoadHistory(
          ctx,
          copilotId,
          chatId,
          input,
        );
        trackTime("load_chat");

        // 1.3 Extract user query from last message
        if (input.messages && input.messages?.length > 0) {
          const lastMessage = input.messages[input.messages?.length - 1];
          userQuery = lastMessage?.content as string;
        }

        // 2. Build Prompt

        // 2.1 Load Embeddings Data if prompt have any context variables

        let embeddingVariables: any = {};
        let matches: any = [];

        if (input.scope && userQuery) {
          // Check prompt version have any variables related to context or not
          const contextVars = (pv.variables as TemplateVariablesType).filter(
            (v) => v.type + v.key == "$VIEW_CONTEXT",
          );

          if (contextVars.length > 0) {
            matches = await lookupEmbedding(
              userId,
              copilotId,
              userQuery,
              input.scope,
            );
          }

          embeddingVariables["$VIEW_CONTEXT" as any] =
            matches.length > 0 ? matches[0]?.doc : "Empty";

          embeddingVariables["$USER_QUERY" as any] = userQuery;
          trackTime("embeddings");
        }

        // 2.2 Build variables
        const templateVariables = {
          ...input.variables, //#
          ...embeddingVariables, //$
        };

        // 2.3 Generate Prompt using template
        let prompt: Prompt = "";
        if (hasImageModels(modelType)) {
          prompt = generatePrompt(pv.template, input.variables || {});
        } else {
          // here decide whether to take template data or promptData
          if (getEditorVersion(modelType, pv.llmProvider, pv.llmModel)) {
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            prompt = generatePromptFromJson(
              pv.promptData.data,
              templateVariables,
            ) as PromptDataType;
            // console.log(prompt);
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          } else {
            prompt = generatePrompt(pv.template, templateVariables);
          }
        }
        trackTime("generate_prompt");

        console.log(`prompt >>>> ${JSON.stringify(prompt, null, 2)}`);

        // 3. Get LLM Response
        // 3.1 Get LLM Config
        const llmConfig = generateLLmConfig(pv.llmConfig);
        trackTime("load_llm_config");

        // 3.1 Generate LLM Response
        const rr = await LlmGateway({
          prompt,
          messages: input.messages!,
          skills: input.skills!,
          skillChoice: input.skillChoice as SkillChoicesType,
          llmModel: pv.llmModel,
          llmProvider: pv.llmProvider,
          llmConfig: llmConfig,
          llmModelType: pv.llmModelType,
          isDevelopment: input.isDevelopment,
          attachments: input.attachments,
        });
        trackTime("llm_gateway_response");

        console.log(
          `llm response >>>> ${JSON.stringify(rr.response, null, 2)}`,
        );
        console.log(
          `llm performance >>>> ${JSON.stringify(rr.performance, null, 2)}`,
        );

        const variables = replaceDataVariables(input.variables || {});
        trackTime("end");
        // 4.2 Save prompt data to database
        ctx.prisma.promptLog
          .create({
            data: {
              userId: userId,
              promptPackageId: pv.promptPackageId,
              promptTemplateId: pv.promptTemplateId,
              promptVersionId: pv.id,

              environment: input.environment,

              version: pv.version,
              prompt: JSON.stringify(prompt),
              // completion: rr.data?.completion as string,
              llmResponse: rr.response,

              llmModelType: pv.llmModelType,
              llmProvider: pv.llmProvider,
              llmModel: pv.llmModel,
              llmConfig: llmConfig,
              promptVariables: variables,
              latency: (rr.performance?.latency as number) || 0,
              prompt_tokens: (rr?.performance?.prompt_tokens as number) || 0,
              completion_tokens:
                (rr?.performance?.completion_tokens as number) || 0,
              total_tokens: (rr?.performance?.total_tokens as number) || 0,
              extras: rr?.performance?.extra ? rr?.performance?.extra : {},
              stats: { ...getStats(), ...{ llmStats: rr.performance } },
              copilotId: copilotId,
            },
          })
          .then(() => {
            trackTime("save_prompt_data");
          })
          .catch((error) => {
            trackTime("save_prompt_data_failed");
            console.error("Error creating promptLog:", error);
          });
        if (input.chat?.message && copilotId) {
          await saveChatMessages(
            ctx,
            userId,
            chatId,
            copilotId,
            input,
            rr,
            trackTime,
          );
        }
        if (chatId) {
          pl = { llmResponse: rr.response, chat: { id: chatId as string } };
        }
      }

      pl = { ...pl, stats: getStats() };
      return pl as GenerateLiteOutput;
    }),
});

export async function getPv(ctx: any, input: any) {
  const userId = ctx.jwt?.id;
  let pt = null;
  let pv = null;

  console.info(
    `figuring out version for ${input.environment} version ${input.version}`,
  );

  if (!input.version && input.environment in promptEnvironment.Values) {
    const ptd = {
      // userId: userId, disabled this for shared URL
      promptPackageId: input.promptPackageId,
      id: input.promptTemplateId,
    };

    console.log(`ptd ----->>>>>> ${JSON.stringify(ptd)}`);

    console.info(
      `finding the ${input.environment} version ${JSON.stringify(ptd)}`,
    );

    pt = await ctx.prisma.promptTemplate.findFirst({
      where: ptd,
      include: {
        previewVersion: true,
        releaseVersion: true,
      },
    });

    pv =
      input.environment == promptEnvironment.Enum.RELEASE
        ? pt?.releaseVersion
        : pt?.previewVersion;
  } else if (input.version) {
    console.info(
      `loading version ${input.versionOrEnvironment} ${JSON.stringify(input)}`,
    );
    try {
      pv = await ctx.prisma.promptVersion.findFirstOrThrow({
        where: {
          // userId: userId,
          promptPackageId: input.promptPackageId,
          promptTemplateId: input.promptTemplateId,
          version: input.version,
        },
        include: {
          promptTemplate: true,
        },
      });
      pt = pv.promptTemplate;
    } catch (ex) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Prompt Version not found",
      });
    }
  }

  if (!pv) {
    console.error(`<<<>>> version: not found - ${JSON.stringify(input)}`);
  } else {
    console.log(`<<<>>> version: ${pv.version}  ${JSON.stringify(pv)}`);
  }

  return [pv, pt];
}
export async function findOrCreateChatAndLoadHistory(
  ctx: any,
  copilotId: string,
  chatId: string,
  input: any,
) {
  const userId = ctx.jwt?.id;
  let newChatPromise = null;
  let chatMessagesPromise = null;

  if (!chatId && copilotId) {
    newChatPromise = ctx.prisma.chat.create({
      data: {
        userId,
        copilotId: copilotId,
      },
    });
    const newChat = await newChatPromise;
    chatId = newChat?.id;
  }

  if (chatId) {
    chatMessagesPromise = ctx.prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: input.chat?.historyChat || 6,
    });
  }

  const [chatMessages, newChat] = await Promise.all([
    chatMessagesPromise,
    newChatPromise,
  ]);

  const transformedMessages: any[] =
    chatMessages?.map((message: any) => ({
      content: message.content,
      role: message.role,
    })) || [];
  const newMessage = input.chat?.message ? [input.chat?.message] : [];

  if (input.messages.length > 0) {
    console.warn("Overrideing messages history sent");
  }
  input.messages = transformedMessages.concat(newMessage);

  return chatId as string;
}

export const saveChatMessages = async (
  ctx: any,
  userId: string,
  chatId: string,
  copilotId: string,
  input: any,
  rr: any,
  trackTime: Function,
) => {
  const saveMessagePromises = [];

  // Create promises to save each message
  saveMessagePromises.push(
    ctx.prisma.message.create({
      data: {
        userId: userId,
        chatId: chatId,
        copilotId: copilotId,
        content: input.chat?.message.content as string,
        role: input.chat?.message.role,
      },
    }),
    ctx.prisma.message.create({
      data: {
        userId: userId,
        chatId: chatId,
        copilotId: copilotId,
        content: rr.response.data.completion[0].message.content ?? "",
        role: rr.response.data.completion[0].message.role,
      },
    }),
  );

  try {
    // Execute all save operations concurrently
    await Promise.all(saveMessagePromises);
    trackTime("save_chat_history");
    console.log("Messages saved successfully");
  } catch (error) {
    trackTime("save_chat_history_failed");
    console.error("Error creating Messages:", error);
  }
};
