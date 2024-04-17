import { ZodError } from "zod";

import {
  type SkillDefinitionType,
  type SkillRegistrationType,
  skillRegistrationSchema,
} from "./schema";
import { extractFunctionParams } from "./utils";

export function validate(
  name: string,
  registrationSchema: SkillRegistrationType,
  func: Function,
): string[] {
  const errors: string[] = [];

  // Validate the definition to be sure
  try {
    skillRegistrationSchema.parse(registrationSchema);
  } catch (error: any) {
    const msg: string = `[${name}] Invalid skill schema: ${error instanceof ZodError ? JSON.stringify(error.errors) : error.message}`;
    console.error(msg);
    errors.push(msg);
    // return false;
  }

  const funcString = func.toString();

  DEV: console.log(`[${name}] func ${funcString}`);

  const functionParams = extractFunctionParams(name, funcString);
  const functionParamNames = functionParams.map((param) => param.trim());

  // Extract parameters from SkillDefinitionType
  const parameters = registrationSchema.parameters;

  // Check if all function parameters exist in SkillRegistration
  if (functionParamNames.length !== parameters.length) {
    DEV: console.log(JSON.stringify(functionParamNames));
    DEV: console.log(JSON.stringify(parameters));
    const msg = `[${name}] Parameter count mismatch, expected ${functionParamNames.length} got ${parameters.length}`;
    errors.push(msg);
    PROD: console.error(msg);
  } else {
    functionParamNames.forEach((paramName, index: number) => {
      // const paramName = functionParamNames[index];
      const param = parameters[index];

      if (param.name !== paramName) {
        console.warn(
          `[${name}] Mismatached parameter name expected ${param.name} got: ${paramName}`,
        );
      }
    });
  }

  return errors;
}

export const register = (
  name: string,
  skillDefinition: SkillRegistrationType,
  skillCallback: Function,
  skills: Array<Record<string, SkillDefinitionType>>,
  callbacks: Array<Record<string, Function>>,
) => {
  if (!skillDefinition) {
    throw new Error(`[${name}] Skill config is required`);
  }

  if (skills[name]) {
    DEV: console.warn(`[${name}] Skill already registered `);
  }

  const errors = validate(name, skillDefinition, skillCallback);
  if (errors.length > 0) {
    throw new Error(`[${name}] Invalid skill definition: ${errors.join(", ")}`);
  }

  //  Generate skill JSON object
  // skills[func.name] = generateTool(func);
  skills[name] = transformSkillRegistrationToDefinition(skillDefinition);
  callbacks[name] = skillCallback;

  PROD: console.log(
    `[${name}] Skill Registered ${JSON.stringify(skills[name])}`,
  );
};
export const unregister = (
  name: string,
  skills: Array<Record<string, SkillDefinitionType>>,
  callbacks: Array<Record<string, Function>>,
) => {
  // Assuming skills is defined somewhere globally or in the scope
  DEV: console.log(`Unregistering Skills ${name}`);
  //  Generate skill JSON object
  if (skills[name] ?? false) {
    delete skills[name];
  }
  if (callbacks[name] ?? false) {
    delete callbacks[name];
  }

  // console.log(JSON.stringify(Object.values(skills)));
};

export function transformSkillRegistrationToDefinition(
  registration: SkillRegistrationType,
): SkillDefinitionType {
  const skillDefinition: SkillDefinitionType = {
    type: "function",
    function: {
      name: registration.name,
      description: registration.description,
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  };

  // Iterate through registration parameters and map them to definition parameters
  registration.parameters.forEach((param) => {
    const pp = {
      type: param.type,
      description: param.description,
      enum: param.enum,
    };

    if (!param.enum) {
      delete pp.enum;
    }
    skillDefinition.function.parameters.properties[param.name] = pp;

    // Check if the parameter is required and add it to the required array if so
    if (param.required) {
      skillDefinition.function.parameters.required.push(param.name);
    }
  });
  return skillDefinition;
}

TEST: setTimeout(() => {
  const registration: SkillRegistrationType = {
    name: "exampleSkill",
    description: "This is an example skill",
    parameters: [
      {
        name: "param1",
        type: "string",
        enum: ["value1", "value2"],
        description: "Description for param1",
        required: true,
      },
      {
        name: "param2",
        type: "integer",
        description: "Description for param2",
        required: false,
      },
    ],
    // required: ["param1"],
  };

  const definition: SkillDefinitionType =
    transformSkillRegistrationToDefinition(registration);

  TEST: console.log(definition);
}, 1000);
