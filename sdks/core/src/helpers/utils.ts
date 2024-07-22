// export const generateTool = (func) => {
//   return {
//     type: "function",
//     function: {
//       name: func.name,
//       description: "Description of the function",
//       parameters: generateParameters(func),
//     },
//   };
// };

// const generateParameters = (func) => {
//   // Extracting function parameters using toString() and regex
//   const funcString = func.toString();
//   const paramString = funcString.slice(
//     funcString.indexOf("(") + 1,
//     funcString.indexOf(")"),
//   );

//   // Split parameters by comma and trim whitespace
//   const params = paramString.split(",").map((param) => param.trim());

//   // Generating parameter object for JSON
//   const parameterObject = {
//     type: "object",
//     properties: {},
//     required: [],
//   };

//   // Constructing parameter object
//   params.forEach((param) => {
//     parameterObject.properties[param] = {
//       type: "string", // Assuming all parameters are of type string
//       description: `Description of ${param}`, // You can customize this description as needed
//     };
//     parameterObject.required.push(param);
//   });

//   return parameterObject;
// };

// setTimseout(async () => {
//   const pt = "hi/actions/todo-action/0.0.5";
//   const pv = {};
//   const todos = [
//     { id: 1, text: "Grociers Shopping" },
//     { id: 2, text: "Finish homework" },
//     { id: 3, text: "Call Parents 1" },
//   ];

//   const scope: EmbeddingScopeType = {
//     projectId: "app-todo",
//     scope1: "page-list",
//     scope2: "component-main",
//     clientUserId: "user-123",
//     identifier: "todo123",
//   };
//   // fake data
//   // await textToAction(pt, pv, "Grociers Shopping", scope, true);
//   // await textToAction(pt, pv, "Finish homework", scope, true);
//   // await textToAction(pt, pv, "Call Parents", scope, true);

//   // Real call
//   // await textToAction(pt, pv, "grocieries shopping is done", scope, false);

//   // await createEmbedding(todos, scope);

//   // const xx = await createEmbedding("pid-123", todos, "todo123");
//   // const xx = await getEmbedding("grocery shopping", scope);
// }, 1000);

export function generateUserId(
  clientUserId: string | null,
  namespace: string = "sai",
) {
  const ls = typeof localStorage !== "undefined" ? localStorage : null;
  const storageKey = `${namespace}_userId`;

  if (!ls) {
    return "FAKE-USER-XXXXXXXX";
  }

  if (
    clientUserId !== undefined &&
    clientUserId !== null &&
    clientUserId !== ""
  ) {
    // If clientUserId is provided, use it and store it in localStorage
    ls.setItem(storageKey, clientUserId);
  }

  let userId: string | null = ls.getItem(storageKey);

  if (userId === undefined || userId === null || userId === "") {
    // if (userId) {
    // If userId is not present in localStorage, generate a new one
    userId = `anon-${generateRandomString(31)}`; // Generate a random alphanumeric string with namespace
    PROD: console.log(`generated clientUserId : ${userId}`);
    ls.setItem(storageKey, userId); // Store userId in localStorage
  }

  return userId;
}

// Function to generate a random alphanumeric string of specified length
function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function isObjectEmpty(obj: any): boolean {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.length === 0;
    } else if (typeof obj === "object") {
      return Object.keys(obj).length === 0;
    }
  }
  // For non-object types like string, number, etc.
  return false;
}

export function extractFunctionParams(name: string, funcString: string) {
  // const dualRegex =
  //   /^((?:function)\s?(?:\w+)?(\(?[^(]+\)?)\s?(?:{))|((\(?[^()]+\)?)\s?=>)/;

  // Check if the function uses arrow function syntax
  // const isArrowFunction = funcString.includes("=>");

  let matchStr = "";
  const isFunc = /^function\b/.test(funcString);
  const funcRegex = /^(?:function)\s?(?:\w+)?(\(?[^(]+\)?)\s?(?:{)/;
  const ArrowRegex = /(\(?[^()]+\)?)\s?=>/;

  const match = funcString.match(isFunc ? funcRegex : ArrowRegex);
  // console.log(match);
  if (match?.[1]) {
    matchStr = match[1];
  }

  const params = matchStr
    .trim()
    .replace("(", "")
    .replace("=>", "")
    .replace(")", "")
    .split(",")
    .map((param) => param.trim())
    .filter((param) => param !== "");

  PROD: console.log(
    `[${name}] Matching string ${matchStr} | ${JSON.stringify(params)}`,
  );

  return params;
  // Return an empty array if no parameters found
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
