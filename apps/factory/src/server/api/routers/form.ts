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
import {
  InputJsonValueType,
  FormSubmissionAnswers,
} from "~/generated/prisma-client-zod.ts";
import { validate as isUuid, v4 as uuidv4 } from "uuid";
import { bulkUpdate } from "~/services/prisma"; // Adjust import paths as necessary
import {
  defaultFormTranslations,
  geti18nMessage,
  extracti18nText,
} from "@sugar-ai/core";
import { orderBy } from "lodash";
import * as ExcelJS from "exceljs";
import { format } from "date-fns/format";

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
        } as InputJsonValueType,
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
        orderBy: {
          createdAt: "desc",
        },
      });

      return submissions;
    }),

  exportSubmissions: protectedProcedure
    .input(getSubmissionsInput)
    .mutation(async ({ ctx, input }) => {
      const { formId } = input; // Extract the formId from the input

      const form = await ctx.prisma.form.findUnique({
        where: { id: formId },
      });

      if (!form) {
        throw new Error("Form not found");
      }

      const formName = form.name; // Extract form name
      const timestamp = format(new Date(), "yyyy-MM-dd_HH:mm:ss");
      const fileName = `${formName.replace(/\s+/g, "_")}_${timestamp}.xlsx`;

      // Execute the query
      const submissions = await ctx.prisma.formSubmission.findMany({
        where: { formId },
        include: {
          answers: {
            include: {
              question: true,
            },
          },
        },
      });

      // Get unique questions based on submissions
      const questions = submissions.flatMap((submission: any) =>
        submission.answers.map((answer: any) => answer.question),
      );

      // Remove duplicates (by question id)
      const uniqueQuestions = Array.from(
        new Map(
          questions.map((question: any) => [question.id, question]),
        ).values(),
      );

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Submissions");

      // Define headers
      const headers = [
        { header: "Submission ID", key: "submission_id", width: 36 },
        { header: "User ID", key: "user_id", width: 36 },
        { header: "Client User ID", key: "client_user_id", width: 36 },
        { header: "Form ID", key: "form_id", width: 36 },
        { header: "Submission Time", key: "submission_time", width: 15 },
        { header: "Duration", key: "duration", width: 15 },

        // Metadata breakdown headers
        { header: "OS Name", key: "os_name", width: 20 },
        { header: "OS Version", key: "os_version", width: 15 },
        { header: "Device Model", key: "device_model", width: 20 },
        { header: "Device Vendor", key: "device_vendor", width: 20 },
        { header: "Browser Name", key: "browser_name", width: 15 },
        { header: "Browser Version", key: "browser_version", width: 15 },
        { header: "Engine Name", key: "engine_name", width: 15 },
        { header: "Engine Version", key: "engine_version", width: 15 },
        // { header: "User Agent", key: "user_agent", width: 50 },
      ];

      // Add a column for each unique question with answer details
      uniqueQuestions.forEach((question, index) => {
        headers.push({
          header: `1: ${extracti18nText(question.question_text, "en")}`, // Question text as header
          key: `question_${index}`, // Unique key for each question
          width: 50,
        });
        headers.push({
          header: `${index}: By`, // Column for 'by'
          key: `by_${index}`,
          width: 20,
        });
        headers.push({
          header: `${index}: Raw Answer`, // Column for 'rawAnswer'
          key: `rawAnswer_${index}`,
          width: 50,
        });
      });

      // Set worksheet columns based on headers
      worksheet.columns = headers;

      // Add rows to the worksheet
      submissions.forEach((submission: any) => {
        const metadata = submission.metadata;

        const rowData: any = {
          submission_id: submission.id,
          user_id: submission.userId,
          client_user_id: submission.clientUserId,
          form_id: submission.formId,
          submission_time: submission.submittedAt
            ? format(new Date(submission.submittedAt), "yyyy-MM-dd HH:mm:ss")
            : "",
          duration: submission.duration,

          // Metadata breakdown
          os_name: metadata.os?.name || "",
          os_version: metadata.os?.version || "",
          device_model: metadata.device?.model || "",
          device_vendor: metadata.device?.vendor || "",
          browser_name: metadata.browser?.name || "",
          browser_version: metadata.browser?.version || "",
          engine_name: metadata.engine?.name || "",
          engine_version: metadata.engine?.version || "",
          // user_agent: metadata.ua || "",
        };

        // Populate the answers for the corresponding questions
        uniqueQuestions.forEach((question, index) => {
          const qa = submission.answers.find(
            (ans: any) => ans.question.id === question?.id,
          );
          const answer = qa?.answer;
          rowData[`question_${index}`] = answer ? answer.evaluatedAnswer : "";
          rowData[`by_${index}`] = answer ? answer.by : "";
          rowData[`rawAnswer_${index}`] = answer ? answer.rawAnswer : "";
        });

        // Add the row data to the worksheet
        worksheet.addRow(rowData);
      });

      // Generate a buffer from the workbook
      const buffer = await workbook.xlsx.writeBuffer();

      // Return the buffer to the client
      return {
        // @ts-expect-error
        buffer: buffer.toString("base64"),
        filename: fileName,
      };
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
