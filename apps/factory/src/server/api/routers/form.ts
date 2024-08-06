import { i18nMessage, i18nMessageSchema } from "@sugar-ai/core";
import { any } from "zod";
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
} from "~/validators/form";

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
      const formId = input.formId; // Assuming `formId` is provided in the input to identify which form to update

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
          userId: userId,
          description: input.description,
          startButtonText: input.startButtonText,
        },
      };

      try {
        // Perform the update operation
        const updatedForm = await ctx.prisma.form.update({
          where: { id: formId },
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

      // debugger;
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
            description: input.description,
            userId: userId,
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
});

const getEmptyMessage = (text: string = ""): i18nMessage => {
  const msg: i18nMessage = {
    lang: {
      en: text as string,
    },
  };

  return msg;
};
