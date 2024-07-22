// Define the function strings
const funcString1 = "pt=>{et($.map(yt=>yt.id==pt?{...yt,completed:!0}:yt))}";
const funcString2 =
  "(todoId) => { setTodos(todos.map((todo) => { if (todo.id == todoId) { return { ...todo, completed: true }; } return todo; })); }";
const funcString3 = `function(todoId) {
  setTodos(todos.map((todo) => {
    if (todo.id == todoId) {
      return {
        ...todo,
        completed: true
      };
    }
    return todo;
  }));
}`;

// Remove starting and ending brackets from the function string
// const trimmedFuncString = funcString.replace(/^function\s*\([^)]*\)\s*\{/i, "").replace(/\}\s*$/i, "");

// console.log(trimmedFuncString);

function extractFunctionParams(funcString) {
  const paramRegex = /\(([^)]+)\)/;
  // const arrowParamRegex = /^([^(]+)=>/;
  const arrowParamRegex = /^(?:function)?(\(?[^(]+\)?)\s?(?:{|=>)/;

  // Check if the function uses arrow function syntax
  const isArrowFunction = funcString.includes("=>");

  if (isArrowFunction) {
    // For arrow functions, extract parameters after =>
    const match = funcString.match(arrowParamRegex);
    console.log(match);
    if (match && match[1]) {
      return [match[1].trim().replace("(", "").replace(")", "")];
    }
  } else {
    // For regular functions, extract parameters within ()
    const match = funcString.match(paramRegex);
    console.log("matching 2");
    if (match && match[1]) {
      // Split parameters by commas and trim whitespace
      return match[1]
        .split(",")
        .map((param) => param.trim())
        .filter((param) => param !== "");
    }
  }

  // Return an empty array if no parameters found
  return [];
}

// Extract function parameters from both function strings
const functionParamNames1 = extractFunctionParams(funcString1);
const functionParamNames2 = extractFunctionParams(funcString2);
const functionParamNames3 = extractFunctionParams(funcString3);

// Output the results
console.log("Function 1 parameters:", functionParamNames1);
console.log("Function 2 parameters:", functionParamNames2);
console.log("Function 3 parameters:", functionParamNames3);
