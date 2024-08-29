import {
  createTRPCRouter,
  promptMiddleware,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  getFormsInput,
  formList,
  createFormInput,
  updateFormInput,
  getFormInput,
  form,
  I18nMessageWithRules,
  getAnswersInput,
  getSubmissionsInput,
  getSubmissionsResponse,
  getSubmissionResponse,
  GetSubmissionResponse,
  parsePrismaJsonb,
  createOrUpdateQuestionsInput,
  updateQuestionOrderInput,
  createOrUpdateQuestionsResponse,
} from "~/validators/form";
import { TRPCError } from "@trpc/server";
import { InputJsonValueType } from "~/generated/prisma-client-zod.ts";
import { validate as isUuid, v4 as uuidv4 } from "uuid";
import { bulkUpdate } from "~/services/prisma"; // Adjust import paths as necessary
import { defaultFormTranslations, geti18nMessage } from "@sugar-ai/core";

export const formRouter = createTRPCRouter({
  getForms: protectedProcedure
    // .meta({
    //   openapi: {
    //     method: "GET",
    //     path: "/packages",
    //     tags: ["packages"],
    //     summary: "Read all packages",
    //   },
    // })
    .input(getFormsInput)
    .output(formList)
    .query(async ({ ctx, input }) => {
      let query = {
        userId: ctx.jwt?.id as string,
      };

      // console.log(`packages input -------------- ${JSON.stringify(query)}`);

      const forms = await ctx.prisma.form.findMany({
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });
      // console.log(`forms out -------------- ${JSON.stringify(forms)}`);
      return forms;
    }),

  createForm: protectedProcedure
    .input(createFormInput)
    .output(form)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const formDefaults = {
        description: geti18nMessage("description", defaultFormTranslations),
        startButtonText: geti18nMessage(
          "startButtonText",
          defaultFormTranslations,
        ),

        messages: {
          welcome: geti18nMessage("welcome", defaultFormTranslations),
          submit: geti18nMessage("submit", defaultFormTranslations),
        },
        languages: ["en"],
        formConfig: {},
      };

      const data: any = {
        ...formDefaults,
        ...{
          userId: userId,
          name: input.name,
        },
      };

      try {
        // debugger;
        const form = await ctx.prisma.form.create({
          data: data,
        });
        return form;
      } catch (error: any) {
        console.error(`Error in creating Package-----------------  ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  updateForm: protectedProcedure
    .input(updateFormInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const formId = input.id;

      const updateData: any = {
        name: input.name,
        description: input.description ?? getEmptyMessage("description"),
        startButtonText: input.startButtonText ?? getEmptyMessage("Start"),
        languages: input.languages ?? ["en"],
        formConfig: {},
        messages: {
          welcome:
            input.messages.welcome ??
            geti18nMessage("welcome", defaultFormTranslations),
          submit:
            input.messages.submit ??
            geti18nMessage("submit", defaultFormTranslations),
        },
      };

      try {
        // Perform the update operation
        const updatedForm = await ctx.prisma.form.update({
          where: { id: formId, userId: userId },
          data: updateData,
        });

        return updatedForm;
      } catch (error: any) {
        console.error(`Error in updating form ----------------- ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exists" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  getForm: protectedProcedure
    .input(getFormInput)
    .output(form)
    .query(async ({ ctx, input }) => {
      let query = {
        id: input.formId,
        userId: ctx.jwt?.id as string,
      };

      // console.log(`packages input -------------- ${JSON.stringify(query)}`);

      // debugger;
      const form = await ctx.prisma.form.findUnique({
        where: query,
        include: {
          questions: {
            select: {
              id: true,
              // @ts-ignore
              active: true,
              question_type: true,
              question_text: true,
              question_params: true,

              validation: true,
              // @ts-ignore
              qualification: true,
              order: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              // @ts-ignore
              order: "asc",
            },
          },
        },
      });

      // console.log(`forms out -------------- ${JSON.stringify(forms)}`);
      return form;
    }),

  createQuestion: protectedProcedure
    .input(createFormInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      try {
        const voiceForm = await ctx.prisma.form.create({
          data: {
            name: input.name,
            userId: userId,

            description: "Default description", // Provide default values
            startButtonText: "Start",
            messages: "{}",
            formConfig: "{}",
          },
        });
        return voiceForm;
      } catch (error: any) {
        console.error(`Error in creating Package-----------------  ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  upsertQuestions: protectedProcedure
    .input(createOrUpdateQuestionsInput)
    // .output(createOrUpdateQuestionsResponse)
    .mutation(async ({ ctx, input }) => {
      const { formId, questions } = input;
      const userId = ctx.jwt?.id as string;
      try {
        const upsertedQuestions = await ctx.prisma.$transaction(
          await questions.map((question) => {
            const questionId = isUuid(question?.id) ? question?.id : uuidv4();
            return ctx.prisma.formQuestion.upsert({
              where: {
                userId: userId,
                formId: formId,
                id: questionId,
              },
              update: {
                question_type: question.question_type,
                question_text: question.question_text,
                question_params: question.question_params as InputJsonValueType,
                validation: question.validation as InputJsonValueType,
                // @ts-ignore
                qualification: question.qualification as InputJsonValueType,
                order: question.order,
                active: question.active,
              },
              create: {
                userId: userId,
                formId: formId,
                question_type: question.question_type,
                question_text: question.question_text,
                question_params: question.question_params as InputJsonValueType,
                validation: question.validation as InputJsonValueType,
                // @ts-ignore
                qualification: question.qualification as InputJsonValueType,
                order: question.order,
                active: true,
              },
            });
          }),
        );

        return upsertedQuestions;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upsert questions",
        });
      }
    }),

  //   .mutation("createQuestion", {
  //     input: z.object({
  //       voiceFormId: z.string(),
  //       question_type: z.enum([
  //         "multiple_choice",
  //         "single_choice",
  //         "text",
  //         "number",
  //       ]),
  //       question_text: z.object({}).passthrough(),
  //       question_params: z.object({}).passthrough(),
  //       validation: z.object({}).passthrough(),
  //     }),
  //     resolve: async ({ input }) => {
  //       return ctx.prisma.question.create({
  //         data: {
  //           ...input,
  //           voiceForm: {
  //             connect: {
  //               id: input.voiceFormId,
  //             },
  //           },
  //         },
  //       });
  //     },

  getSubmissions: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/voice-forms/{formId}/submissions",
        tags: ["VoiceForm"],
        summary: "Get a summary of submissions for a voice form",
      },
    })
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      const { formId } = input;

      const submissions = await ctx.prisma.formSubmission.findMany({
        where: {
          formId,
          userId,
        },
        select: {
          id: true,
          clientUserId: true,
          submittedAt: true,
          createdAt: true,
        },
      });

      return submissions;
    }),

  getSubmission: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/voice-forms/{formId}/submission/{submissionId}",
        tags: ["VoiceForm"],
        summary: "Get details of a single submission",
      },
    })
    .input(getAnswersInput)
    .output(getSubmissionResponse)
    .query(async ({ ctx, input }) => {
      const { formId, submissionId } = input;

      const submission = await ctx.prisma.formSubmission.findUnique({
        where: {
          id: submissionId,
          formId,
          userId: ctx.jwt?.id as string,
        },
        include: {
          answers: {
            select: {
              questionId: true,
              answer: true,
              metadata: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      // const parsedSubmissionData: GetSubmissionResponse = parsePrismaJsonb(
      //   submission,
      //   getSubmissionResponse,
      // );

      return submission;
    }),

  getTotalSubmissions: protectedProcedure
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      const { formId } = input;
      return await ctx.prisma.formSubmission.count({
        where: {
          formId: formId,
          userId,
        },
      });
    }),

  getSubmissionTimeSeries: protectedProcedure
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      const { formId } = input;
      const submissions = await ctx.prisma.$queryRaw<
        { date: string; count: number }[]
      >`
      SELECT DATE("createdAt") AS date, COUNT(*) AS count
      FROM "FormSubmission"
      WHERE "formId" = ${formId} AND "userId" = ${userId}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

      const dates = submissions.map(
        (item) => new Date(item.date).toISOString().split("T")[0],
      );
      const counts = submissions.map((item) => Number(item.count));

      return { dates, counts };
    }),

  updateQuestionOrder: protectedProcedure
    .input(updateQuestionOrderInput)
    // .output()
    .mutation(async ({ ctx, input }) => {
      const { orderedQuestions } = input;

      // // Prepare the entries for bulk update
      // const entries = orderedQuestions.map((question, index) => ({
      //   id: question.id,
      //   order: index + 1,
      // }));

      // Call the bulkUpdate function to perform the update
      const result = await bulkUpdate(
        ctx.prisma,
        "FormQuestion",
        orderedQuestions,
      );
      return { success: !!result };
    }),

  // getLanguageBreakdown: protectedProcedure
  //   .input(getSubmissionsInput)
  //   .output(getSubmissionsResponse)
  //   .query(async ({ ctx, input }) => {
  //     const { formId } = input;
  //     const languages = await ctx.prisma.formSubmission.groupBy({
  //       // by: ["metadata->>language"], // Assuming language is stored in metadata
  //       where: {
  //         formId,
  //         userId: ctx.jwt?.id as string,
  //       },
  //       _count: {
  //         _all: true,
  //       },
  //     });

  //     return languages.map((lang) => ({
  //       label: lang.language,
  //       value: lang._count._all,
  //     }));
  //   }),

  getCompletionRate: protectedProcedure
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      const { formId } = input;

      const totalSubmissions = await ctx.prisma.formSubmission.count({
        where: {
          formId,
          userId,
        },
      });

      const completedSubmissions = await ctx.prisma.formSubmission.count({
        where: {
          formId,
          userId,
          NOT: {
            submittedAt: null,
          },
        },
      });

      const completionRate =
        totalSubmissions > 0
          ? (completedSubmissions / totalSubmissions) * 100
          : 0;

      return completionRate;
    }),

  getAverageCompletionTime: protectedProcedure
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      const { formId } = input;

      const submissions = await ctx.prisma.formSubmission.findMany({
        where: {
          formId,
          userId,
          NOT: {
            submittedAt: null,
          },
        },
        select: {
          createdAt: true,
          submittedAt: true,
        },
      });

      // Calculate the total duration and count
      const totalDuration = submissions.reduce((acc, submission) => {
        const duration = submission?.submittedAt
          ? submission?.submittedAt?.getTime() - submission.createdAt.getTime()
          : 0;
        return acc + duration;
      }, 0);

      const averageDuration = totalDuration / submissions.length;

      // Return the average duration in seconds
      return averageDuration / 1000; // Convert milliseconds to seconds
    }),
});

const getEmptyMessage = (text: string = ""): I18nMessageWithRules => {
  const msg: I18nMessageWithRules = {
    lang: {
      en: text as string,
    },
  };

  return msg;
};
