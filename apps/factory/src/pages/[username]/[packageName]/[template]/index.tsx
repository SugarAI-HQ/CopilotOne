import React from "react";
import { useRouter } from "next/router";
import PromptTemplateView from "~/components/prompt_template_view";
import { promptEnvironment } from "~/validators/base";

const TemplateWithoutVersion = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const packageName = router.query.packageName as string;
  const template = router.query.template as string;

  return (
    <>
      <PromptTemplateView
        username={username}
        packageName={packageName}
        template={template}
        versionOrEnvironment={promptEnvironment.Enum.RELEASE}
      />
    </>
  );
};

export default TemplateWithoutVersion;
