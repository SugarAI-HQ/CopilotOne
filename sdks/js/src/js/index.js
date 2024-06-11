import { createRoot } from "react-dom/client";
import { addAssistant, removeAssistant, App } from "./assistants";

import {
  register,
  unregister,
  createOrUpdateEmbedding,
  SugarAiApiClient,
  generateUserId,
} from "@sugar-ai/core";

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
    getClient: function () {
      const apiClient = new SugarAiApiClient({
        environment: this.config.server.endpoint,
        token: this.config.server.token,
      });

      return apiClient;
    },
    upsertEmbedding: function (payload, scope1, scope2) {
      const scope = {
        clientUserId: this.config.clientUserId,
        scope1: scope1,
        scope2: scope2,
        groupId: win.location?.pathname,
      };
      createOrUpdateEmbedding({
        config: this.config,
        client: this.getClient(),
        scope,
        payload,
      });
    },
    loadFaqs: function parseFAQs(selector) {
      const faqs = this.parseFAQs(selector);
      this.upsertEmbedding(faqs, win.location.host, "faqs");
    },
    parseFAQs: function parseFAQs(selector) {
      // Get the container element by the provided selector
      const container = win.document.querySelector(selector);

      // Check if the container exists
      if (!container) {
        console.error(`Container with selector ${selector} not found.`);
        return [];
      }

      // Initialize an empty array to store the FAQs
      const faqs = [];

      // Function to extract text content recursively from nested elements
      function extractText(node) {
        let text = "";
        // If the node is a text node, extract its content
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // If the node is an element node, traverse its children
          for (let childNode of node.childNodes) {
            text += extractText(childNode);
          }
        }
        return text;
      }

      // Function to check if a question-answer pair already exists
      // function isDuplicate(question, answer) {
      //   return faqs.some(
      //     (faq) => faq.question === question && faq.answer === answer,
      //   );
      // }

      // Traverse the container and extract text blobs
      container.querySelectorAll("*").forEach((element) => {
        const text = extractText(element);
        if (text.length > 0) {
          // Check if the text ends with a question mark
          if (text.endsWith("?")) {
            const question = text;
            const nextElement = element.nextElementSibling;
            if (nextElement && nextElement.textContent.trim().length > 0) {
              // Check if the next non-empty element is a valid answer
              const answer = nextElement.textContent.trim();
              if (
                !text.endsWith(".") ||
                text.endsWith("?") ||
                text.endsWith("!")
              ) {
                // If the answer doesn't end with period or is a question, append it
                faqs.push({ question, answer });
              }
            }
          }
        }
      });

      // Return the array of FAQs
      return faqs;
    },

    removeAssistant: removeAssistant,
    App: App,
    config: null,
    setConfig: function (config) {
      this.config = config;

      if (!config.clientUserId) {
        config.clientUserId = generateUserId(config?.client?.userId ?? null);
      }
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
