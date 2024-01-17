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

export const PromptPackageScalarFieldEnumSchema = z.enum(['id','userId','name','description','visibility','createdAt','updatedAt']);

export const PromptTemplateScalarFieldEnumSchema = z.enum(['id','userId','promptPackageId','name','description','previewVersionId','releaseVersionId','createdAt','updatedAt','modelType']);

export const PromptVersionScalarFieldEnumSchema = z.enum(['id','forkedFromId','userId','version','template','promptData','inputFields','templateFields','llmProvider','llmModelType','llmModel','llmConfig','lang','changelog','publishedAt','outAccuracy','outLatency','outCost','promptPackageId','promptTemplateId','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','username','image','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires','createdAt','updatedAt']);

export const PromptLogScalarFieldEnumSchema = z.enum(['id','userId','inputId','environment','version','prompt','completion','llmModelType','llmProvider','llmModel','llmConfig','latency','prompt_tokens','completion_tokens','total_tokens','extras','labelledState','finetunedState','promptPackageId','promptTemplateId','promptVersionId','createdAt','updatedAt']);

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

export const ModelTypeSchema = z.enum(['TEXT2TEXT','TEXT2IMAGE']);

export type ModelTypeType = `${z.infer<typeof ModelTypeSchema>}`

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
})

export type PromptPackage = z.infer<typeof PromptPackageSchema>

/////////////////////////////////////////
// PROMPT TEMPLATE SCHEMA
/////////////////////////////////////////

export const PromptTemplateSchema = z.object({
  modelType: ModelTypeSchema,
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
  version: z.string(),
  prompt: z.string(),
  completion: z.string(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: InputJsonValue,
  latency: z.number().int(),
  prompt_tokens: z.number().int(),
  completion_tokens: z.number().int(),
  total_tokens: z.number().int(),
  extras: InputJsonValue,
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PromptLog = z.infer<typeof PromptLogSchema>
