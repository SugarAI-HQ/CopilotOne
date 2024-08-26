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
  completeSubmissionInput,
  completeSubmissionResponse,
  getFormInput,
  form,
} from "~/validators/form";
import { TRPCError } from "@trpc/server";

import { InputJsonValueType } from "~/generated/prisma-client-zod.ts";

export const formSubmissionRouter = createTRPCRouter({
  getForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/voice-forms/{formId}",
        tags: ["VoiceForm"],
        summary: "Get voice form",
      },
    })
    .input(getFormInput)
    .output(form)
    .query(async ({ ctx, input }) => {
      let query = {
        id: input.formId,
        userId: ctx.jwt?.id as string,
      };

      const form = await ctx.prisma.form.findUnique({
        where: query,
        include: {
          questions: {
            select: {
              id: true,
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
      return form;
    }),

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
          answer: answer as InputJsonValueType,
          metadata: input.metadata as InputJsonValueType,
        },
        create: {
          // Fields to create a new record if it doesn't exist
          userId: form.userId,
          formId: formId,
          submissionId: submissionId,
          questionId: questionId,
          answer: answer as InputJsonValueType,
          clientUserId: input.clientUserId,
          metadata: input.metadata as InputJsonValueType,
        },
      });

      return { id: submittedAnswer.id };
    }),

  completeSubmission: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/voice-forms/{formId}/submission/{submissionId}/complete",
        tags: ["VoiceForm"],
        summary: "Finalize a submission after all answers are submitted",
      },
    })
    .input(completeSubmissionInput)
    .output(completeSubmissionResponse) // Define this schema according to your response structure
    .mutation(async ({ ctx, input }) => {
      const { formId, submissionId } = input;

      // // Find the submission and verify that it belongs to the current user
      // const submission = await ctx.prisma.formSubmission.findFirst({
      //   where: {
      //     id: submissionId,
      //     formId,
      //     clientUserId,
      //     submittedAt: null, // Ensure the submission is not already finalized
      //   },
      // });

      // if (!submission) {
      //   throw new Error("Submission not found or already finalized.");
      // }

      // Finalize the submission by setting the submittedAt field
      const updatedSubmission = await ctx.prisma.formSubmission.update({
        where: {
          id: submissionId,
          formId,
        },
        data: {
          submittedAt: new Date(),
        },
      });

      return {
        submissionId: updatedSubmission.id,
        message: "Submission finalized successfully",
      };
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
