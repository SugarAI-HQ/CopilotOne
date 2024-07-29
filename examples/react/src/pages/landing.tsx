import dynamic from "next/dynamic";
import "../app/globals.css";

import {
  FormConfigDefaults,
  Translations,
  geti18nMessage,
  Streamingi18nText,
  Streamingi18nTextRef,
  MessageWorkflow,
  LanguageProvider,
  WorkflowProvider,
} from "@sugar-ai/core";
import { NextPage } from "next";
import { useRef, useState } from "react";
import { useEffect } from "react";

export const translations: Translations = {
  welcome: {
    en: "Welcome to Sugar AI, Click Start",
    hi: "हेल्थफिक्स में आपका स्वागत है। अपॉइंटमेंट बुक करने के लिए प्रश्नों का उत्तर दें।",
  },

  pitch: {
    en: "Sugar AI Help business to engage & talk with their customers on Websites / Apps on Voice and help understand what they are looking for in 30+ Languages",
    hi: "विवरण के लिए धन्यवाद। आपका अपॉइंटमेंट बुक कर लिया गया है, आपको एसएमएस पर विवरण मिलेगा।",
  },
  howItWorks: {
    en: `Sugar AI Gert integrated on your existing website in few lines of code.

    Start Conversation on voice when user is stuck or existing or seeking help.
    Answer FAQs
    Voice Forms to do NPS Survey/leadgen on site/app or dedicated link via email/sms
    Intent Analytics from Business/Marketing/Product Teams to understand what users was looking for
    `,
    hi: "विवरण के लिए धन्यवाद। आपका अपॉइंटमेंट बुक कर लिया गया है, आपको एसएमएस पर विवरण मिलेगा।",
  },
};

const welcomeMessage = geti18nMessage("welcome", translations);
// const postSubmissionMessage = geti18nMessage("postSubmission", translations);

const Landing: NextPage = () => {
  const formConfig = FormConfigDefaults;
  const welcomeMessageRef = useRef<Streamingi18nTextRef>(null);
  // const [workflow, setWorkflow] = useState<MessageWorkflow | null>(null);
  const [showStart, setShowStart] = useState<boolean>(true);

  const start = async () => {
    const workflow = new MessageWorkflow();
    // setWorkflow(x);

    // workflow.addMessage(welcomeMessageRef);
    // workflow.addMessage(requestMicPermissionsRef);

    // await workflow.run();
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <>
      <LanguageProvider
        defaultLang={"en-US"}
        defaultVoiceLang={"auto"}
        defaultTranslations={translations}
      >
        {showStart && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl md:text-4xl lg:text-5xl p-2 m-4 text-center text-gray-800">
              Experience Lead Generation with Our Multilingual Voice Form
            </h1>
            <button
              className="w-full max-w-xs md:max-w-md lg:max-w-lg m-4 p-4 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => {
                setShowStart(false);
              }}
            >
              Book Appointment
            </button>
          </div>
        )}
        {!showStart && (
          <WorkflowProvider defaultWorklfow={null}>
            <Streamingi18nText messageKey={"welcome"} />
            <Streamingi18nText messageKey="pitch" />
            <Streamingi18nText messageKey="howItWorks" />
          </WorkflowProvider>
        )}
      </LanguageProvider>
    </>
  );
};

// export default Landing;

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(Landing), {
  ssr: false,
});
