# Copilot One

Supercharge your existing Web/React App with a Siri-like AI Assistant.

## Key Features

- **Voice To Action**: Perform actions based on voice input.
- **Text To Action**: Perform actions based on text input.
- **Current Screen Context**: Auto generate embedding of current screen seend by user and create embeddings which is avaiable for RAG during LLM inferences. This make AI aware of current screen of the user and helps generate better responses.
- **Text API Interface**: Transform existing APIs without any coding to support a natural language interface for both requests and responses. This simplies API invoication using voice and also integration in other copilot one powered Assistants.

## Supported Voice-enabled UX Agents

1. **UI Agent**: Enables hands-free capability to perform existing UI tasks and workflows.
2. **Navigation Agent**: Assists users in navigating to the right page, section, or settings.
3. **Form Agent**: Assist in filling form by autofilling based on voice or file input, advance validations, multilingual support. Simpler forms can be completely replaced by Voice to API Action.

These agents focuses on reducing learning curve for user and enalbes handsfree expereince for content discovery, feature discovery, user onboarding and form filling.


## Demo Video

[![Copilot One Demo Video](https://img.youtube.com/vi/gYynr1xRLeU/0.jpg)](https://www.youtube.com/watch?v=gYynr1xRLeU)



## What future of AI Assistants looks Like ?
Goal is to create an open protocol for AI Assistants, Agents & Actions. Checkout Future of AI Assistants using this sdk.

[![Future of AI Assistants with Copilot One](https://img.youtube.com/vi/t2e0CThWZUE/0.jpg)](https://www.youtube.com/watch?v=t2e0CThWZUE)



# Get Started

For details instructions. Read [docs](https://docs.sugarai.dev)


## Prerequisites

Before using this package, ensure you have the following:

- An existing React application

- Create copilot credentials from [Sugar AI](https://play.sugarcaneai.dev) or [Self Hosted](https://github.com/SugarAI-HQ/CopilotOne/tree/develop/apps/factory) Account


## Install

You can install the `@sugar-ai/copilot-one-js` package via npm in your react project

### Install Package

```bash
npm install @sugar-ai/copilot-one-js@latest
```

### Add to your React App

In your main file. src/App.tsx

```js
import { useCopilot, CopilotConfigType, CopilotProvider, VoiceAssistant } from '@sugar-ai/copilot-one-js';


const copilotConfig: CopilotConfigType = {
  copilotId: '<copilotId>',
  server: {
    endpoint: 'http://play.sugarcaneai.dev/api',
    token: '<token>',
  },

  ai: {
    defaultPromptTemplate: '<prompt template>',
    defaultPromptVariables: {
      $AGENT_NAME: 'Sugar',
    },
    successResponse: 'Task is completed',
    failureResponse: 'I am not able to do this'
  },
}

// Wrap the App with Copilot Provider

    <CopilotProvider config={copilotConfig}>
      <TodoApp />
    </CopilotProvider>
```

We are taking a exmple of a todo App. To track User's Current Screen Context using `useStateEmbedding`

```js

const TodoApp = () => {

const { useStateEmbedding, registerAction, unregisterAction } = useCopilot(); // Add

// const [todos, setTodos] = useState([]);
const [todos, setTodos] = useStateEmbedding([], 'todoApp', 'todos'); // Switch

...

}

```

Register functions for create, delete and mark as done.

```js
const TodoApp = () => {

  ...

  // Functionalies
  const addTodo = (task) => {...}};
  const deleteTodo = (task) => {...};
  const markTodoAsDoneById = function (todoId: number) {...};

  // Register addTodo function
  registerAction(
    'addTodo',
    {
      name: 'addTodo',
      description: 'Add a new todo',
      parameters: [
        {
          name: 'task',
          type: 'string',
          description: 'Task description',
          required: true,
        }
      ],
    },
    addTodo,
  );

...

}

```

# Roadmap

- [x] Web SDK Released

  - [x] Voice To Action
  - [x] Text To Action
  - [x] Current Screen Context

- POC

  - [x] Text API Interface

- [] Navigation Agent
- [] Form Agent
