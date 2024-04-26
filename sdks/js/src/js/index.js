import { createElement } from "react";
import { createRoot } from "react-dom/client";
import {
  register,
  unregister,
  CopilotProvider,
  VoiceAssistant,
} from "../index";

(function (win) {
  win.sai = win.sai || {
    register: register,
    unregister: unregister,
    actions: [],
    actionCallbacks: [],
    config: function (config) {
      this.config = config;
    },
    App: function App() {
      return createElement(
        CopilotProvider,
        {
          config: win.sai.config,
        },
        createElement(VoiceAssistant, {
          actionsFn: function () {
            return win.sai.actions;
          },
          actionCallbacksFn: function () {
            return win.sai.actionCallbacks;
          },
        }),
      );
    },
    render: function render() {
      const el = document.getElementById("copilot-one");
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
      const root = createRoot(el);
      root.render(this.App());
    },
    init: function init() {
      win.saiData.forEach(this.processArgument);
      win.saiData.push = this.processArgument;
      this.render();
    },
    processArgument: function processArgument(args) {
      const fn = args[0];
      const argsValue = Array.prototype.slice.call(args, 1);
      if (fn === "register" || fn === "unregister") {
        win.sai[fn](...argsValue, win.sai.actions, win.sai.actionCallbacks);
      } else {
        win.sai[fn](...argsValue);
      }
    },
  };

  win.sai.init();
})(window);
