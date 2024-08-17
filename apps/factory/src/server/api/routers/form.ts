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
} from "~/validators/form";
import { TRPCError } from "@trpc/server";

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
        description: getEmptyMessage("description"),
        startButtonText: getEmptyMessage("Start"),

        messages: {
          welcome: getEmptyMessage("Welcome"),
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

      const formDefaults = {
        description: getEmptyMessage("description"),
        startButtonText: getEmptyMessage("Start"),
        messages: {
          welcome: getEmptyMessage("Welcome"),
        },
        languages: ["en"],
        formConfig: {},
      };

      const updateData: any = {
        ...formDefaults,
        ...{
          name: input.name,
          description: input.description,
          startButtonText: input.startButtonText,
          languages: input.languages,
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
    // .meta({
    //   openapi: {
    //     method: "GET",
    //     path: "/packages",
    //     tags: ["packages"],
    //     summary: "Read all packages",
    //   },
    // })
    .input(getFormInput)
    .output(form)
    .query(async ({ ctx, input }) => {
      let query = {
        id: input.id,
        userId: ctx.jwt?.id as string,
      };

      // console.log(`packages input -------------- ${JSON.stringify(query)}`);

      // debugger;
      const form = await ctx.prisma.form.findUnique({
        where: query,
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

  getSubmissionsSummary: protectedProcedure
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
          // submittedAt: true,
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
    .output(getSubmissionsResponse)
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
      const submissions = await ctx.prisma.formSubmission.groupBy({
        where: {
          formId,
          userId,
        },
        by: ["createdAt"],
        _count: {
          _all: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const dates = submissions.map(
        (item) => item.createdAt.toISOString().split("T")[0],
      );
      const counts = submissions.map((item) => item._count._all);

      return { dates, counts };
    }),

  getLanguageBreakdown: protectedProcedure
    .input(getSubmissionsInput)
    .output(getSubmissionsResponse)
    .query(async ({ ctx, input }) => {
      const { formId } = input;
      const languages = await ctx.prisma.formSubmission.groupBy({
        // by: ["metadata->>language"], // Assuming language is stored in metadata
        where: {
          formId,
          userId: ctx.jwt?.id as string,
        },
        _count: {
          _all: true,
        },
      });

      return languages.map((lang) => ({
        label: lang.language,
        value: lang._count._all,
      }));
    }),

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

      const avgCompletionTime = await ctx.prisma.formSubmission.aggregate({
        _avg: {
          duration: {
            seconds: true,
          },
        },
        where: {
          formId,
          userId,
          NOT: {
            submittedAt: null,
          },
        },
      });

      return avgCompletionTime._avg?.duration || 0;
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
