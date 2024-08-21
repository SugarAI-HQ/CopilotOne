import { ZodError } from "zod";

import {
  type ActionDefinitionType,
  type ActionRegistrationType,
  actionRegistrationSchema,
  type EmbeddingScopeWithUserType,
  DEFAULT_GROUP_ID,
  defaultGroupId,
  scopeDefaults,
  TextToActionResponse,
  EmbeddingScopeType,
} from "../schema/copilot";
import { extractFunctionParams } from "../helpers/utils";
import { performanceTracker } from "./performance";
import { SugarAiApiClient, type SugarAiApi } from "../api-client";
import { type ServiceGenerateRequestSkillsItem } from "../api-client/api";

export function validate(
  name: string,
  registrationSchema: ActionRegistrationType,
  func: Function,
): string[] {
  const errors: string[] = [];

  // Validate the definition to be sure
  try {
    actionRegistrationSchema.parse(registrationSchema);
  } catch (error: any) {
    const msg: string = `[${name}] Invalid action schema: ${
      error instanceof ZodError ? JSON.stringify(error.errors) : error.message
    }`;
    console.error(msg);
    errors.push(msg);
    // return false;
  }

  const funcString = func.toString();

  DEV: console.log(`[${name}] func ${funcString}`);

  const functionParams = extractFunctionParams(name, funcString);
  const functionParamNames = functionParams.map((param) => param.trim());

  // Extract parameters from ActionDefinitionType
  const parameters = registrationSchema.parameters;

  // Check if all function parameters exist in ActionRegistration
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
  actionDefinition: ActionRegistrationType,
  actionCallback: Function,
  actions: Array<Record<string, ActionDefinitionType>> = [],
  callbacks: Array<Record<string, Function>> = [],
) => {
  if (!actionDefinition) {
    throw new Error(`[${name}] Action config is required`);
  }

  if (actions[name]) {
    DEV: console.warn(`[${name}] Action already registered `);
  }

  const errors = validate(name, actionDefinition, actionCallback);
  if (errors.length > 0) {
    throw new Error(
      `[${name}] Invalid action definition: ${errors.join(", ")}`,
    );
  }

  //  Generate action JSON object
  // actions[func.name] = generateTool(func);
  actions[name] = transformActionRegistrationToDefinition(actionDefinition);
  callbacks[name] = actionCallback;

  PROD: console.log(
    `[${name}] Action Registered ${JSON.stringify(actions[name])}`,
  );
};
export const unregister = (
  name: string,
  actions: Array<Record<string, ActionDefinitionType>>,
  callbacks: Array<Record<string, Function>>,
) => {
  // Assuming actions is defined somewhere globally or in the scope
  DEV: console.log(`Unregistering Actions ${name}`);
  //  Generate action JSON object
  if (actions[name] ?? false) {
    delete actions[name];
  }
  if (callbacks[name] ?? false) {
    delete callbacks[name];
  }

  // console.log(JSON.stringify(Object.values(actions)));
};

export function transformActionRegistrationToDefinition(
  registration: ActionRegistrationType,
): ActionDefinitionType {
  const actionDefinition: ActionDefinitionType = {
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
    actionDefinition.function.parameters.properties[param.name] = pp;

    // Check if the parameter is required and add it to the required array if so
    if (param.required) {
      actionDefinition.function.parameters.required.push(param.name);
    }
  });
  return actionDefinition;
}

// TEST: setTimeout(() => {
//   const registration: ActionRegistrationType = {
//     name: "exampleAction",
//     description: "This is an example action",
//     parameters: [
//       {
//         name: "param1",
//         type: "string",
//         enum: ["value1", "value2"],
//         description: "Description for param1",
//         required: true,
//       },
//       {
//         name: "param2",
//         type: "integer",
//         description: "Description for param2",
//         required: false,
//       },
//     ],
//     // required: ["param1"],
//   };

//   const definition: ActionDefinitionType =
//     transformActionRegistrationToDefinition(registration);

//   TEST: console.log(definition);
// }, 1000);

export const executeAction = async function executeAction(
  actions,
  actionCallbacks,
): Promise<any> {
  for (const index in actions) {
    // Access each action object
    const action = actions[index];
    const actionName = action.function.name;
    // Access properties of the action object
    const actionArgs = JSON.parse(action.function.arguments);

    // Call the corresponding callback function using apply
    // actionCallbacks[actionName].apply(null, actionArgs);
    // actionCallbacks[actionName].call(null, actionArgs);
    // actionCallbacks[actionName].apply(null, actionArgs);
    PROD: console.log(
      `[${actionName}] Calling action ----> ${actionName}(${action.function.arguments})`,
    );

    const actionoutput: any = actionCallbacks[actionName](
      ...Object.values(actionArgs),
    );
    return actionoutput;
  }
};

export async function textToAction(
  promptTemplate,
  userQuery: string | null,
  promptVariables,
  scope: EmbeddingScopeType,
  config,
  isAssitant: boolean = false,
  chatHistorySize: number = 4,
  actions: Array<Record<string, ActionDefinitionType>> = [],
  actionCallbacks: Array<Record<string, Function>> = [],
): Promise<TextToActionResponse> {
  const { reset, addMarker, getStats } = performanceTracker();
  reset();
  addMarker("start");
  const [username, pp, pt, pv] = promptTemplate.split("/");
  const msg: SugarAiApi.ServiceGenerateRequestChatMessage = {
    role: isAssitant ? "assistant" : "user",
    content: userQuery as string,
  };

  const apiClient = new SugarAiApiClient({
    environment: config?.server.endpoint,
    token: config?.server.token,
  });

  // const messages = [msg];
  // console.log("actions", JSON.stringify(actions));
  // console.log("actionCallbacks", JSON.stringify(actionCallbacks));

  const effectiveScope = {
    ...scopeDefaults,
    ...scope,
    clientUserId: config.clientUserId,
  };

  if (effectiveScope.groupId === DEFAULT_GROUP_ID) {
    effectiveScope.groupId = defaultGroupId();
  }
  const result = (await apiClient.prompts.liteServiceGenerate(
    username,
    pp,
    pt,
    pv,
    {
      router: config.router,
      variables: promptVariables,
      scope: effectiveScope as SugarAiApi.ServiceGenerateRequestScope,
      // messages: messages as ServiceGenerateRequestMessagesItem[],
      chat: {
        id: config.clientUserId,
        message: msg,
        historyChat: chatHistorySize,
      },
      // messages: messages.slice(-3),
      // @ts-expect-error
      skills: Object.values(actions) as ServiceGenerateRequestSkillsItem[],
    },
  )) as SugarAiApi.LiteServiceGenerateResponse;
  // const c = await makeInference(
  //   promptTemplate,
  //   promptVariables,
  //   userQuery,
  //   uxActions,
  //   scope,
  //   dryRun,
  // );

  let textOutput: string = config?.ai?.successResponse as string;
  let actionOutput: any = null;

  addMarker("got_llm_response");

  // @ts-expect-error
  if (result.llmResponse?.error) {
    textOutput = config.ai?.failureResponse as string;
    addMarker("textToAction:failed");
  } else {
    // @ts-expect-error
    const choices: string | any[] = result.llmResponse?.data?.completion;

    if (choices instanceof Array) {
      // Function calling
      if (choices[0].message?.tool_calls) {
        addMarker("executing_actions");
        actionOutput = await executeAction(
          choices[0].message.tool_calls,
          actionCallbacks,
        );
        addMarker("executed_actions");
      }

      // Only content
      if (choices[0].message?.content) {
        textOutput = choices[0].message.content as string;
        addMarker("success");
      }
    } else if (typeof choices === "string") {
      textOutput = choices;
      addMarker("textToAction:success");
    } else if (isAssitant) {
      DEV: console.debug(`No choices expected in case of manual mode nudge`);
    } else {
      PROD: console.error(`Unknown response ${JSON.stringify(choices)}`);
      textOutput = config?.ai?.failureResponse as string;
      addMarker("textToAction:failed");
    }
  }
  addMarker("end");
  // observePerformance();
  PROD: console.log("Performance Stats", {
    // @ts-expect-error
    ...result.stats,
    ...{ clientStats: getStats() },
  });
  return { textOutput, actionOutput };
}

export async function textToJson(
  userQuery: string | null,
  schema,
  promptTemplate,
  promptVariables,
  config,
  // scope: EmbeddingScopeType,
  chatHistorySize: number = 4,
): Promise<any> {
  return [
    {
      id: "1",
      question_type: "text",
      question_text: {
        lang: {
          en: "What is your name?",
          hi: "आपका नाम क्या है?",
          "bn-IN": "তোমার নাম কি?",
          "te-IN": "మీ పేరు ఏమిటి?",
          "mr-IN": "तुझं नाव काय?",
          "ta-IN": "உங்கள் பெயர் என்ன?",
          es: "¿Cuál es tu nombre?",
          fr: "Quel est votre nom?",
          de: "Wie heißen Sie?",
          zh: "你叫什么名字？",
        },
      },
      question_params: {},
      qualification: {
        type: "ai",
        criteria: "Must match a valid name format",
      },
      validation: {
        max_length: 100,
      },
    },
    {
      id: "2",
      question_type: "number",
      question_text: {
        lang: {
          en: "Tell me your phone number.",
          hi: "मुझे अपना फोन नंबर बताएं।",
          "bn-IN": "আপনার ফোন নম্বর বলুন।",
          "te-IN": "మీ ఫోన్ నంబర్ చెప్పండి.",
          "mr-IN": "मला तुमचा फोन नंबर सांगा.",
          "ta-IN": "உங்கள் தொலைபேசி எண்ணை சொல்லுங்கள்.",
          es: "Dime tu número de teléfono.",
          fr: "Dites-moi votre numéro de téléphone.",
          de: "Sagen Sie mir Ihre Telefonnummer.",
          zh: "告诉我你的电话号码。",
        },
      },
      question_params: {},
      qualification: {
        type: "ai",
        criteria: "Must be a valid phone number",
      },
      validation: {
        max_length: 20,
        validators: ["mobile"],
      },
    },
    {
      id: "3",
      question_type: "single_choice",
      question_text: {
        lang: {
          en: "What is the intensity of your pain?",
          hi: "आप अभी कितना दर्द महसूस कर रहे हैं?",
          "bn-IN": "আপনার ব্যথার তীব্রতা কত?",
          "te-IN": "మీ నొప్పి తీవ్రత ఎంత?",
          "mr-IN": "आपण किती वेदना अनुभवत आहात?",
          "ta-IN": "உங்கள் வலி எவ்வளவு?",
          es: "¿Cuál es la intensidad de su dolor?",
          fr: "Quelle est l'intensité de votre douleur?",
          de: "Wie stark ist Ihr Schmerz?",
          zh: "你的疼痛程度如何？",
        },
      },
      question_params: {
        options: [
          {
            lang: {
              en: "Very Mild",
              hi: "बहुत हल्का",
              "bn-IN": "খুব হালকা",
              "te-IN": "చాలా మృదువైనది",
              "mr-IN": "अत्यंत सौम्य",
              "ta-IN": "மிக மிக மெதுவானது",
              es: "Muy leve",
              fr: "Très doux",
              de: "Sehr mild",
              zh: "非常轻微",
            },
          },
          {
            lang: {
              en: "Slight Pain",
              hi: "थोड़ा दर्द",
              "bn-IN": "হালকা ব্যথা",
              "te-IN": "తేలికపాటి నొప్పి",
              "mr-IN": "थोडा त्रास",
              "ta-IN": "சிறிது வலி",
              es: "Dolor leve",
              fr: "Légère douleur",
              de: "Leichter Schmerz",
              zh: "轻微疼痛",
            },
          },
          {
            lang: {
              en: "Moderate Pain",
              hi: "मध्यम दर्द",
              "bn-IN": "মাঝারি ব্যথা",
              "te-IN": "మోస్తరు నొప్పి",
              "mr-IN": "मध्यम वेदना",
              "ta-IN": "மிதமான வலி",
              es: "Dolor moderado",
              fr: "Douleur modérée",
              de: "Mäßiger Schmerz",
              zh: "中度疼痛",
            },
          },
          {
            lang: {
              en: "Severe Pain",
              hi: "काफ़ी गंभीर दर्द",
              "bn-IN": "তীব্র ব্যথা",
              "te-IN": "తీవ్ర నొప్పి",
              "mr-IN": "गंभीर वेदना",
              "ta-IN": "கடுமையான வலி",
              es: "Dolor severo",
              fr: "Douleur sévère",
              de: "Starke Schmerzen",
              zh: "剧烈疼痛",
            },
          },
          {
            lang: {
              en: "Very Severe Pain",
              hi: "बहुत ज्यादा गंभीर दर्द",
              "bn-IN": "খুব তীব্র ব্যথা",
              "te-IN": "చాలా తీవ్ర నొప్పి",
              "mr-IN": "अत्यंत गंभीर वेदना",
              "ta-IN": "மிகவும் கடுமையான வலி",
              es: "Dolor muy severo",
              fr: "Douleur très sévère",
              de: "Sehr starke Schmerzen",
              zh: "非常剧烈的疼痛",
            },
          },
        ],
      },
      qualification: {
        type: "ai",
        criteria:
          "Ensure the selected option corresponds to the user's reported pain level",
      },
      validation: {
        max_length: 100,
      },
    },
    {
      id: "4",
      question_type: "single_choice",
      question_text: {
        lang: {
          en: "How long have you been experiencing the problem?",
          hi: "आप इस समस्या का अनुभव कब से कर रहे हैं?",
          "bn-IN": "আপনি কতদিন ধরে এই সমস্যার সম্মুখীন হচ্ছেন?",
          "te-IN": "మీరు ఈ సమస్యను ఎంతకాలంగా అనుభవిస్తున్నారో చెప్పండి?",
          "mr-IN": "तुम्ही किती दिवसांपासून या समस्येला तोंड देत आहात?",
          "ta-IN":
            "நீங்கள் எவ்வளவு காலமாக இந்த பிரச்சினையை அனுபவித்து வருகிறீர்கள்?",
          es: "¿Cuánto tiempo lleva experimentando el problema?",
          fr: "Depuis combien de temps ressentez-vous ce problème?",
          de: "Wie lange haben Sie das Problem schon?",
          zh: "您经历这个问题有多长时间了？",
        },
      },
      question_params: {
        options: [
          {
            lang: {
              en: "Less than 15 days",
              hi: "15 दिन से कम",
              "bn-IN": "১৫ দিনের কম",
              "te-IN": "15 రోజులకు తక్కువ",
              "mr-IN": "१५ दिवसांपेक्षा कमी",
              "ta-IN": "15 நாட்களுக்கும் குறைவாக",
              es: "Menos de 15 días",
              fr: "Moins de 15 jours",
              de: "Weniger als 15 Tage",
              zh: "少于15天",
            },
          },
          {
            lang: {
              en: "15 to 30 days",
              hi: "15 से 30 दिन",
              "bn-IN": "১৫ থেকে ৩০ দিন",
              "te-IN": "15 నుండి 30 రోజులు",
              "mr-IN": "१५ ते ३० दिवस",
              "ta-IN": "15 முதல் 30 நாட்கள்",
              es: "15 a 30 días",
              fr: "15 à 30 jours",
              de: "15 bis 30 Tage",
              zh: "15至30天",
            },
          },
          {
            lang: {
              en: "1 to 6 months",
              hi: "1 से 6 महीने",
              "bn-IN": "১ থেকে ৬ মাস",
              "te-IN": "1 నుండి 6 నెలలు",
              "mr-IN": "१ ते ६ महिने",
              "ta-IN": "1 முதல் 6 மாதங்கள்",
              es: "1 a 6 meses",
              fr: "1 à 6 mois",
              de: "1 bis 6 Monate",
              zh: "1到6个月",
            },
          },
          {
            lang: {
              en: "6 to 12 months",
              hi: "6 से 12 महीने",
              "bn-IN": "৬ থেকে ১২ মাস",
              "te-IN": "6 నుండి 12 నెలలు",
              "mr-IN": "६ ते १२ महिने",
              "ta-IN": "6 முதல் 12 மாதங்கள்",
              es: "6 a 12 meses",
              fr: "6 à 12 mois",
              de: "6 bis 12 Monate",
              zh: "6到12个月",
            },
          },
          {
            lang: {
              en: "More than a year",
              hi: "1 साल से अधिक",
              "bn-IN": "১ বছরের বেশি",
              "te-IN": "ఒక సంవత్సరం కంటే ఎక్కువ",
              "mr-IN": "१ वर्षाहून अधिक",
              "ta-IN": "ஒரு வருடத்திற்கு மேல்",
              es: "Más de un año",
              fr: "Plus d'un an",
              de: "Mehr als ein Jahr",
              zh: "一年以上",
            },
          },
        ],
      },
      qualification: {
        type: "ai",
        criteria: "Answer must align with the reported duration of the issue",
      },
      validation: {
        max_length: 50,
      },
    },
    {
      id: "5",
      question_type: "text",
      question_text: {
        // mode: "manual",
        lang: {
          en: "What's your age?",
          hi: "आपकी उम्र कितने साल है?",
          "bn-IN": "আপনার বয়স কত?",
          "te-IN": "మీ వయసు ఎంత?",
          "mr-IN": "तुमचे वय किती आहे?",
          "ta-IN": "உங்கள் வயது என்ன?",
          es: "¿Cuál es tu edad?",
          fr: "Quel âge avez-vous?",
          de: "Wie alt sind Sie?",
          zh: "你多大了？",
        },
        // voice: true,
        // output: "none",
      },
      qualification: {
        type: "none",
        criteria: "Answer must align with the user's reported age",
      },
      question_params: {},
      validation: {
        max_length: 50,
      },
    },
    {
      id: "6",
      question_type: "text",
      question_text: {
        // mode: "manual",
        lang: {
          en: "What is your occupation?",
          hi: "आप क्या काम करते हैं?",
          "bn-IN": "আপনি কি কাজ করেন?",
          "te-IN": "మీరు ఏమి చేస్తారు?",
          "mr-IN": "आपण काय करता?",
          "ta-IN": "நீங்கள் என்ன வேலை செய்கிறீர்கள்?",
          es: "¿Cuál es tu ocupación?",
          fr: "Quelle est votre profession?",
          de: "Was machen Sie beruflich?",
          zh: "你是做什么工作的？",
        },
        // voice: true,
        // output: "none",
      },
      question_params: {},
      qualification: {
        type: "ai",
        criteria: "Respondent should provide their current occupation clearly",
      },

      validation: {
        max_length: 50,
      },
    },
    {
      id: "7",
      question_type: "text",
      question_text: {
        // mode: "manual",
        lang: {
          en: "Please explain your current problem. Mention the pain, affected areas etc.",
          hi: "आप अपने दर्द और समस्या के बारे में बताएं",
          "bn-IN":
            "আপনার বর্তমান সমস্যার ব্যাখ্যা করুন। ব্যথা, ক্ষতিগ্রস্থ অঞ্চল উল্লেখ করুন ইত্যাদি।",
          "te-IN":
            "మీ ప్రస్తుత సమస్యను వివరించండి. నొప్పి, ప్రభావిత ప్రాంతాలు మొదలైనవి.",
          "mr-IN": "तुमची सध्याची समस्या स्पष्ट करा. वेदना, प्रभावित भाग इ.",
          "ta-IN":
            "உங்கள் தற்போதைய பிரச்சினையை விளக்கவும். வலி, பாதிக்கப்பட்ட பகுதிகளைப் குறிப்பிடவும்.",
          es: "Explique su problema actual. Mencione el dolor, las áreas afectadas, etc.",
          fr: "Veuillez expliquer votre problème actuel. Mentionnez la douleur, les zones touchées, etc.",
          de: "Bitte erklären Sie Ihr aktuelles Problem. Erwähnen Sie den Schmerz, betroffene Bereiche usw.",
          zh: "请解释您的当前问题。提及疼痛、受影响的区域等。",
        },
        // voice: true,
        // output: "none",
      },
      question_params: {},
      qualification: {
        type: "ai",
        criteria:
          "Must provide a clear description of the pain and affected areas, and must be in the context of the current problem",
      },
      validation: {
        max_length: 200,
      },
    },
  ];
}
