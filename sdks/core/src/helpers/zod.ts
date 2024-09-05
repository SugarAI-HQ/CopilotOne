import {
  z,
  ZodSchema,
  ZodObject,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodEnum,
  ZodArray,
  ZodOptional,
} from "zod";

// Helper function to translate a Zod object schema
export const translateZodObject = (schema: ZodObject<any>): string => {
  const shape = schema.shape;
  const result: string[] = [];
  for (const [key, value] of Object.entries(shape)) {
    result.push(`${key}: ${translateZodSchema(value as ZodSchema<any>)}`);
  }
  return `{ ${result.join(", ")} }`;
};

// Helper function to translate a Zod array schema
const translateZodArray = (schema: ZodArray<any, any>): string => {
  return `array(${translateZodSchema(schema.element)})`;
};

// Main function to translate any Zod schema to string
export const translateZodSchema = (schema: ZodSchema<any>): string => {
  if (schema instanceof ZodString) {
    return "z.string()";
  } else if (schema instanceof ZodNumber) {
    return "z.number()";
  } else if (schema instanceof ZodBoolean) {
    return "z.boolean()";
  } else if (schema instanceof ZodEnum) {
    return `z.enum(${JSON.stringify(schema.options)})`;
  } else if (schema instanceof ZodArray) {
    return translateZodArray(schema);
  } else if (schema instanceof ZodObject) {
    return translateZodObject(schema);
  } else if (schema instanceof ZodOptional) {
    return `${translateZodSchema(schema._def.innerType)}.optional()`;
  } else {
    return "unknown";
  }
};

// Helper function to translate a Zod object schema to TypeScript type
export const translateZodObjectToTypeScript = (
  schema: ZodObject<any>,
): string => {
  const shape = schema.shape;
  const result: string[] = [];
  for (const [key, value] of Object.entries(shape)) {
    result.push(
      `${key}: ${translateZodSchemaToTypeScript(value as ZodSchema<any>)}`,
    );
  }
  return `{ ${result.join("; ")} }`;
};

// Helper function to translate a Zod array schema to TypeScript type
export const translateZodArrayToTypeScript = (
  schema: ZodArray<any, any>,
): string => {
  return `Array<${translateZodSchemaToTypeScript(schema.element)}>`;
};

// Main function to translate any Zod schema to TypeScript type
export const translateZodSchemaToTypeScript = (
  schema: ZodSchema<any>,
): string => {
  if (schema instanceof ZodString) {
    return "string";
  } else if (schema instanceof ZodNumber) {
    return "number";
  } else if (schema instanceof ZodBoolean) {
    return "boolean";
  } else if (schema instanceof ZodEnum) {
    return `${JSON.stringify(schema.options)}`;
  } else if (schema instanceof ZodArray) {
    return translateZodArrayToTypeScript(schema);
  } else if (schema instanceof ZodObject) {
    return translateZodObjectToTypeScript(schema);
  } else if (schema instanceof ZodOptional) {
    return `${translateZodSchemaToTypeScript(schema._def.innerType)} | undefined`;
  } else {
    return "unknown";
  }
};
