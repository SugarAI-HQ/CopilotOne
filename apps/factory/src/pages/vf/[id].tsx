import React, { Suspense } from "react";
import { prisma } from "~/server/db";
import humanizeString from "humanize-string";
import {
  LanguageCode,
  FormConfig,
  VoiceForm,
  extracti18nText,
} from "@sugar-ai/core";
import { NextSeo } from "next-seo";
import {
  CopilotProvider,
  LanguageProvider,
  WorkflowProvider,
  FormConfigDefaults,
  VoiceFormProvider,
} from "@sugar-ai/core";
import { VoiceFormComponent, Initializing } from "@sugar-ai/copilot-one-js";
import { getCopilotConfig } from "~/utils/copilot";
import { useRouter } from "next/router";
import Header from "~/components/marketplace/header";
import { NextPageWithLayout } from "../_app";
import { ErrorBoundary } from "@sentry/nextjs";
import { getAppUrl } from "~/utils/log";
import { getLayout } from "~/components/Layouts/SiteLayout";
import "@sugar-ai/copilot-one-js/style";
import { env } from "next-runtime-env";

// Component for rendering the VoiceForm page
const VoiceFormShow: NextPageWithLayout<Props> = ({ voiceForm }: Props) => {
  const router = useRouter();
  const { id, lang, show, color, record } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
    record: string;
  };

  const copilotPackage = "sugar/copilotexample/todoexample/0.0.4";
  const themeColor = color ?? "#0057FF";
  const copilotConfig = getCopilotConfig(copilotPackage, color);

  const initFormConfig: FormConfig = {
    ...FormConfigDefaults,
    ai: {
      ...FormConfigDefaults.ai,
      evaluationPromptTemplate: env("NEXT_PUBLIC_FORM_EVALUATION_PROMPT"),
    },
    listen: {
      ...FormConfigDefaults.listen,
      record: record ? true : false,
    },
    voiceButton: copilotConfig.style.voiceButton,
  };

  const origin = getAppUrl();
  const defaultLang = voiceForm?.languages[0] || "en";

  const vf = {
    title: (voiceForm?.name as string) || "Voice Forms in 30+ languages",
    description: extracti18nText(voiceForm?.description, defaultLang) as string,
    shareUrl: `${origin}/vf/${id}`,
    imageUrl: `${origin}/generated/assets/vfs/${id}/og.png`,
  };

  return (
    <ErrorBoundary>
      <NextSeo
        title={humanizeString(vf.title)}
        description={vf.description}
        openGraph={{
          url: vf.shareUrl,
          title: vf.title,
          description: vf.description,
          type: "website",
          images: [
            {
              url: vf.imageUrl,
              width: 1200,
              height: 630,
              type: "image/png",
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <div className="flex h-full w-full flex-col">
        <Header headerName="Sugar AI" />
        <CopilotProvider config={copilotConfig}>
          <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
            <WorkflowProvider>
              <VoiceFormProvider
                formId={id}
                formConfigOverride={initFormConfig}
                Loading={<Initializing />}
              >
                <Suspense fallback={<p>Loading feed...</p>}>
                  <VoiceFormComponent showStartButton={true} />
                </Suspense>
              </VoiceFormProvider>
            </WorkflowProvider>
          </LanguageProvider>
        </CopilotProvider>
      </div>
    </ErrorBoundary>
  );
};

VoiceFormShow.isPublic = true;
VoiceFormShow.getLayout = getLayout;

export default VoiceFormShow;

// Types for the Props
interface Props {
  voiceForm: VoiceForm;
}

// Fetching form data for static props
export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const formId = params?.id as string;

    // Fetch the form data using the API (Replace with actual API call)
    // const voiceForm = await api.form.getForm.fetch({ formId });
    const voiceForm = await prisma.form.findUnique({
      where: {
        id: formId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        languages: true,
      },
    });

    if (!voiceForm) {
      return {
        notFound: true, // Return 404 if no form found
      };
    }

    return {
      props: {
        voiceForm: voiceForm as VoiceForm,
      },
      revalidate: 60, // Revalidate every 60 seconds for ISR
    };
  } catch (error) {
    console.error("Failed to fetch form data:", error);
    return {
      notFound: true,
    };
  }
};

// Defining the paths for dynamic routing
export const getStaticPaths = async () => {
  try {
    const voiceForms: VoiceForm[] = [];

    const paths = voiceForms.map((vf) => ({
      params: { id: vf.id },
    }));

    return {
      paths,
      fallback: "blocking", // Use blocking fallback to generate new paths
    };
  } catch (error) {
    console.error("Failed to fetch paths:", error);
    return {
      paths: [],
      fallback: false, // Disable fallback in case of error
    };
  }
};
