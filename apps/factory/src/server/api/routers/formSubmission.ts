import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { submissionSchema, submissionOutputSchema } from "~/validators/form";
import { TRPCError } from "@trpc/server";

export const formSubmissionRouter = createTRPCRouter({
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/form/submit",
        tags: ["VoiceForm"],
        summary: "Submit voice form with answers",
      },
    })
    .input(submissionSchema)
    .output(submissionOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { formId, answers } = input;

      // Validate that the form exists
      const form = await ctx.prisma.voiceForm.findUnique({
        where: { id: formId },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      // Create a submission
      const submission = await ctx.prisma.submission.create({
        data: {
          formId,
          answers: {
            create: answers.map((answer) => ({
              questionId: answer.questionId,
              response: answer.response,
            })),
          },
        },
      });

      return {
        submissionId: submission.id,
      };
    }),
});
