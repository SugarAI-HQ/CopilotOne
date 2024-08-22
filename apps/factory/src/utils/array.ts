import { Question } from "@sugar-ai/core";

export type UniqueById<T extends { id: string }> = (
  existingItems: T[],
  newItems: T[],
) => T[];

export const mergeUniqueById: UniqueById<Question> = (
  existingQuestions,
  newQuestions,
) => {
  const questionMap = new Map<string, Question>();

  // Add existing questions to the map
  existingQuestions.forEach((question) =>
    questionMap.set(question.id, question),
  );

  // Add or update questions from newQuestions
  newQuestions.forEach((question) => questionMap.set(question.id, question));

  // Convert the map back to an array
  return Array.from(questionMap.values());
};
