import { createRoot } from "react-dom/client";
import { addAssistant, removeAssistant, App } from "./assistants";

import { register, unregister } from "@sugar-ai/core";

(function (win) {
  var sai = (win.sai = win.sai || {
    register: register,
    unregister: unregister,
    actions: [],
    actionCallbacks: [],
    assistants: [],
    renderedAssistants: new Set(),
    addAssistant: function (containerId, assistant, assistantConfig) {
      addAssistant(containerId, assistant, assistantConfig, sai.assistants);
      this.renderAssistant(containerId);
    },
    removeAssistant: removeAssistant,
    App: App,
    config: null,
    setConfig: function (config) {
      this.config = config;
    },
    init: function init() {
      if (typeof win.saiData !== "undefined") {
        win.saiData = win.saiData || [];
        win.saiData.forEach(this.processArgument);
        win.saiData.push = this.processArgument;
      }
      this.renderAllAssistants();
    },
    processArgument: function processArgument(args) {
      const [fn, ...argsValue] = args;
      if (fn === "register" || fn === "unregister") {
        sai[fn](...argsValue, sai.actions, sai.actionCallbacks);
      } else if (fn === "addAssistant" || fn === "removeAssistant") {
        sai[fn](...argsValue, sai.assistants);
      } else {
        sai[fn](...argsValue);
      }
    },
    renderAllAssistants: function renderAllAssistants() {
      this.assistants.forEach((assistant) => {
        this.renderAssistant(assistant.containerId);
      });
    },
    // renderAssistant: renderAssistant,
    renderAssistant: function renderAssistant(containerId) {
      if (this.renderedAssistants.has(containerId)) {
        PROD: console.log(
          `Assistant for container '${containerId}' already rendered.`,
        );
        return;
      }

      const el = document.getElementById(containerId);
      if (!el) {
        PROD: console.error(`Element with id '${containerId}' not found`);
        return;
      }

      const assistant = sai.assistants.find(
        (assistant) => assistant.containerId === containerId,
      );
      if (assistant) {
        const root = createRoot(el);
        root.render(
          this.App(assistant, sai.config, sai.actions, sai.actionCallbacks),
        );
        this.renderedAssistants.add(containerId);
      }
    },
  });

  sai.init();
})(window);
