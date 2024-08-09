import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  Form,
  createSubmission,
  createSubmissionResponse,
  CreateSubmissionResponse,
  submitAnswerResponse,
  submitAnswer,
} from "~/validators/form";
import { TRPCError } from "@trpc/server";
import { create } from "lodash";

export const formSubmissionRouter = createTRPCRouter({
  createSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/voice-forms/{formId}/submission",
        tags: ["VoiceForm"],
        summary: "Submit voice form with answers",
      },
    })
    .input(createSubmission)
    .output(createSubmissionResponse)
    .mutation(async ({ ctx, input }) => {
      const { formId, clientUserId } = input;

      const form = await getForm(ctx, formId);

      // Create a submission
      const submission = await ctx.prisma.formSubmission.create({
        data: {
          formId,
          clientUserId,
          userId: form.userId,
        },
      });

      const response: CreateSubmissionResponse = {
        submissionId: submission.id,
      };

      return response;
    }),

  submitAnswer: publicProcedure
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
      const submitteedAnswer = await ctx.prisma.formSubmissionAnswers.create({
        data: {
          id: formId,
          userId: form.userId,
          submissionId: submissionId,
          questionId: questionId,

          response: answer,
          // answers: {
          //   create: answers.map((answer) => ({
          //     questionId: answer.questionId,
          //     response: answer.response,
          //   })),
          // },
        },
      });

      return { id: submitteedAnswer.id };
    }),
});

async function getForm(ctx: any, formId: string): Promise<Form> {
  // Validate that the form exists
  const form = await ctx.prisma.voiceForm.findUnique({
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
