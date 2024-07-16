import { EmbeddingModel, EmbeddingModelDefault } from "~/validators/embedding";
import { prisma } from "~/server/db";
import { Embedding } from "~/validators/embedding";
import { createEmbeddings } from "~/utils/embeddings";

type PromptLogCustom = {
  id: string;
  promptPackageId: string;
  promptTemplateId: string;
  promptVersionId: string;
  content: string;
  similarity: number;
};

export const findSemanticLogs = async (
  userId: string,
  text: string,
  filters: any,
  limit: number = 5,
  em: EmbeddingModel = EmbeddingModelDefault,
): Promise<any[] | null> => {
  // Create embedding on text
  const textEmbeddings = await createEmbeddings([text], em);
  const textEmbedding = textEmbeddings[0];

  // Find closest template

  const scope = {
    promptPackageId: filters.promptPackageId || "",
    promptTemplateId: filters.promptTemplateId || "",
    version: filters.version || "",
    environment: filters.environment || "",
    llmModel: filters.llmModel || "",
    llmProvider: filters.llmProvider || "",
  };

  const pls: any[] = await prisma.$queryRaw`
    SELECT 
    pl."id", 
    -- pl."promptPackageId", 
    -- pl."promptTemplateId", 
    -- pl."promptVersionId", 
    ms."content",
    (ms."embedding" <#> ${textEmbedding}::vector) * -1 as similarity
  FROM 
    "PromptLog" AS pl
  JOIN 
    "Message" AS ms
  ON 
    pl."id" = ms."logId"
  WHERE 
    ms."userId" = ${userId}
    AND ms."embedding" IS NOT NULL
    
    AND (
        CASE
          WHEN ${scope.promptPackageId} <> '' THEN pl."promptPackageId" = ${scope.promptPackageId}
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${scope.promptTemplateId} <> '' THEN pl."promptTemplateId" = ${scope.promptTemplateId}
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${scope.version} <> '' THEN pl."promptVersionId" = ${scope.version}
          ELSE TRUE
        END
      )
      -- AND (
      --   CASE
      --     WHEN ${scope.environment} <> '' THEN pl."environment" = ${scope.environment}
      --     ELSE TRUE
      --   END
      -- )
      AND (
        CASE
          WHEN ${scope.llmModel} <> '' THEN pl."llmModel" = ${scope.llmModel}
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${scope.llmProvider} <> '' THEN pl."llmProvider" = ${scope.llmProvider}
          ELSE TRUE
        END
      )
    
    -- AND pl.promptId = pl.id -- Ensure this condition is necessary
    -- AND labelledState = 'labelled' -- Uncomment if this condition is needed
  ORDER BY 
    similarity DESC
  LIMIT ${limit}`;

  return pls;
};

export const findSemanticPrompt = async (
  userId: string,
  copilotId: string,
  text: string,
  textEmbedding: Embedding | null,
  defaultPromptVersionId: string,
  limit: number = 5,
  em: EmbeddingModel = EmbeddingModelDefault,
): Promise<{
  textEmbedding: Embedding;
  promptVersionId: string;
  score: number;
  threshold: number;
  text: string;
}> => {
  // Create embedding on text

  const threshold = 0.5;
  textEmbedding =
    textEmbedding ?? ((await createEmbeddings([text], em))[0] as Embedding);

  const pls: PromptLogCustom[] = await prisma.$queryRaw<PromptLogCustom[]>`
    SELECT 
    pl."id", 
    pl."promptPackageId", 
    pl."promptTemplateId", 
    pl."promptVersionId", 
    ms."content",
    (ms."embedding" <#> ${textEmbedding}::vector) * -1 as similarity
  FROM 
    "PromptLog" AS pl
  JOIN 
    "Message" AS ms
  ON 
    pl."id" = ms."logId"
  WHERE 
    ms."userId" = ${userId}
    AND ms."embedding" IS NOT NULL
    AND pl."copilotId" = ${copilotId}
    -- AND pl."labelledState" = 'selected' -- Uncomment if this condition is needed
  ORDER BY 
    similarity DESC
  LIMIT ${limit}`;

  // console.log(pls);

  // Extract
  const promptData = shortlistBestPromptVersionId(
    pls,
    defaultPromptVersionId,
    threshold,
  );

  return {
    textEmbedding,
    threshold,
    ...promptData,
  };
};

const shortlistBestPromptVersionId = (
  logs: PromptLogCustom[],
  defaultPromptVersionId: string,
  threshold: number = 0.5,
): {
  score: number;
  promptVersionId: string;
  text: string;
} => {
  let output = {
    score: 0,
    promptVersionId: defaultPromptVersionId,
    text: "",
  };

  if (logs.length === 0) {
    return output;
  }

  const bestLog = logs.reduce(
    (best, log) => (best && log.similarity > best.similarity ? log : best),
    logs[0],
  );

  if (bestLog && bestLog.similarity >= threshold) {
    output = {
      score: bestLog.similarity,
      promptVersionId: bestLog.promptVersionId,
      text: bestLog.content,
    };
  }

  return output;
};
