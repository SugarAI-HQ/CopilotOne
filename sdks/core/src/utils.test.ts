import { extractFunctionParams } from "./utils";
// Import the necessary functions
// const extractFunctionParams = require('./extractFunctionParams'); // Assuming the function is in a separate file

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

// Test cases for function to extract parameters
describe("extractFunctionParams", () => {
  it("should extract parameters for arrow function", () => {
    const params = extractFunctionParams(funcString1);
    expect(params).toEqual(["pt"]);
  });

  it("should extract parameters for arrow function with brackets", () => {
    const params = extractFunctionParams(funcString2);
    expect(params).toEqual(["todoId"]);
  });

  it("should extract parameters for regular function", () => {
    const params = extractFunctionParams(funcString3);
    expect(params).toEqual(["todoId"]);
  });
});
