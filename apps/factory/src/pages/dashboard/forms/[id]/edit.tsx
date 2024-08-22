import React, { useState } from "react";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import { VoiceEditTabs } from "~/components/voice_forms/create/tabs";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [voiceForm, setVoiceForm] = useState<Form>();
  // const [questions, setQuestions] = useState<Question[]>([]);

  const loadForm = (form: Form) => {
    setVoiceForm(form);
    // setValue("id", form.id);
    // setValue("name", form.name);
    // setValue("description", form.description);
    // setValue("startButtonText", form.startButtonText);
    // setValue("languages", form.languages);
    // setValue("messages", form.messages);
    // setValue("formConfig", form.formConfig || {});
  };

  const { data: form, isLoading: isFormLoading } = api.form.getForm.useQuery(
    { id: formId },
    {
      enabled: !!formId,
      onSuccess(form: Form) {
        setVoiceForm(form);
        loadForm(form);
      },
    },
  );

  return (
    <div className="w-full p-4">
      <VoiceEditTabs
        voiceForm={voiceForm}
        // questions={voiceForm?.questions}
        setVoiceForm={setVoiceForm}
        // handleAddOrEditQuestion={handleAddOrEditQuestion}
        // handleEdit={handleEdit}
        // handleDelete={handleDelete}
      />
    </div>
  );
};

FormEdit.getLayout = getLayout;
export default FormEdit;
