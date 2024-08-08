import validator from "validator";
import {
  ActionRegistrationType,
  EmbeddingScopeWithUserType,
  EvaluationResponse,
  FormConfig,
  LanguageCode,
  Question,
  extracti18nText,
  geti18nMessage,
  useCopilot,
} from "@sugar-ai/core";
import { speakMessageAsync, speaki18nMessageAsync } from "./voice";

export const captureUserResponse = async (
  question: Question,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
  formConfig: FormConfig,
  getUserResponseContinous: Function,
  registerAction: Function,
  unregisterAction: Function,
  textToAction,
): Promise<{ questionAnswer: string; followupResponse: string }> => {
  // Start listening
  let userResponse: string = "";
  let fq: string | null = "";
  let attempts = 0;
  let questionAnswer = "";
  let followupResponse = "";

  // Loop until we get a valid answer or number of attempts exceeded
  while (fq !== null && attempts < 2) {
    if (fq !== "") {
      // Ask the followup question to the user
      await speakMessageAsync(fq, language, voice as SpeechSynthesisVoice);
    }

    // Get user response
    const listenConfig = {
      ...formConfig.listen,
      ...{
        maxAnswerLength: question.validation?.max_length,
      },
    };
    userResponse = await getUserResponseContinous(listenConfig);
    // userResponse = await getUserResponseAutoBreak(listenConfig);

    // // Fill answer in text field in case of text fields
    // if (inputRef && inputRef.current) {
    //   inputRef.current.value = userResponse;
    // }

    // Run Rule validators
    const isValidAnswer = await checkValidators(question, userResponse);
    if (!isValidAnswer) {
      await speaki18nMessageAsync(
        geti18nMessage("validationFailed"),
        language,
        voice as SpeechSynthesisVoice,
      );
      continue;
    }

    // AI Evaluation
    const evaluationResult = await aiEvaluate(
      question,
      userResponse,
      language,
      registerAction,
      unregisterAction,
      textToAction,
    );

    // Ask followup question if needed
    if (!evaluationResult) {
      fq = "";
      questionAnswer = userResponse;
    } else {
      fq = evaluationResult.followupQuestion;
      questionAnswer = evaluationResult.answer;

      followupResponse = questionAnswer;
      // followupResponse = evaluationResult.followupResponse ?? questionAnswer;
      console.log(`followupResponse: ${followupResponse}`);
    }

    attempts = attempts + 1;
  }

  return { questionAnswer, followupResponse };
};

export const validateAnswerWithUser = async (
  question: Question,
  answer: string,
  followupResponse: string,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
  setAnswer: Function,
  //   setAnswer: Function,
) => {
  // await speaki18nMessageAsync(
  //   selectedAnswer,
  //   language,
  //   voice as SpeechSynthesisVoice,
  // );

  // Show final evaluated answer
  if (question.question_type == "multiple_choice") {
    setAnswer(answer);

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
      if (answer.length <= 150) {
        await speakMessageAsync(
          followupResponse,
          language,
          voice as SpeechSynthesisVoice,
        );
      }
    } else {
      // Not valid answer
    }
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
  userResponse: string,
  language: LanguageCode,
  registerAction: Function,
  unregisterAction: Function,
  textToAction: Function,
): Promise<EvaluationResponse> => {
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
    userResponse,
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
