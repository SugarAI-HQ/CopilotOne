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

Check out Travel Product built using this sdk: https://youtu.be/t2e0CThWZUE

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/t2e0CThWZUE/0.jpg)](https://www.youtube.com/watch?v=t2e0CThWZUE)


# Get Started

## Prerequisites

Before using this package, ensure you have the following:

- An existing React application

- Create copilot credentials from  [Sugar AI](https://play.sugarcaneai.dev) or [Self Hosted](https://github.com/SugarAI-HQ/CopilotOne/tree/develop/apps/factory) Account



## Install
You can install the `@sugar-ai/copilot-one-js` package via npm in your react project

### Installation
````bash
npm install @sugar-ai/copilot-one-js
````

### Add to your React App

In your main file. src/App.tsx 
```js
import { useCopilot, CopilotConfigType, CopilotProvider, VoiceToSkillComponent } from '@sugar-ai/copilot-one-js';


const copilotConfig: CopilotConfigType = {
  copilotId: '<copilotId>',
  server: {
    endpoint: 'http://sugarai.dev:3000/api',
    token: '<token>',
  },

  ai: {
    defaultPromptTemmplate: 'hi/skills/todo-skill/0.0.5',
    defaultPromptVariables: {
      $ROLE: 'Boss',
    },
    successResponse: 'Task is completed',
    failureResponse: 'I am not able to do this',
  },
}
```

We are taking a exmple of a todo App. To track User's Current Screen Context using `useStateCopilot`

```js

const TodoApp = () => {

const { useStateCopilot, registerSkill, unregisterSkill } = useCopilot(); // Add

// const [todos, setTodos] = useState([]); 
const [todos, setTodos] = useStateCopilot([], 'todoApp', 'todos'); // Switch

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
  registerSkill(
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