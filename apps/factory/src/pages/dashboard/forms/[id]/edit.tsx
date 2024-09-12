import React, { useState } from "react";
import { useRouter } from "next/router";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { VoiceEditTabs } from "~/components/voice_forms/create/tabs";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { Form } from "~/validators/form";
import Head from "next/head";
import Loading from "~/components/Layouts/loading";

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [voiceForm, setVoiceForm] = useState<Form>();
  // const [questions, setQuestions] = useState<Question[]>([]);

  const loadForm = (form: Form) => {
    setVoiceForm(form);
  };

  const { data: form, isLoading } = api.form.getForm.useQuery(
    { formId: formId },
    {
      enabled: !!formId,
      onSuccess(updatedForm: Form) {
        setVoiceForm(updatedForm);
        loadForm(updatedForm);
      },
    },
  );

  return (
    <div className="w-full p-4">
      <Head>
        <title>Edit {voiceForm?.name} - Voice Form</title>
      </Head>
      {isLoading && <Loading />}
      {!isLoading && (
        <VoiceEditTabs
          voiceForm={voiceForm}
          // questions={voiceForm?.questions}
          setVoiceForm={setVoiceForm}
          // handleAddOrEditQuestion={handleAddOrEditQuestion}
          // handleEdit={handleEdit}
          // handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

FormEdit.getLayout = getLayout;
export default FormEdit;
