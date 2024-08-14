import validator from "validator";
import {
  ActionRegistrationType,
  EmbeddingScopeWithUserType,
  AiEvaluationResponse,
  FormConfig,
  LanguageCode,
  Question,
  extracti18nText,
  geti18nMessage,
  useCopilot,
  QuestionEvaluation,
  AudioResponse,
} from "@sugar-ai/core";
import { speakMessageAsync, speaki18nMessageAsync } from "./voice";
import { QuestionAnswer } from "@sugar-ai/core";

export const SELECTED_QUESTION_TYPES = ["single_choice", "multiple_choice"];
export const SELECTED_QUESTION_ANSWER_SPLIT = ",";

export const captureVoiceResponseAndEvaluate = async (
  question: Question,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
  formConfig: FormConfig,
  getUserResponseContinous: Function,
  setIsEvaluating: Function,
  registerAction: Function,
  unregisterAction: Function,
  textToAction,
): Promise<QuestionEvaluation> => {
  // Start listening
  let userResponse: AudioResponse | null = null;
  // let fq: string | null = "";
  let attempts = 0;
  let questionAnswer = "";
  let followupResponse = "";

  let finalResponse: AiEvaluationResponse = {
    answer: "",
    followupQuestion: "",
    followupResponse: "",
  };

  // Loop until we get a valid answer or number of attempts exceeded
  while (finalResponse.followupQuestion !== null && attempts < 2) {
    // Speak it out to user if followup question exists
    if (finalResponse.followupQuestion !== "") {
      // Ask the followup question to the user
      await speakMessageAsync(
        finalResponse.followupQuestion,
        language,
        voice as SpeechSynthesisVoice,
      );
    }

    // Get user response
    const listenConfig = {
      ...formConfig.listen,
      ...{
        maxAnswerLength: question.validation?.max_length || 120,
      },
    };

    userResponse = await getUserResponseContinous(listenConfig);
    // userResponse = await getUserResponseAutoBreak(listenConfig);

    // // Fill answer in text field in case of text fields
    // if (inputRef && inputRef.current) {
    //   inputRef.current.value = userResponse;
    // }

    // Run Rule validators
    const isValidAnswer = await checkValidators(question, userResponse?.text);
    if (!isValidAnswer) {
      await speaki18nMessageAsync(
        geti18nMessage("validationFailed"),
        language,
        voice as SpeechSynthesisVoice,
      );
      continue;
    }

    // AI Evaluation
    if (!question.evaluation || question.evaluation == "ai") {
      console.log("Evaluating");
      setIsEvaluating(true);
      const aiEvaluationResponse = await aiEvaluate(
        question,
        userResponse?.text as string,
        language,
        registerAction,
        unregisterAction,
        textToAction,
      );

      // Ask followup question if needed
      if (!aiEvaluationResponse) {
        finalResponse.followupQuestion = null;
        questionAnswer = userResponse?.text as string;
      } else {
        finalResponse.followupQuestion = aiEvaluationResponse.followupQuestion;
        questionAnswer = aiEvaluationResponse.answer;

        followupResponse = questionAnswer;
        // followupResponse = aiEvaluationResponse.followupResponse ?? questionAnswer;
        console.log(`followupResponse: ${followupResponse}`);
      }
      setIsEvaluating(false);
    } else {
      // Manual/No evaluation
      finalResponse.followupQuestion = null;
      questionAnswer = userResponse?.text as string;
    }

    attempts = attempts + 1;
  }
  const qe: QuestionEvaluation = {
    userResponse: userResponse as AudioResponse,
    aiResponse: {
      answer: questionAnswer,
      followupResponse: followupResponse as string,
      followupQuestion: "",
    },
  };
  DEV: console.log(qe.aiResponse, qe.userResponse);
  return qe;
};

export const validateAnswerWithUser = async (
  question: Question,
  voiceAnswer: QuestionAnswer,
  followupResponse: string,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
  setVoiceAnswer: Function,
  setSelectedAnswer: Function,
) => {
  // await speaki18nMessageAsync(
  //   selectedAnswer,
  //   language,
  //   voice as SpeechSynthesisVoice,
  // );
  const answer = voiceAnswer.evaluatedAnswer;
  // Show final evaluated answer
  if (SELECTED_QUESTION_TYPES.includes(question.question_type)) {
    setVoiceAnswer(voiceAnswer);
    let choices = answer
      .split(SELECTED_QUESTION_ANSWER_SPLIT)
      .map((c) => c.trim());
    setSelectedAnswer(
      question.question_type == "multiple_choice" ? choices : [choices[0]],
    );

    await speakMessageAsync(
      followupResponse,
      language,
      voice as SpeechSynthesisVoice,
    );
  } else if (
    question.question_type == "text" ||
    question.question_type == "number"
  ) {
    const isValidAnswer = await checkValidators(question, answer);

    if (isValidAnswer) {
      setVoiceAnswer(voiceAnswer);
      await formatAndSpeak(question, answer, followupResponse, language, voice);
    } else {
      // Not valid answer
    }
  }
};

const formatAndSpeak = async (
  question: Question,
  answer: string,
  followupResponse: string,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
) => {
  let formattedResponse = followupResponse;

  DEV: console.log(`formating response : ${answer}`);

  if (question.validation?.validators?.includes("mobile")) {
    formattedResponse = formatMobileNumber(followupResponse);
  }
  DEV: console.log(`formatteed response : ${answer}`);
  if (answer && answer.length <= 150) {
    await speakMessageAsync(
      formattedResponse,
      language,
      voice as SpeechSynthesisVoice,
    );
  }
};

const checkValidators = async (
  question: Question,
  answer: string,
): Promise<boolean> => {
  const validators = question.validation?.validators || [];

  let result: boolean = true;

  // run validators
  validators.forEach(async (v) => {
    if (v == "mobile") {
      result = validator.isMobilePhone(answer.replace(/ /g, ""));
    }

    // if (validator == "email") {
    //   result = isEmail(answer);
    // }
  });

  return result;
};

const aiEvaluate = async (
  question: Question,
  answer: string,
  language: LanguageCode,
  registerAction: Function,
  unregisterAction: Function,
  textToAction: Function,
): Promise<AiEvaluationResponse> => {
  //   setIsEvaluating(true);

  const promptTemplate = process.env
    .NEXT_PUBLIC_FORM_EVALUATION_PROMPT as string;
  console.log(question);
  let options: string[] = [];

  const pvs: any = {
    "@language": language,
    "@question_type": question.question_type,
    "@question": extracti18nText(question.question_text, language),
  };

  let action: ActionRegistrationType = {
    name: "evaluateMcqResponse",
    description:
      "Evaluate the user's response for a question and return the most likely option.",
    parameters: [
      {
        name: "answer",
        type: "string",
        description: "Answer for the question",
        required: true,
      },
      {
        name: "isQuestionAnswered",
        type: "string",
        enum: ["fully", "partially", "no"],
        description: "Is question answered by the user ?",
        required: true,
      },
      {
        name: "followupResponse",
        type: "string",
        description:
          // "response to be communicated back when user answered the question correctly, which include 1-5 words along with the correct answer.For example: You have chosen <correct answer>, Nice <correct answer>, great, I am going ahead with <correct answer>, Dont ask any followup question, this is required when isQuestionAnswered is yes ",
          // "followup Respose to correct response, should be friendly with confirmation and the correct answer. Use 1-5 words along with the correct answer. For example: 'You have chosen <correct answer>,' 'Nice <correct answer>,' 'Great, I am going ahead with <correct answer>.' Do not ask any follow-up questions. This is required when isQuestionAnswered is yes.",
          `On receiving the user's answer, respond with a confirmation message in language ${language} that includes 1-5 words along with the correct answer. Examples: 'You have chosen <correct answer>', 'Hello <correct answer>', 'Nice choice with <correct answer>', 'Great, moving ahead with <correct answer>', 'Got it, <correct answer> it is', 'Perfect, <correct answer>,' 'Sounds good, <correct answer>', 'Excellent, <correct answer>', 'Alright <correct answer>', etc. Ensure no follow-up questions are asked when the answer is confirmed (isQuestionAnswered is yes).`,
        required: true,
      },
      {
        name: "followupQuestion",
        type: "string",
        description:
          "followup Question to be asked back to the user, this is required when isQuestionAnswered is partially or no",
        required: true,
      },
    ],
  };

  // Incase of mcq type of questions
  if (question.question_params?.options) {
    options = question.question_params?.options?.map((option) =>
      extracti18nText(option, language),
    ) as string[];

    pvs["@options"] = options.join(",");
    if (options?.length > 0) {
      action.parameters[0].enum = options;
    }
  }
  function evaluateMcqResponse(
    answer: string,
    isQuestionAnswered: string,
    followupResponse: string,
    followupQuestion: string,
  ) {
    // DEV: console.log(
    //   `answer: ${answer}, ${isQuestionAnswered}, ${followupResponse}, ${followupQuestion}`,
    // );

    if (isQuestionAnswered === "fully") {
      return {
        answer,
        followupResponse,
        followupQuestion: null,
      };
    }

    if (isQuestionAnswered !== "fully" && followupQuestion) {
      return { answer, followupResponse: null, followupQuestion };
    }

    throw new Error(
      "answer is not clear, and followup question is not provided",
    );
  }

  registerAction("evaluateMcqResponse", action, evaluateMcqResponse);

  // @ts-ignore
  const ttaResponse: TextToActionResponse = await textToAction(
    promptTemplate,
    answer,
    pvs,
    {
      scope1: "",
      scope2: "",
    } as EmbeddingScopeWithUserType,
    false,
    0,
  );
  unregisterAction("evaluateMcqResponse");

  //   setIsEvaluating(false);
  // e
  // if (!ttaResponse || ttaResponse.actionOutput) {
  //   throw new Error("Failed to get a valid response from textToAction");
  // }

  return ttaResponse.actionOutput;
};

function formatMobileNumber(mobile) {
  // Remove all hyphens and spaces
  const cleaned = mobile.replace(/[-\s]/g, "");

  // Ensure the number is 10 digits
  // if (cleaned.length !== 10) {
  //   throw new Error("Phone number must be 10 digits long");
  // }

  // Format as 4-3-3
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
}

// export async function createSubmission(
//   apiClient: any,
//   data: any,
// ): Promise<any> {
//   const result = (await apiClient.createSubmission(data)) as SugarAiApi.CreateSubmissionResponse;

//   // const response = await fetch(`/api/voice-forms/${data.formId}/submission`, {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //   },
//   //   body: JSON.stringify({
//   //     clientUserId: data.clientUserId,
//   //   }),
//   // });

//   if (!response.ok) {
//     throw new Error(`Failed to create submission: ${response.statusText}`);
//   }

//   const result: any = await response.json();
//   return result;
// }
