import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValue: z.ZodType<Prisma.JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(JsonValue)),
  z.lazy(() => z.record(JsonValue)),
]);

export type JsonValueType = z.infer<typeof JsonValue>;

export const NullableJsonValue = z
  .union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValue: z.ZodType<Prisma.InputJsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(InputJsonValue.nullable())),
  z.lazy(() => z.record(InputJsonValue.nullable())),
]);

export type InputJsonValueType = z.infer<typeof InputJsonValue>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires','createdAt','updatedAt']);

export const PromptVariablesScalarFieldEnumSchema = z.enum(['id','userId','promptPackageId','promptTemplateId','promptVersionId','name','majorVersion','minorVersion','variables','createdAt','updatedAt']);

export const PromptPackageScalarFieldEnumSchema = z.enum(['id','userId','name','description','visibility','createdAt','updatedAt','forkedId']);

export const PromptTemplateScalarFieldEnumSchema = z.enum(['id','userId','promptPackageId','name','description','previewVersionId','releaseVersionId','createdAt','updatedAt','modelType','runMode']);

export const PromptVersionScalarFieldEnumSchema = z.enum(['id','forkedFromId','userId','version','template','promptData','inputFields','templateFields','llmProvider','llmModelType','llmModel','llmConfig','lang','changelog','publishedAt','outAccuracy','outLatency','outCost','promptPackageId','promptTemplateId','variables','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','username','image','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires','createdAt','updatedAt']);

export const PromptLogScalarFieldEnumSchema = z.enum(['id','userId','inputId','copilotId','environment','version','prompt','completion','llmResponse','llmModelType','llmProvider','llmModel','llmConfig','stats','latency','prompt_tokens','completion_tokens','total_tokens','extras','labelledState','finetunedState','promptPackageId','promptTemplateId','promptVersionId','promptVariables','createdAt','updatedAt']);

export const LikeScalarFieldEnumSchema = z.enum(['id','likesCount','entityId','entityType','createdAt','updatedAt']);

export const LikeUserScalarFieldEnumSchema = z.enum(['id','userId','likeId','createdAt','updatedAt']);

export const BlogScalarFieldEnumSchema = z.enum(['id','title','description','slug','tags','publishedAt','mediaUrl','mediaType','previewImage','createdAt','updatedAt']);

export const ApiKeyScalarFieldEnumSchema = z.enum(['id','userId','copilotId','name','apiKey','lastUsedAt','isActive','createdAt','updatedAt']);

export const CopilotScalarFieldEnumSchema = z.enum(['id','name','description','copilotType','settings','userId','status','createdAt','updatedAt']);

export const ChatScalarFieldEnumSchema = z.enum(['id','userId','copilotId','messageCount','createdAt','updatedAt']);

export const MessageScalarFieldEnumSchema = z.enum(['id','userId','copilotId','logId','content','role','chatId','createdAt','metadata','updatedAt']);

export const EmbeddingScalarFieldEnumSchema = z.enum(['id','userId','copilotId','clientUserId','scope1','scope2','groupId','chunk','doc','strategy','createdAt','updatedAt']);

export const CopilotPromptScalarFieldEnumSchema = z.enum(['id','userId','copilotId','copilotKey','userName','packageName','packageId','templateName','versionName','createdAt','updatedAt']);

export const FormScalarFieldEnumSchema = z.enum(['id','userId','name','description','startButtonText','messages','languages','formConfig','createdAt','updatedAt']);

export const FormQuestionScalarFieldEnumSchema = z.enum(['id','userId','formId','question_type','question_text','question_params','validation','createdAt','updatedAt']);

export const FormSubmissionScalarFieldEnumSchema = z.enum(['id','userId','clientUserId','formId','createdAt','updatedAt']);

export const FormSubmissionAnswersScalarFieldEnumSchema = z.enum(['id','userId','clientUserId','formId','submissionId','questionId','response','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]);

export const LabelledStateSchema = z.enum(['UNLABELLED','SELECTED','REJECTED','NOTSURE']);

export type LabelledStateType = `${z.infer<typeof LabelledStateSchema>}`

export const PackageVisibilitySchema = z.enum(['PUBLIC','PRIVATE']);

export type PackageVisibilityType = `${z.infer<typeof PackageVisibilitySchema>}`

export const FinetunedStateSchema = z.enum(['UNPROCESSED','PROCESSED']);

export type FinetunedStateType = `${z.infer<typeof FinetunedStateSchema>}`

export const PromptEnvironmentSchema = z.enum(['DEV','PREVIEW','RELEASE']);

export type PromptEnvironmentType = `${z.infer<typeof PromptEnvironmentSchema>}`

export const ModelTypeSchema = z.enum(['TEXT2TEXT','TEXT2IMAGE','TEXT2CODE','IMAGE2IMAGE']);

export type ModelTypeType = `${z.infer<typeof ModelTypeSchema>}`

export const PromptRunModesSchema = z.enum(['AUTHORISED_ONLY','LOGGEDIN_ONLY','ALL']);

export type PromptRunModesType = `${z.infer<typeof PromptRunModesSchema>}`

export const MediaTypeSchema = z.enum(['IMAGE','VIDEO']);

export type MediaTypeType = `${z.infer<typeof MediaTypeSchema>}`

export const StatusStateSchema = z.enum(['PRODUCTION','STAGING','SANDBOX']);

export type StatusStateType = `${z.infer<typeof StatusStateSchema>}`

export const EntityTypesSchema = z.enum(['PromptPackage','PromptTemplate','PromptVersion']);

export type EntityTypesType = `${z.infer<typeof EntityTypesSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().uuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// PROMPT VARIABLES SCHEMA
/////////////////////////////////////////

export const PromptVariablesSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PromptVariables = z.infer<typeof PromptVariablesSchema>

/////////////////////////////////////////
// PROMPT PACKAGE SCHEMA
/////////////////////////////////////////

export const PromptPackageSchema = z.object({
  visibility: PackageVisibilitySchema,
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  forkedId: z.string().nullable(),
})

export type PromptPackage = z.infer<typeof PromptPackageSchema>

/////////////////////////////////////////
// PROMPT TEMPLATE SCHEMA
/////////////////////////////////////////

export const PromptTemplateSchema = z.object({
  modelType: ModelTypeSchema,
  runMode: PromptRunModesSchema,
  id: z.string().uuid(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().nullable(),
  releaseVersionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>

/////////////////////////////////////////
// PROMPT VERSION SCHEMA
/////////////////////////////////////////

export const PromptVersionSchema = z.object({
  llmModelType: ModelTypeSchema,
  id: z.string().uuid(),
  forkedFromId: z.string().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  promptData: InputJsonValue,
  inputFields: z.string().array(),
  templateFields: z.string().array(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: InputJsonValue,
  lang: z.string().array(),
  changelog: z.string().nullable(),
  publishedAt: z.coerce.date().nullable(),
  outAccuracy: z.number().nullable(),
  outLatency: z.number().nullable(),
  outCost: z.number().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  variables: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PromptVersion = z.infer<typeof PromptVersionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  username: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// PROMPT LOG SCHEMA
/////////////////////////////////////////

export const PromptLogSchema = z.object({
  environment: PromptEnvironmentSchema,
  llmModelType: ModelTypeSchema,
  labelledState: LabelledStateSchema,
  finetunedState: FinetunedStateSchema,
  id: z.string().uuid(),
  userId: z.string(),
  inputId: z.string().nullable(),
  copilotId: z.string().nullable(),
  version: z.string(),
  prompt: z.string(),
  completion: z.string().nullable(),
  llmResponse: InputJsonValue,
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: InputJsonValue,
  stats: InputJsonValue,
  latency: z.number().int(),
  prompt_tokens: z.number().int(),
  completion_tokens: z.number().int(),
  total_tokens: z.number().int(),
  extras: InputJsonValue,
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  promptVariables: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PromptLog = z.infer<typeof PromptLogSchema>

/////////////////////////////////////////
// LIKE SCHEMA
/////////////////////////////////////////

export const LikeSchema = z.object({
  id: z.string().uuid(),
  likesCount: z.number().int(),
  entityId: z.string(),
  entityType: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Like = z.infer<typeof LikeSchema>

/////////////////////////////////////////
// LIKE USER SCHEMA
/////////////////////////////////////////

export const LikeUserSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  likeId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type LikeUser = z.infer<typeof LikeUserSchema>

/////////////////////////////////////////
// BLOG SCHEMA
/////////////////////////////////////////

export const BlogSchema = z.object({
  mediaType: MediaTypeSchema,
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  tags: InputJsonValue,
  publishedAt: z.coerce.date().nullable(),
  mediaUrl: z.string(),
  previewImage: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Blog = z.infer<typeof BlogSchema>

/////////////////////////////////////////
// API KEY SCHEMA
/////////////////////////////////////////

export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  copilotId: z.string().nullable(),
  name: z.string(),
  apiKey: z.string(),
  lastUsedAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ApiKey = z.infer<typeof ApiKeySchema>

/////////////////////////////////////////
// COPILOT SCHEMA
/////////////////////////////////////////

export const CopilotSchema = z.object({
  status: StatusStateSchema,
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  copilotType: z.string(),
  settings: InputJsonValue,
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Copilot = z.infer<typeof CopilotSchema>

/////////////////////////////////////////
// CHAT SCHEMA
/////////////////////////////////////////

export const ChatSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  copilotId: z.string(),
  messageCount: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Chat = z.infer<typeof ChatSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  copilotId: z.string(),
  logId: z.string().nullable(),
  content: z.string(),
  role: z.string(),
  chatId: z.string(),
  createdAt: z.coerce.date(),
  metadata: InputJsonValue,
  updatedAt: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// EMBEDDING SCHEMA
/////////////////////////////////////////

export const EmbeddingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  copilotId: z.string(),
  clientUserId: z.string(),
  scope1: z.string(),
  scope2: z.string().nullable(),
  groupId: z.string().nullable(),
  chunk: z.string(),
  doc: z.string(),
  strategy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Embedding = z.infer<typeof EmbeddingSchema>

/////////////////////////////////////////
// COPILOT PROMPT SCHEMA
/////////////////////////////////////////

export const CopilotPromptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  copilotId: z.string(),
  copilotKey: z.string(),
  userName: z.string(),
  packageName: z.string(),
  packageId: z.string(),
  templateName: z.string(),
  versionName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CopilotPrompt = z.infer<typeof CopilotPromptSchema>

/////////////////////////////////////////
// FORM SCHEMA
/////////////////////////////////////////

export const FormSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  description: InputJsonValue,
  startButtonText: InputJsonValue,
  messages: InputJsonValue,
  languages: InputJsonValue,
  formConfig: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Form = z.infer<typeof FormSchema>

/////////////////////////////////////////
// FORM QUESTION SCHEMA
/////////////////////////////////////////

export const FormQuestionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  formId: z.string(),
  question_type: z.string(),
  question_text: InputJsonValue,
  question_params: InputJsonValue,
  validation: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FormQuestion = z.infer<typeof FormQuestionSchema>

/////////////////////////////////////////
// FORM SUBMISSION SCHEMA
/////////////////////////////////////////

export const FormSubmissionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  clientUserId: z.string(),
  formId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FormSubmission = z.infer<typeof FormSubmissionSchema>

/////////////////////////////////////////
// FORM SUBMISSION ANSWERS SCHEMA
/////////////////////////////////////////

export const FormSubmissionAnswersSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  clientUserId: z.string(),
  formId: z.string(),
  submissionId: z.string(),
  questionId: z.string(),
  response: InputJsonValue,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FormSubmissionAnswers = z.infer<typeof FormSubmissionAnswersSchema>
