import "../app/globals.css";
import Todo from "./todo";

const Home = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            SugarAI
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Copilot Examples
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg"
              href="/todo?lang=en-US"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-US</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg"
              href="/todo?lang=hi-IN"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">hi-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App In Hindi Language
                </p>
              </div>
            </a>

            <a
              className="max-w-sm rounded overflow-hidden shadow-lg"
              href="/todo?lang=en-IN"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  Todo Example in <span className="text-indigo-600">en-IN</span>
                </div>
                <p className="text-gray-700 text-base">
                  Siri like Native AI Assistants to your App in English Language
                </p>
              </div>
            </a>
            <a
              className="max-w-sm rounded overflow-hidden shadow-lg"
              href="/vanilla-js.html"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
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
