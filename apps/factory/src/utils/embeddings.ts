import { prisma } from "~/server/db";
import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY, // This is the default and can be omitted
});

// // Function to create embeddings using pgvector
// async function createEmbeddings(documents: any[]): Promise<void> {
//   // Create documents in the database using Prisma
//   const documents = await prisma.document.createMany({
//     data: documents.map((doc) => ({
//       content: doc.pageContent,
//       metadata: JSON.stringify(doc.metadata),
//     })),
//   });

//   // Get document IDs
//   const documentIds = documents.map((doc) => doc.id);

//   // Call the SQL function to create embeddings using pgvector extension
//   await prisma.$executeRaw`SELECT create_embeddings(${prisma.$raw(
//     documentIds,
//   )})`;
// }

// Function to serialize JSON object to string
function jsonToString(jsonObj: any): string {
  const jsonString: string = JSON.stringify(jsonObj);
  const cleanString: string = removeJsonAttributes(jsonString);
  return cleanString;
}

function removeJsonAttributes(jsonStr: string): string {
  // Define regex pattern to match JSON-specific attributes
  const pattern: RegExp = /["{}]+/g;
  // Remove JSON-specific attributes from JSON string
  let cleanedJson: string = jsonStr.replace(pattern, "");
  // Remove extra spaces and new lines, keep one space between words
  cleanedJson = cleanedJson.replace(/\s+/g, " ");
  return cleanedJson;
}

// Function to remove URLs from JSON string
function removeUrlsFromJson(jsonStr: string): string {
  // Define regex pattern to match URLs
  const urlPattern: RegExp = /https?:\/\/(?:[-\w.]|(?:%[\da-fA-F]{2}))+/g;
  // Remove URLs from JSON string
  const cleanedJson: string = jsonStr.replace(urlPattern, "");
  return cleanedJson;
}

// Function to create documents from JSON object
export function createDocsFromJson(jsonObj: any): any[] {
  const jsonStr: string = JSON.stringify(jsonObj);
  const jsonLen: number = jsonStr.length;

  const bigArr: any[] = findBiggestArray(jsonObj);
  const bigArrStr: string = JSON.stringify(bigArr);
  const bigArrDiff: number = jsonLen - bigArrStr.length;
  const bigArrLeftoverPercent: number = bigArrDiff / jsonLen;

  console.log(
    `remaining left size ${bigArrDiff}/${jsonLen}: ${bigArrLeftoverPercent}`,
  );

  let documents: any[];
  if (bigArrLeftoverPercent < 0.04) {
    console.log("using big array");
    documents = bigArr.map(jsonToDoc);
  } else {
    console.log("using text splitter");
    documents = splitJsonToDocs(jsonObj, jsonStr);
  }

  return documents;
}

// Function to split JSON into documents
function splitJsonToDocs(jsonObj: any, jsonStr?: string): any[] {
  if (!jsonStr) {
    jsonStr = JSON.stringify(jsonObj);
  }

  const doc: any = {
    pageContent: jsonStr,
    metadata: "",
  };

  // Split the documents into chunks (Not fully implemented in TypeScript)
  // const textSplitter = new CharacterTextSplitter(',', 500, 50);
  // const documents = textSplitter.splitDocuments([doc]);
  const documents: any[] = [doc]; // Placeholder implementation
  return documents;
}

// Function to convert JSON object to document
function jsonToDoc(jsonObj: any): any {
  const text: string = jsonToString(jsonObj);
  const doc: any = {
    pageContent: text,
    metadata: jsonObj,
  };
  return doc;
}

// Function to find the biggest array in a JSON object
function findBiggestArray(jsonObj: any): any[] {
  let maxArray: any[] = [];
  let maxSize: number = 0;

  // Helper function to traverse nested JSON
  function traverse(obj: any): void {
    if (Array.isArray(obj)) {
      if (obj.length > maxSize) {
        maxArray = obj;
        maxSize = obj.length;
      }
    } else if (typeof obj === "object" && obj !== null) {
      for (const value of Object.values(obj)) {
        traverse(value);
      }
    }
  }

  // Start traversal
  traverse(jsonObj);
  return maxArray;
}

// Function to generate file path
// function generateFilePath(chatId: string, screenId: string): string {
//   return `${STORAGE_PATH}/chats/${chatId}/screens/${screenId}/`;
// }

// // Function to create embedding
// function createEmbedding(chatId: string, screenId: string, documents: any[]): boolean {
//     // Placeholder implementation, as FAISS and OpenAIEmbeddings are not fully supported in TypeScript
//     console.log(`Saved vector index to ${generateFilePath(chatId, screenId)}`);
//     return true;
// }

// // Function to find closest match
// function findClosestMatch(chatId: string, screenId: string, query: any): any[] {
//   const indexFile: string = generateFilePath(chatId, screenId);
//   // Placeholder implementation, as FAISS.load_local is not fully supported in TypeScript
//   // Checking if the path exists and it's a file is not directly supported in TypeScript
//   // Assume loading index is successful
//   console.log(`Loaded vector index ${indexFile}`);
//   const results: any[] = [];
//   return results;
// }

// Function to extract text from document
function extractText(doc: any): string {
  if (doc.metadata && Object.keys(doc.metadata).length > 0) {
    return JSON.stringify(doc.metadata);
  }
  return doc.pageContent;
}

// Function to get matching objects
// function getMatchingObjects(
//   chatId: string,
//   screenId: string,
//   query: any,
//   scoreThreshold: number = 0.77,
// ): string[] {
//   const results: any[] = findClosestMatch(chatId, screenId, query);
//   const shortlisted: string[] = [];

//   for (const [doc, score] of results) {
//     if (score > scoreThreshold) {
//       shortlisted.push(extractText(doc));
//     }
//   }

//   if (shortlisted.length === 0 && results.length > 0) {
//     shortlisted.push(extractText(results[0]));
//   }

//   return shortlisted;
// }

export async function createEmbeddings(text: string[]) {
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return embeddings.data.map((e) => e.embedding);
}
