import React, { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormInput, Form, I18nMessageWithRules } from "~/validators/form";

import Loading from "~/components/Layouts/loading";
import { VoiceEditTabs } from "~/components/voice_forms/create/tabs";
import { FormLanguagesSelector } from "~/components/voice_forms/create/language_selector";
import { NextPageWithLayout } from "~/pages/_app";
import { FormDetails } from "~/components/voice_forms/create/settings";
import { FormErrors } from "~/components/voice_forms/create/errors";
import CreateI18nMessage from "~/components/voice_forms/create_i18n_message";
import { DraggableList } from "~/components/voice_forms/questions/drag";
import { Drag2 } from "~/components/voice_forms/questions/drag2";
import { Question } from "@sugar-ai/core";
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
