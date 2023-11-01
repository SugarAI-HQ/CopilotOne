import React, { useState } from "react";
import Header from "~/components/marketplace/header";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { promptEnvironment } from "~/validators/base";
import PromptTemplateView from "~/components/prompt_template_view";

const TemplateWithVersion = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const packageName = router.query.packageName as string;
  const template = router.query.template as string;
  const versionOrEnvironment = router.query.versionOrEnvironment as string;

  return (
    <>
      <PromptTemplateView
        username={username}
        packageName={packageName}
        template={template}
        versionOrEnvironment={versionOrEnvironment}
      />
    </>
  );
};

export default TemplateWithVersion;
