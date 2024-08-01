import "../app/globals.css";
import Todo from "./todo";

const Home = () => {
  return (
    <div className="bg-white py-18 sm:py-16">
      <div className="mx-auto max-w-7xl m-4 pt-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold leading-7 text-gray-600 pb-4">
            Sugar AI Demos
          </h1>
        </div>
      </div>

      {/* Multilingual Voice Forms */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 sm:mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
            Multilingual Voice Forms
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-8 lg:mt-12 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen?lang=en-US"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Leadgen in{" "}
                  <span className="text-indigo-600">English (en)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Capture leads by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen?lang=hi"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Leadgen in <span className="text-indigo-600">Hindi (hi)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Capture leads by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen/nps?lang=en-US"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  NPS in <span className="text-indigo-600">English (en)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Evaluate NPS by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen/nps?lang=hi"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  NPS in <span className="text-indigo-600">Hindi (hi)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Evaluate NPS by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen/csat?lang=en-US"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  CSAT in <span className="text-indigo-600">English (en)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Evaluate CSAT by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen/csat?lang=hi"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  CSAT in <span className="text-indigo-600">Hindi (hi)</span>
                </div>
                <p className="text-gray-700 text-base">
                  Evaluate CSAT by just talking with user in their native
                  language for high engagement and capturing more information
                  effortlessly
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice_forms/leadgen-embed"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Voice Ad on a page in{" "}
                  <span className="text-indigo-600">en</span>
                  {", "}
                  <span className="text-indigo-600">hi</span>
                </div>
                <p className="text-gray-700 text-base">
                  Initiate a conversation with the user through a voice nudge
                  and determine if they qualify as a lead.
                </p>
              </div>
            </a>
          </dl>
        </div>
      </div>

      {/* Voice assistants */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 sm:mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
            Voice Assistant Examples
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl sm:mt-8 lg:mt-12 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=en-US&assistant=voice"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-US</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=hi-IN&assistant=voice"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">hi-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App In Hindi Language
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=en-IN&assistant=voice"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/voice-vanilla-js.html"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Vanilla JS <span className="text-indigo-600">hi-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
          </dl>
        </div>
      </div>

      {/* Text assistants */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 sm:mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
            Text Assistant Examples
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-8 lg:mt-12 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=en-US&assistant=audio"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-US</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=hi-IN&assistant=text"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">hi-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App In Hindi Language
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/todo?lang=en-IN&assistant=text"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              href="/text-vanilla-js.html"
            >
              <div className="px-6 py-4">
                <div className="text-gray-700 font-bold text-xl mb-2">
                  Vanilla JS <span className="text-indigo-600">hi-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Home;
