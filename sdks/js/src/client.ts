// // @ts-nocheck
// import { EmbeddingScopeType } from "./schema";
// // import { useAPIClient } from "./react/CopilotContext";

// export const scope: EmbeddingScopeType = {
//   projectId: "app-todo",
//   scope1: "page-list",
//   scope2: "component-main",
//   clientUserId: "user-123",
//   identifier: "todo123",
// };

// const SUGARAI_FACTORY_ENDPOINT = "http://localhost:3000/api";
// const SUGARAI_API_TOKEN =
//   "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..t65RlruQb69Vpxvh.uV5CKS5m1tybPsjW3UvftVeHOalHf3OrViFEi8VP6N4XlKmRHvBr6KNsc3HmwWT173WseTLVDOBE-vJWpjLjwvwrw42jh737U2ujpaFSxM0VOdq0mwtMtVSZEPsdEqWg5wqymvk_lR_S_3TBorWi2w0R3u499L-1ELkZJ0JGS8l5sVciJ-qtlFb9Cpi1Fx1mi8w_VYTzVdeb31zeKd4PpO4dn49HD4itIXSSUj_U_E2WTt3TycJWpf25O1sSUlecS0Xdhvhyflu28UKi-_ap_cHs6KU4m7dye-UV-I3bLuyDBlmKbbrMd2BTAMsYlxNCA5-fldkanWBwo8E.e_to0BlTudpC8zFg0FrE8A";

// const headers = {
//   // Authorization: `Bearer ${SUGARAI_API_TOKEN}`,
// };

// // console.log(`api client ${JSON.stringify(copilotConfig)}`);

// export async function makeInference(
//   prompt_template: string,
//   variables = {},
//   userQuery: string,
//   actions,
//   scope: EmbeddingScopeType,
//   dryRun = false,
// ) {
//   const messages = [{ role: "user", content: userQuery }];
//   const API_URL: string = `${SUGARAI_FACTORY_ENDPOINT}/${prompt_template}/generate`;

//   let response = null;
//   let result = null;

//   if (dryRun) {
//     response = { status: 200 };
//     result = JSON.parse(
//       '{"id":"354cad0b-6389-4452-93d0-7639af233ddd","environment":"DEV","version":"0.0.1","prompt":"[{\\"id\\":\\"a6a6fdbf-6311-42cb-9f95-5ef8d7066141\\",\\"role\\":\\"system\\",\\"content\\":\\"You are Personal assistant bot, who will mediate conversation between your boss and other multiple agents. Rest of the agents will be invisible to the Boss.\\\\n\\\\nYou first take instruction from the boss, then explain it to agents based on their expertise\\\\nand upon agent reply generate a relative reply for the boss. \\\\nYou wait to collect the response from multiple agents as needed and ,then generate response for the boss.\\\\n\\\\nawd\\"}]","completion":null,"latency":1624,"prompt_tokens":193,"completion_tokens":14,"llmResponse":{"data":{"t":1,"v":2,"completion":[{"text":null,"index":0,"message":{"role":"assistant","content":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"' +
//         userQuery +
//         '\\"\\n}"}}]},"logprobs":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"123\\"\\n}"}}],"finish_reason":"stop"}]},"error":null},"total_tokens":207,"labelledState":"UNLABELLED","llmProvider":"openai","llmModel":"gpt-4","llmModelType":"TEXT2TEXT","createdAt":"2024-03-26T12:07:25.791Z","updatedAt":"2024-03-26T12:07:25.791Z"}',
//     );
//   } else {
//     // const client = useAPIClient();
//     const prompt = prompt_template.split("/");
//     const aiResponse = await client.prompts.serviceGenerate(...prompt, {
//       variables: variables,
//       scope: scope,
//       messages: messages,
//       // messages: messages.slice(-3),
//       actions: Object.values(actions),
//     });

//     // response = await fetch(API_URL, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     ...headers,
//     //   },
//     //   body: JSON.stringify({
//     //     variables: variables,
//     //     scope: scope,
//     //     messages: messages,
//     //     // messages: messages.slice(-3),
//     //     actions: Object.values(actions),
//     //   }),
//     // });

//     result = await response.json();
//   }

//   if (response.status == 200 && result.llmResponse.data) {
//     return result.llmResponse.data;
//   }

//   return null;
// }

// export async function createEmbedding(
//   client,
//   payload = {},
//   scope: EmbeddingScopeType,
//   dryRun = false,
// ) {
//   const API_URL: string = `${SUGARAI_FACTORY_ENDPOINT}/embeddings`;

//   let response = null;
//   let result = null;

//   if (dryRun) {
//     response = { status: 200 };
//     // result = JSON.parse(
//     //   '{"id":"354cad0b-6389-4452-93d0-7639af233ddd","environment":"DEV","version":"0.0.1","prompt":"[{\\"id\\":\\"a6a6fdbf-6311-42cb-9f95-5ef8d7066141\\",\\"role\\":\\"system\\",\\"content\\":\\"You are Personal assistant bot, who will mediate conversation between your boss and other multiple agents. Rest of the agents will be invisible to the Boss.\\\\n\\\\nYou first take instruction from the boss, then explain it to agents based on their expertise\\\\nand upon agent reply generate a relative reply for the boss. \\\\nYou wait to collect the response from multiple agents as needed and ,then generate response for the boss.\\\\n\\\\nawd\\"}]","completion":null,"latency":1624,"prompt_tokens":193,"completion_tokens":14,"llmResponse":{"data":{"t":1,"v":2,"completion":[{"text":null,"index":0,"message":{"role":"assistant","content":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"' +
//     //     userQuery +
//     //     '\\"\\n}"}}]},"logprobs":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"123\\"\\n}"}}],"finish_reason":"stop"}]},"error":null},"total_tokens":207,"labelledState":"UNLABELLED","llmProvider":"openai","llmModel":"gpt-4","llmModelType":"TEXT2TEXT","createdAt":"2024-03-26T12:07:25.791Z","updatedAt":"2024-03-26T12:07:25.791Z"}'
//     // );
//   } else {
//     respnse = await client.embedding.createorupdate({
//       scope: scope,
//       payload: payload,
//       strategy: "auto",
//     });
//     // response = await fetch(API_URL, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     ...headers,
//     //   },
//     //   body: JSON.stringify({
//     //     scope: scope,
//     //     payload: payload,
//     //     strategy: "auto",
//     //   }),
//     // });
//     result = await response.json();
//   }
//   return null;
// }

// export async function getEmbedding(
//   userQuery: string,
//   scope: EmbeddingScopeType,
//   dryRun = false,
// ) {
//   const API_URL: string = `${SUGARAI_FACTORY_ENDPOINT}/embeddings/lookup`;

//   let response = null;
//   let result = null;

//   if (dryRun) {
//     response = { status: 200 };
//     // result = JSON.parse(
//     //   '{"id":"354cad0b-6389-4452-93d0-7639af233ddd","environment":"DEV","version":"0.0.1","prompt":"[{\\"id\\":\\"a6a6fdbf-6311-42cb-9f95-5ef8d7066141\\",\\"role\\":\\"system\\",\\"content\\":\\"You are Personal assistant bot, who will mediate conversation between your boss and other multiple agents. Rest of the agents will be invisible to the Boss.\\\\n\\\\nYou first take instruction from the boss, then explain it to agents based on their expertise\\\\nand upon agent reply generate a relative reply for the boss. \\\\nYou wait to collect the response from multiple agents as needed and ,then generate response for the boss.\\\\n\\\\nawd\\"}]","completion":null,"latency":1624,"prompt_tokens":193,"completion_tokens":14,"llmResponse":{"data":{"t":1,"v":2,"completion":[{"text":null,"index":0,"message":{"role":"assistant","content":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"' +
//     //     userQuery +
//     //     '\\"\\n}"}}]},"logprobs":null,"tool_calls":[{"id":"call_5dCvRtXEujyT6TERdeNNVls8","type":"function","function":{"name":"addTodo","arguments":"{\\n\\"task\\": \\"123\\"\\n}"}}],"finish_reason":"stop"}]},"error":null},"total_tokens":207,"labelledState":"UNLABELLED","llmProvider":"openai","llmModel":"gpt-4","llmModelType":"TEXT2TEXT","createdAt":"2024-03-26T12:07:25.791Z","updatedAt":"2024-03-26T12:07:25.791Z"}'
//     // );
//   } else {
//     response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: JSON.stringify({
//         scope: scope,
//         userQuery: userQuery,
//       }),
//     });

//     result = await response.json();
//   }
//   return null;
// }
