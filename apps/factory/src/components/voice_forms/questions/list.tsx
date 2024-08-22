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
import { mergeUniqueById } from "~/utils/array";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { debounce } from "lodash";

interface QuestionListProps {
  voiceForm: VoiceForm;
  languages: LanguageCode[];
}

const QuestionList: React.FC<QuestionListProps> = ({
  voiceForm,
  languages,
}) => {
  const initQuestions = voiceForm?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(initQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("voiceForm", voiceForm);
    console.log("questions", questions);
  }, [voiceForm]);

  const onQuestions = async (
    formId: string,
    toBeUpsertedQuestions: Question[],
  ): Promise<void> => {
    const orderStart = questions.length;

    // Ensure each question has an order set
    const questionsWithOrder = toBeUpsertedQuestions.map((q, index) => {
      if (q.order == null || q.order === undefined || q.order == 0) {
        return { ...q, order: orderStart + index + 1 };
      }
      return q;
    });

    debugger;

    return new Promise<void>((resolve, reject) => {
      formQuestionsMutation.mutate(
        { formId, questions: questionsWithOrder },
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

  const formQuestionsMutation = api.form.upsertQuestions.useMutation({});

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    // Identify only the questions whose index has effectively changed
    const changedQuestions = reorderedQuestions
      .map((q, index) => {
        if (q.order !== index + 1) {
          return { id: q.id, order: index + 1 }; // Return only if the order has changed
        }
        return null;
      })
      .filter(Boolean); // Remove nulls from the array

    // If there are no changes, don't call the update function
    if (changedQuestions.length === 0) return;

    // Update the state with the reordered questions
    setQuestions(
      reorderedQuestions.map((q, index) => ({ ...q, order: index + 1 })),
    );

    // Update the order in the backend for only the changed questions
    debouncedUpdateQuestionOrder(changedQuestions);
  };

  const questionOrderMutation = api.form.updateQuestionOrder.useMutation({
    onSuccess: (data: any) => {
      setIsLoading(false);
      toast.success("Question order updated successfully");
    },
    onError: (error) => {
      console.error("Error updating question order:", error);
      toast.error("Error updating question order");
    },
  });

  const updateQuestionOrder = (toBeUpdatedQuestionsOrder: any) => {
    questionOrderMutation.mutate({
      formId: voiceForm.id,
      orderedQuestions: toBeUpdatedQuestionsOrder,
    });
  };

  const debouncedUpdateQuestionOrder = debounce(updateQuestionOrder, 2000);

  return (
    <>
      {isLoading && <Loading></Loading>}
      <VoiceToJson
        onJson={async (questions) => {
          await onQuestions(voiceForm.id, questions);
        }}
      ></VoiceToJson>
      {questions && (
        <div className="mt-4 rounded-lg border-2 border-gray-700 p-4 shadow-lg">
          <h2 className="mb-4 text-lg font-bold">
            Questions{" "}
            <Button onClick={handleAdd}>
              <AddIcon /> Add
            </Button>
          </h2>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {questions?.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <QuestionView
                            question={question}
                            languages={languages}
                            onEdit={handleEdit}
                            onClone={handleClone}
                            onDelete={handleDelete}
                            dragHandleProps={provided.dragHandleProps} // Pass dragHandleProps here
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

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
