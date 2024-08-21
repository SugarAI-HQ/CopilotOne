import React, { useEffect, useState } from "react";
import QuestionView from "./view"; // Import the QuestionView component
import { LanguageCode, Question, VoiceForm } from "@sugar-ai/core";
import Loading from "~/components/Layouts/loading";
import QuestionNew from "./new";
import { VoiceToJson } from "@sugar-ai/copilot-one-js";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface QuestionListProps {
  voiceForm: VoiceForm;
  languages: LanguageCode[];
  // onEdit: (id: string) => void;
  // onDelete: (id: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  voiceForm,
  languages,
  // onEdit,
  // onDelete,
}) => {
  const initQuestions = voiceForm?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(initQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    console.log("voiceForm", voiceForm);
    console.log("questions", questions);
  }, [voiceForm]);

  // const handleAddOrEditQuestion = (question: Question) => {
  //   if (editingQuestion) {
  //     setQuestions((prevQuestions) =>
  //       prevQuestions.map((q) => (q.id === editingQuestion.id ? question : q)),
  //     );
  //     setEditingQuestion(null);
  //   } else {
  //     setQuestions([...questions, question]);
  //   }
  // };

  const onQuestions = async (
    formId: string,
    toBeUpsertedQuestions: Question[],
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      formQuestionsMutation.mutate(
        { formId, questions: toBeUpsertedQuestions },
        {
          onSuccess: async (upsertedQuestions: Question[]) => {
            const uniqueQuestions = mergeUniqueById(
              questions,
              upsertedQuestions,
            );
            setQuestions(uniqueQuestions);
            resolve();
          },
          onError: async (error) => {
            console.error("Error updating questions:", error);
            reject(error);
          },
        },
      );
    });
  };

  const formQuestionsMutation = api.form.upsertQuestions.useMutation({
    // onError: (error) => {
    //   const errorData = JSON.parse(error.message);
    //   // setCustomError(errorData);
    // },
    // onSuccess: (upsertedQuestions: Question[]) => {},
  });

  const handleClone = (questionId: string) => {
    const filteredQuestion: Question = questions.filter(
      (q) => q.id === questionId,
    )[0];

    filteredQuestion.id = null;
    setEditingQuestion(filteredQuestion);
  };

  const handleAdd = (questionId: string) => {
    const newQuestion: Question = {};
    setEditingQuestion(newQuestion);
  };

  const handleDelete = (questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId),
    );
  };

  const handleEdit = (questionId: string) => {
    const filteredQuestion: Question = questions.filter(
      (q) => q.id === questionId,
    )[0];

    setEditingQuestion(filteredQuestion);
  };

  return (
    <>
      {!questions && <Loading></Loading>}
      <VoiceToJson
        onJson={async (questions) => {
          await onQuestions(voiceForm.id, questions);
        }}
      ></VoiceToJson>
      {questions && (
        <div className="mt-4  rounded-lg border-2 border-gray-700 p-4 shadow-lg">
          <h2 className="mb-4 text-lg font-bold">
            Questions{" "}
            <Button onClick={handleAdd}>
              <AddIcon /> Add
            </Button>
          </h2>

          <ul className="space-y-4">
            {questions?.map((question) => (
              <QuestionView
                key={question.id}
                question={question}
                languages={languages}
                onEdit={handleEdit}
                onClone={handleClone}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <QuestionNew
            voiceForm={voiceForm}
            initQuestion={editingQuestion}
            onSubmit={async (question) => {
              // Handle question submission
              return await onQuestions(voiceForm.id, [question]);
            }}
            isLoading={formQuestionsMutation.isLoading}
            open={!!editingQuestion}
            onClose={() => setEditingQuestion(null)}
          />
        </div>
      )}
    </>
  );
};

export default QuestionList;

type UniqueById<T extends { id: string }> = (
  existingItems: T[],
  newItems: T[],
) => T[];

const mergeUniqueById: UniqueById<Question> = (
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
