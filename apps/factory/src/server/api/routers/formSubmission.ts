import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  Form,
  createSubmission,
  createSubmissionResponse,
  CreateSubmissionResponse,
  submitAnswerResponse,
  submitAnswer,
} from "~/validators/form";
import { TRPCError } from "@trpc/server";

export const formSubmissionRouter = createTRPCRouter({
  createSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/voice-forms/{formId}/submission",
        tags: ["VoiceForm"],
        summary:
          "Create a new submission for voice form for user with clientUserId ",
      },
    })
    .input(createSubmission)
    .output(createSubmissionResponse)
    .mutation(async ({ ctx, input }) => {
      const { formId, clientUserId } = input;

      const form = await getForm(ctx, formId);
      // debugger;

      const submission = await ctx.prisma.$transaction(async (prisma: any) => {
        // Try to find an existing non-completed submission
        let existingSubmission = await prisma.formSubmission.findFirst({
          where: {
            formId,
            clientUserId,
            submittedAt: null, // Check if the submission is not completed
          },
        });

        // If no existing submission is found, create a new one
        if (!existingSubmission) {
          existingSubmission = await prisma.formSubmission.create({
            data: {
              formId,
              clientUserId,
              userId: form.userId, // Ensure this field is provided
              metadata: input.metadata,
            },
          });
        }

        return existingSubmission;
      });

      const response: CreateSubmissionResponse = {
        submissionId: submission.id,
      };

      return response;
    }),

  submitAnswer: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/voice-forms/{formId}/submission/{submissionId}/questions/{questionId}/answer",
        tags: ["VoiceForm"],
        summary: "Submit voice form with answers",
      },
    })
    .input(submitAnswer)
    .output(submitAnswerResponse)
    .mutation(async ({ ctx, input }) => {
      const { formId, submissionId, questionId, answer } = input;

      const form = await getForm(ctx, formId);

      debugger;
      // Create a submission
      const submittedAnswer = await ctx.prisma.formSubmissionAnswers.upsert({
        where: {
          // Unique constraint to identify the specific answer for the question by user, form, and submission
          submissionId_questionId: {
            questionId: questionId,
            submissionId: submissionId,
          },
        },
        update: {
          // Fields to update if the record exists
          answer: answer,
          metadata: input.metadata,
        },
        create: {
          // Fields to create a new record if it doesn't exist
          userId: form.userId,
          formId: formId,
          submissionId: submissionId,
          questionId: questionId,
          answer: answer,
          clientUserId: input.clientUserId,
          metadata: input.metadata,
        },
      });

      return { id: submittedAnswer.id };
    }),
});

async function getForm(ctx: any, formId: string): Promise<Form> {
  // Validate that the form exists
  const form = await ctx.prisma.form.findUnique({
    where: { id: formId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found",
    });
  }

  return form;
}
