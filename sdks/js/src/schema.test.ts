import {
  type ActionDefinitionType,
  type ActionParameterType,
  type ActionParametersType,
  ActionRegistrationType,
} from "./schema";

import { transformActionRegistrationToDefinition } from "./action";

const location: ActionParameterType = {
  type: "string",
  description: "The city and state, e.g. San Francisco, CA",
};

const format: ActionParameterType = {
  type: "string",
  enum: ["celsius", "fahrenheit"],
  description:
    "The temperature unit to use. Infer this from the users location.",
};

const parameters: ActionParametersType = {
  type: "object",
  properties: {
    location,
    format,
  },
  required: ["location", "format"],
};

// Example ActionDefinition object
const exampleActionDefinition: ActionDefinitionType = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "Get the current weather",
    parameters,
  },
};

const actions: ActionDefinitionType[] = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          format: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description:
              "The temperature unit to use. Infer this from the users location.",
          },
        },
        required: ["location", "format"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_n_day_weather_forecast",
      description: "Get an N-day weather forecast",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          format: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description:
              "The temperature unit to use. Infer this from the users location.",
          },
          num_days: {
            type: "integer",
            description: "The number of days to forecast",
          },
        },
        required: ["location", "format", "num_days"],
      },
    },
  },
];
