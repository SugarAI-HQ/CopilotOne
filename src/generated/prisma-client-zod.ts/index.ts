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

export const PromptTemplateScalarFieldEnumSchema = z.enum(['id','userId','promptPackageId','name','description','previewVersionId','releaseVersionId','createdAt','updatedAt']);

export const PromptVersionScalarFieldEnumSchema = z.enum(['id','forkedFromId','userId','version','template','inputFields','templateFields','llmProvider','llmModel','llmConfig','lang','changelog','publishedAt','outAccuracy','outLatency','outCost','promptPackageId','promptTemplateId','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires','createdAt','updatedAt']);

export const PromptLogScalarFieldEnumSchema = z.enum(['id','userId','inputId','environment','version','prompt','completion','llmProvider','llmModel','llmConfig','latency','prompt_tokens','completion_tokens','total_tokens','extras','labelledState','finetunedState','promptPackageId','promptTemplateId','promptVersionId','createdAt','updatedAt']);

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
  id: z.string().uuid(),
  forkedFromId: z.string().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
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

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PROMPT VARIABLES
//------------------------------------------------------

export const PromptVariablesIncludeSchema: z.ZodType<Prisma.PromptVariablesInclude> = z.object({
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  promptTemplate: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
}).strict()

export const PromptVariablesArgsSchema: z.ZodType<Prisma.PromptVariablesDefaultArgs> = z.object({
  select: z.lazy(() => PromptVariablesSelectSchema).optional(),
  include: z.lazy(() => PromptVariablesIncludeSchema).optional(),
}).strict();

export const PromptVariablesSelectSchema: z.ZodType<Prisma.PromptVariablesSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  promptPackageId: z.boolean().optional(),
  promptTemplateId: z.boolean().optional(),
  promptVersionId: z.boolean().optional(),
  name: z.boolean().optional(),
  majorVersion: z.boolean().optional(),
  minorVersion: z.boolean().optional(),
  variables: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  promptTemplate: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
}).strict()

// PROMPT PACKAGE
//------------------------------------------------------

export const PromptPackageIncludeSchema: z.ZodType<Prisma.PromptPackageInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  templates: z.union([z.boolean(),z.lazy(() => PromptTemplateFindManyArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptPackageCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PromptPackageArgsSchema: z.ZodType<Prisma.PromptPackageDefaultArgs> = z.object({
  select: z.lazy(() => PromptPackageSelectSchema).optional(),
  include: z.lazy(() => PromptPackageIncludeSchema).optional(),
}).strict();

export const PromptPackageCountOutputTypeArgsSchema: z.ZodType<Prisma.PromptPackageCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PromptPackageCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PromptPackageCountOutputTypeSelectSchema: z.ZodType<Prisma.PromptPackageCountOutputTypeSelect> = z.object({
  templates: z.boolean().optional(),
  PromptVariables: z.boolean().optional(),
  PromptVersion: z.boolean().optional(),
}).strict();

export const PromptPackageSelectSchema: z.ZodType<Prisma.PromptPackageSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  visibility: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  templates: z.union([z.boolean(),z.lazy(() => PromptTemplateFindManyArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptPackageCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROMPT TEMPLATE
//------------------------------------------------------

export const PromptTemplateIncludeSchema: z.ZodType<Prisma.PromptTemplateInclude> = z.object({
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  previewVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
  releaseVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  versions: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptTemplateCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PromptTemplateArgsSchema: z.ZodType<Prisma.PromptTemplateDefaultArgs> = z.object({
  select: z.lazy(() => PromptTemplateSelectSchema).optional(),
  include: z.lazy(() => PromptTemplateIncludeSchema).optional(),
}).strict();

export const PromptTemplateCountOutputTypeArgsSchema: z.ZodType<Prisma.PromptTemplateCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PromptTemplateCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PromptTemplateCountOutputTypeSelectSchema: z.ZodType<Prisma.PromptTemplateCountOutputTypeSelect> = z.object({
  PromptVariables: z.boolean().optional(),
  versions: z.boolean().optional(),
}).strict();

export const PromptTemplateSelectSchema: z.ZodType<Prisma.PromptTemplateSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  promptPackageId: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  previewVersionId: z.boolean().optional(),
  releaseVersionId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  previewVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
  releaseVersion: z.union([z.boolean(),z.lazy(() => PromptVersionArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  versions: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptTemplateCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROMPT VERSION
//------------------------------------------------------

export const PromptVersionIncludeSchema: z.ZodType<Prisma.PromptVersionInclude> = z.object({
  previewVersion: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  releaseVersion: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  promptTemplate: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptVersionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PromptVersionArgsSchema: z.ZodType<Prisma.PromptVersionDefaultArgs> = z.object({
  select: z.lazy(() => PromptVersionSelectSchema).optional(),
  include: z.lazy(() => PromptVersionIncludeSchema).optional(),
}).strict();

export const PromptVersionCountOutputTypeArgsSchema: z.ZodType<Prisma.PromptVersionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PromptVersionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PromptVersionCountOutputTypeSelectSchema: z.ZodType<Prisma.PromptVersionCountOutputTypeSelect> = z.object({
  PromptVariables: z.boolean().optional(),
}).strict();

export const PromptVersionSelectSchema: z.ZodType<Prisma.PromptVersionSelect> = z.object({
  id: z.boolean().optional(),
  forkedFromId: z.boolean().optional(),
  userId: z.boolean().optional(),
  version: z.boolean().optional(),
  template: z.boolean().optional(),
  inputFields: z.boolean().optional(),
  templateFields: z.boolean().optional(),
  llmProvider: z.boolean().optional(),
  llmModel: z.boolean().optional(),
  llmConfig: z.boolean().optional(),
  lang: z.boolean().optional(),
  changelog: z.boolean().optional(),
  publishedAt: z.boolean().optional(),
  outAccuracy: z.boolean().optional(),
  outLatency: z.boolean().optional(),
  outCost: z.boolean().optional(),
  promptPackageId: z.boolean().optional(),
  promptTemplateId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  previewVersion: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  releaseVersion: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  PromptVariables: z.union([z.boolean(),z.lazy(() => PromptVariablesFindManyArgsSchema)]).optional(),
  promptPackage: z.union([z.boolean(),z.lazy(() => PromptPackageArgsSchema)]).optional(),
  promptTemplate: z.union([z.boolean(),z.lazy(() => PromptTemplateArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromptVersionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  promptPackages: z.union([z.boolean(),z.lazy(() => PromptPackageFindManyArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  promptPackages: z.boolean().optional(),
  PromptVersion: z.boolean().optional(),
  sessions: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  promptPackages: z.union([z.boolean(),z.lazy(() => PromptPackageFindManyArgsSchema)]).optional(),
  PromptVersion: z.union([z.boolean(),z.lazy(() => PromptVersionFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// PROMPT LOG
//------------------------------------------------------

export const PromptLogSelectSchema: z.ZodType<Prisma.PromptLogSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  inputId: z.boolean().optional(),
  environment: z.boolean().optional(),
  version: z.boolean().optional(),
  prompt: z.boolean().optional(),
  completion: z.boolean().optional(),
  llmProvider: z.boolean().optional(),
  llmModel: z.boolean().optional(),
  llmConfig: z.boolean().optional(),
  latency: z.boolean().optional(),
  prompt_tokens: z.boolean().optional(),
  completion_tokens: z.boolean().optional(),
  total_tokens: z.boolean().optional(),
  extras: z.boolean().optional(),
  labelledState: z.boolean().optional(),
  finetunedState: z.boolean().optional(),
  promptPackageId: z.boolean().optional(),
  promptTemplateId: z.boolean().optional(),
  promptVersionId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    sessionToken: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    sessionToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptVariablesWhereInputSchema: z.ZodType<Prisma.PromptVariablesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVariablesWhereInputSchema),z.lazy(() => PromptVariablesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVariablesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVariablesWhereInputSchema),z.lazy(() => PromptVariablesWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  majorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  variables: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  promptTemplate: z.union([ z.lazy(() => PromptTemplateRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  PromptVersion: z.union([ z.lazy(() => PromptVersionRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
}).strict();

export const PromptVariablesOrderByWithRelationInputSchema: z.ZodType<Prisma.PromptVariablesOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  majorVersion: z.lazy(() => SortOrderSchema).optional(),
  minorVersion: z.lazy(() => SortOrderSchema).optional(),
  variables: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageOrderByWithRelationInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateOrderByWithRelationInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionOrderByWithRelationInputSchema).optional()
}).strict();

export const PromptVariablesWhereUniqueInputSchema: z.ZodType<Prisma.PromptVariablesWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    promptTemplateId_majorVersion_minorVersion_variables: z.lazy(() => PromptVariablesPromptTemplateIdMajorVersionMinorVersionVariablesCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    promptTemplateId_majorVersion_minorVersion_variables: z.lazy(() => PromptVariablesPromptTemplateIdMajorVersionMinorVersionVariablesCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  promptTemplateId_majorVersion_minorVersion_variables: z.lazy(() => PromptVariablesPromptTemplateIdMajorVersionMinorVersionVariablesCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PromptVariablesWhereInputSchema),z.lazy(() => PromptVariablesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVariablesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVariablesWhereInputSchema),z.lazy(() => PromptVariablesWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  majorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  variables: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  promptTemplate: z.union([ z.lazy(() => PromptTemplateRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  PromptVersion: z.union([ z.lazy(() => PromptVersionRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
}).strict());

export const PromptVariablesOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromptVariablesOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  majorVersion: z.lazy(() => SortOrderSchema).optional(),
  minorVersion: z.lazy(() => SortOrderSchema).optional(),
  variables: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromptVariablesCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromptVariablesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromptVariablesMinOrderByAggregateInputSchema).optional()
}).strict();

export const PromptVariablesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromptVariablesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVariablesScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptVariablesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVariablesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVariablesScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptVariablesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  majorVersion: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  minorVersion: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  variables: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptPackageWhereInputSchema: z.ZodType<Prisma.PromptPackageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptPackageWhereInputSchema),z.lazy(() => PromptPackageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptPackageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptPackageWhereInputSchema),z.lazy(() => PromptPackageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  visibility: z.union([ z.lazy(() => EnumPackageVisibilityFilterSchema),z.lazy(() => PackageVisibilitySchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  User: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateListRelationFilterSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionListRelationFilterSchema).optional()
}).strict();

export const PromptPackageOrderByWithRelationInputSchema: z.ZodType<Prisma.PromptPackageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  visibility: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  templates: z.lazy(() => PromptTemplateOrderByRelationAggregateInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesOrderByRelationAggregateInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PromptPackageWhereUniqueInputSchema: z.ZodType<Prisma.PromptPackageWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    userId_name: z.lazy(() => PromptPackageUserIdNameCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    userId_name: z.lazy(() => PromptPackageUserIdNameCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  userId_name: z.lazy(() => PromptPackageUserIdNameCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PromptPackageWhereInputSchema),z.lazy(() => PromptPackageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptPackageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptPackageWhereInputSchema),z.lazy(() => PromptPackageWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  visibility: z.union([ z.lazy(() => EnumPackageVisibilityFilterSchema),z.lazy(() => PackageVisibilitySchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  User: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateListRelationFilterSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionListRelationFilterSchema).optional()
}).strict());

export const PromptPackageOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromptPackageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  visibility: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromptPackageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromptPackageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromptPackageMinOrderByAggregateInputSchema).optional()
}).strict();

export const PromptPackageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromptPackageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromptPackageScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptPackageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptPackageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptPackageScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptPackageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  visibility: z.union([ z.lazy(() => EnumPackageVisibilityWithAggregatesFilterSchema),z.lazy(() => PackageVisibilitySchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptTemplateWhereInputSchema: z.ZodType<Prisma.PromptTemplateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptTemplateWhereInputSchema),z.lazy(() => PromptTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptTemplateWhereInputSchema),z.lazy(() => PromptTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  previewVersionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  releaseVersionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  previewVersion: z.union([ z.lazy(() => PromptVersionNullableRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional().nullable(),
  releaseVersion: z.union([ z.lazy(() => PromptVersionNullableRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional().nullable(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  versions: z.lazy(() => PromptVersionListRelationFilterSchema).optional()
}).strict();

export const PromptTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.PromptTemplateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  previewVersionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  releaseVersionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageOrderByWithRelationInputSchema).optional(),
  previewVersion: z.lazy(() => PromptVersionOrderByWithRelationInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionOrderByWithRelationInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesOrderByRelationAggregateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PromptTemplateWhereUniqueInputSchema: z.ZodType<Prisma.PromptTemplateWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    previewVersionId: z.string(),
    releaseVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
    previewVersionId: z.string(),
    releaseVersionId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    previewVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().uuid(),
    previewVersionId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    releaseVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().uuid(),
    releaseVersionId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    previewVersionId: z.string(),
    releaseVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    previewVersionId: z.string(),
    releaseVersionId: z.string(),
  }),
  z.object({
    previewVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    previewVersionId: z.string(),
  }),
  z.object({
    releaseVersionId: z.string(),
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    releaseVersionId: z.string(),
  }),
  z.object({
    promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  previewVersionId: z.string().optional(),
  releaseVersionId: z.string().optional(),
  promptPackageId_name: z.lazy(() => PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PromptTemplateWhereInputSchema),z.lazy(() => PromptTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptTemplateWhereInputSchema),z.lazy(() => PromptTemplateWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  previewVersion: z.union([ z.lazy(() => PromptVersionNullableRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional().nullable(),
  releaseVersion: z.union([ z.lazy(() => PromptVersionNullableRelationFilterSchema),z.lazy(() => PromptVersionWhereInputSchema) ]).optional().nullable(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  versions: z.lazy(() => PromptVersionListRelationFilterSchema).optional()
}).strict());

export const PromptTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromptTemplateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  previewVersionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  releaseVersionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromptTemplateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromptTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromptTemplateMinOrderByAggregateInputSchema).optional()
}).strict();

export const PromptTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromptTemplateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromptTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  previewVersionId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  releaseVersionId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptVersionWhereInputSchema: z.ZodType<Prisma.PromptVersionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVersionWhereInputSchema),z.lazy(() => PromptVersionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVersionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVersionWhereInputSchema),z.lazy(() => PromptVersionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  template: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  templateFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  llmProvider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonFilterSchema).optional(),
  lang: z.lazy(() => StringNullableListFilterSchema).optional(),
  changelog: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  outAccuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outLatency: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outCost: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  previewVersion: z.union([ z.lazy(() => PromptTemplateNullableRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional().nullable(),
  releaseVersion: z.union([ z.lazy(() => PromptTemplateNullableRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional().nullable(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  promptTemplate: z.union([ z.lazy(() => PromptTemplateRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PromptVersionOrderByWithRelationInputSchema: z.ZodType<Prisma.PromptVersionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  template: z.lazy(() => SortOrderSchema).optional(),
  inputFields: z.lazy(() => SortOrderSchema).optional(),
  templateFields: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  lang: z.lazy(() => SortOrderSchema).optional(),
  changelog: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outAccuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outLatency: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outCost: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  previewVersion: z.lazy(() => PromptTemplateOrderByWithRelationInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateOrderByWithRelationInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesOrderByRelationAggregateInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageOrderByWithRelationInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PromptVersionWhereUniqueInputSchema: z.ZodType<Prisma.PromptVersionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    promptPackageId_promptTemplateId_version: z.lazy(() => PromptVersionPromptPackageIdPromptTemplateIdVersionCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    promptPackageId_promptTemplateId_version: z.lazy(() => PromptVersionPromptPackageIdPromptTemplateIdVersionCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  promptPackageId_promptTemplateId_version: z.lazy(() => PromptVersionPromptPackageIdPromptTemplateIdVersionCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PromptVersionWhereInputSchema),z.lazy(() => PromptVersionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVersionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVersionWhereInputSchema),z.lazy(() => PromptVersionWhereInputSchema).array() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  template: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  templateFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  llmProvider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonFilterSchema).optional(),
  lang: z.lazy(() => StringNullableListFilterSchema).optional(),
  changelog: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  outAccuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outLatency: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outCost: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  previewVersion: z.union([ z.lazy(() => PromptTemplateNullableRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional().nullable(),
  releaseVersion: z.union([ z.lazy(() => PromptTemplateNullableRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional().nullable(),
  PromptVariables: z.lazy(() => PromptVariablesListRelationFilterSchema).optional(),
  promptPackage: z.union([ z.lazy(() => PromptPackageRelationFilterSchema),z.lazy(() => PromptPackageWhereInputSchema) ]).optional(),
  promptTemplate: z.union([ z.lazy(() => PromptTemplateRelationFilterSchema),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PromptVersionOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromptVersionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  template: z.lazy(() => SortOrderSchema).optional(),
  inputFields: z.lazy(() => SortOrderSchema).optional(),
  templateFields: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  lang: z.lazy(() => SortOrderSchema).optional(),
  changelog: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outAccuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outLatency: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outCost: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromptVersionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PromptVersionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromptVersionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromptVersionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PromptVersionSumOrderByAggregateInputSchema).optional()
}).strict();

export const PromptVersionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromptVersionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVersionScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptVersionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVersionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVersionScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptVersionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  template: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inputFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  templateFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  llmProvider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  lang: z.lazy(() => StringNullableListFilterSchema).optional(),
  changelog: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  outAccuracy: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  outLatency: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  outCost: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  promptPackageId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageListRelationFilterSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageOrderByRelationAggregateInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageListRelationFilterSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.union([
  z.object({
    token: z.string(),
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  token: z.string().optional(),
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptLogWhereInputSchema: z.ZodType<Prisma.PromptLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptLogWhereInputSchema),z.lazy(() => PromptLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptLogWhereInputSchema),z.lazy(() => PromptLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  environment: z.union([ z.lazy(() => EnumPromptEnvironmentFilterSchema),z.lazy(() => PromptEnvironmentSchema) ]).optional(),
  version: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProvider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonFilterSchema).optional(),
  latency: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  prompt_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  completion_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  total_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  extras: z.lazy(() => JsonFilterSchema).optional(),
  labelledState: z.union([ z.lazy(() => EnumLabelledStateFilterSchema),z.lazy(() => LabelledStateSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => EnumFinetunedStateFilterSchema),z.lazy(() => FinetunedStateSchema) ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptLogOrderByWithRelationInputSchema: z.ZodType<Prisma.PromptLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  inputId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  environment: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  completion: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional(),
  extras: z.lazy(() => SortOrderSchema).optional(),
  labelledState: z.lazy(() => SortOrderSchema).optional(),
  finetunedState: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptLogWhereUniqueInputSchema: z.ZodType<Prisma.PromptLogWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => PromptLogWhereInputSchema),z.lazy(() => PromptLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptLogWhereInputSchema),z.lazy(() => PromptLogWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  environment: z.union([ z.lazy(() => EnumPromptEnvironmentFilterSchema),z.lazy(() => PromptEnvironmentSchema) ]).optional(),
  version: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProvider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonFilterSchema).optional(),
  latency: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  prompt_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  completion_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  total_tokens: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  extras: z.lazy(() => JsonFilterSchema).optional(),
  labelledState: z.union([ z.lazy(() => EnumLabelledStateFilterSchema),z.lazy(() => LabelledStateSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => EnumFinetunedStateFilterSchema),z.lazy(() => FinetunedStateSchema) ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const PromptLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromptLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  inputId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  environment: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  completion: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional(),
  extras: z.lazy(() => SortOrderSchema).optional(),
  labelledState: z.lazy(() => SortOrderSchema).optional(),
  finetunedState: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromptLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PromptLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromptLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromptLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PromptLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const PromptLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromptLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromptLogScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptLogScalarWhereWithAggregatesInputSchema),z.lazy(() => PromptLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inputId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  environment: z.union([ z.lazy(() => EnumPromptEnvironmentWithAggregatesFilterSchema),z.lazy(() => PromptEnvironmentSchema) ]).optional(),
  version: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  completion: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmProvider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  latency: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  prompt_tokens: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  completion_tokens: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  total_tokens: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  extras: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  labelledState: z.union([ z.lazy(() => EnumLabelledStateWithAggregatesFilterSchema),z.lazy(() => LabelledStateSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => EnumFinetunedStateWithAggregatesFilterSchema),z.lazy(() => FinetunedStateSchema) ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesCreateInputSchema: z.ZodType<Prisma.PromptVariablesCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVariablesInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutPromptVariablesInputSchema),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPromptVariablesInputSchema)
}).strict();

export const PromptVariablesUncheckedCreateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesUpdateInputSchema: z.ZodType<Prisma.PromptVariablesUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional()
}).strict();

export const PromptVariablesUncheckedUpdateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesCreateManyInputSchema: z.ZodType<Prisma.PromptVariablesCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesUpdateManyMutationInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptPackageCreateInputSchema: z.ZodType<Prisma.PromptPackageCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPromptPackagesInputSchema),
  templates: z.lazy(() => PromptTemplateCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUncheckedCreateInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  templates: z.lazy(() => PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUpdateInputSchema: z.ZodType<Prisma.PromptPackageUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPromptPackagesNestedInputSchema).optional(),
  templates: z.lazy(() => PromptTemplateUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageCreateManyInputSchema: z.ZodType<Prisma.PromptPackageCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptPackageUpdateManyMutationInputSchema: z.ZodType<Prisma.PromptPackageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptPackageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptTemplateCreateInputSchema: z.ZodType<Prisma.PromptTemplateCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutTemplatesInputSchema),
  previewVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUpdateInputSchema: z.ZodType<Prisma.PromptTemplateUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema).optional(),
  previewVersion: z.lazy(() => PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateCreateManyInputSchema: z.ZodType<Prisma.PromptTemplateCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.PromptTemplateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVersionCreateInputSchema: z.ZodType<Prisma.PromptVersionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionUpdateInputSchema: z.ZodType<Prisma.PromptVersionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionCreateManyInputSchema: z.ZodType<Prisma.PromptVersionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVersionUpdateManyMutationInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVersionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptLogCreateInputSchema: z.ZodType<Prisma.PromptLogCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  inputId: z.string().optional().nullable(),
  environment: z.lazy(() => PromptEnvironmentSchema).optional(),
  version: z.string(),
  prompt: z.string(),
  completion: z.string(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  latency: z.number().int(),
  prompt_tokens: z.number().int(),
  completion_tokens: z.number().int(),
  total_tokens: z.number().int(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  labelledState: z.lazy(() => LabelledStateSchema).optional(),
  finetunedState: z.lazy(() => FinetunedStateSchema).optional(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptLogUncheckedCreateInputSchema: z.ZodType<Prisma.PromptLogUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  inputId: z.string().optional().nullable(),
  environment: z.lazy(() => PromptEnvironmentSchema).optional(),
  version: z.string(),
  prompt: z.string(),
  completion: z.string(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  latency: z.number().int(),
  prompt_tokens: z.number().int(),
  completion_tokens: z.number().int(),
  total_tokens: z.number().int(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  labelledState: z.lazy(() => LabelledStateSchema).optional(),
  finetunedState: z.lazy(() => FinetunedStateSchema).optional(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptLogUpdateInputSchema: z.ZodType<Prisma.PromptLogUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  environment: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => EnumPromptEnvironmentFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  latency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  completion_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  labelledState: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => EnumLabelledStateFieldUpdateOperationsInputSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => EnumFinetunedStateFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptLogUncheckedUpdateInputSchema: z.ZodType<Prisma.PromptLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  environment: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => EnumPromptEnvironmentFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  latency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  completion_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  labelledState: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => EnumLabelledStateFieldUpdateOperationsInputSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => EnumFinetunedStateFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptLogCreateManyInputSchema: z.ZodType<Prisma.PromptLogCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  inputId: z.string().optional().nullable(),
  environment: z.lazy(() => PromptEnvironmentSchema).optional(),
  version: z.string(),
  prompt: z.string(),
  completion: z.string(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  latency: z.number().int(),
  prompt_tokens: z.number().int(),
  completion_tokens: z.number().int(),
  total_tokens: z.number().int(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  labelledState: z.lazy(() => LabelledStateSchema).optional(),
  finetunedState: z.lazy(() => FinetunedStateSchema).optional(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptLogUpdateManyMutationInputSchema: z.ZodType<Prisma.PromptLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  environment: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => EnumPromptEnvironmentFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  latency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  completion_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  labelledState: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => EnumLabelledStateFieldUpdateOperationsInputSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => EnumFinetunedStateFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromptLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  environment: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => EnumPromptEnvironmentFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  latency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  completion_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total_tokens: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  extras: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  labelledState: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => EnumLabelledStateFieldUpdateOperationsInputSchema) ]).optional(),
  finetunedState: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => EnumFinetunedStateFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValue.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: InputJsonValue.optional()
}).strict();

export const PromptPackageRelationFilterSchema: z.ZodType<Prisma.PromptPackageRelationFilter> = z.object({
  is: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  isNot: z.lazy(() => PromptPackageWhereInputSchema).optional()
}).strict();

export const PromptTemplateRelationFilterSchema: z.ZodType<Prisma.PromptTemplateRelationFilter> = z.object({
  is: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  isNot: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptVersionRelationFilterSchema: z.ZodType<Prisma.PromptVersionRelationFilter> = z.object({
  is: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  isNot: z.lazy(() => PromptVersionWhereInputSchema).optional()
}).strict();

export const PromptVariablesPromptTemplateIdMajorVersionMinorVersionVariablesCompoundUniqueInputSchema: z.ZodType<Prisma.PromptVariablesPromptTemplateIdMajorVersionMinorVersionVariablesCompoundUniqueInput> = z.object({
  promptTemplateId: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: InputJsonValue
}).strict();

export const PromptVariablesCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVariablesCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  majorVersion: z.lazy(() => SortOrderSchema).optional(),
  minorVersion: z.lazy(() => SortOrderSchema).optional(),
  variables: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVariablesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVariablesMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  majorVersion: z.lazy(() => SortOrderSchema).optional(),
  minorVersion: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVariablesMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVariablesMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  majorVersion: z.lazy(() => SortOrderSchema).optional(),
  minorVersion: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValue.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: InputJsonValue.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const EnumPackageVisibilityFilterSchema: z.ZodType<Prisma.EnumPackageVisibilityFilter> = z.object({
  equals: z.lazy(() => PackageVisibilitySchema).optional(),
  in: z.lazy(() => PackageVisibilitySchema).array().optional(),
  notIn: z.lazy(() => PackageVisibilitySchema).array().optional(),
  not: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => NestedEnumPackageVisibilityFilterSchema) ]).optional(),
}).strict();

export const PromptTemplateListRelationFilterSchema: z.ZodType<Prisma.PromptTemplateListRelationFilter> = z.object({
  every: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  some: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  none: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptVariablesListRelationFilterSchema: z.ZodType<Prisma.PromptVariablesListRelationFilter> = z.object({
  every: z.lazy(() => PromptVariablesWhereInputSchema).optional(),
  some: z.lazy(() => PromptVariablesWhereInputSchema).optional(),
  none: z.lazy(() => PromptVariablesWhereInputSchema).optional()
}).strict();

export const PromptVersionListRelationFilterSchema: z.ZodType<Prisma.PromptVersionListRelationFilter> = z.object({
  every: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  some: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  none: z.lazy(() => PromptVersionWhereInputSchema).optional()
}).strict();

export const PromptTemplateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PromptTemplateOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVariablesOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PromptVariablesOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVersionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PromptVersionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptPackageUserIdNameCompoundUniqueInputSchema: z.ZodType<Prisma.PromptPackageUserIdNameCompoundUniqueInput> = z.object({
  userId: z.string(),
  name: z.string()
}).strict();

export const PromptPackageCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromptPackageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  visibility: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptPackageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromptPackageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  visibility: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptPackageMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromptPackageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  visibility: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPackageVisibilityWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPackageVisibilityWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PackageVisibilitySchema).optional(),
  in: z.lazy(() => PackageVisibilitySchema).array().optional(),
  notIn: z.lazy(() => PackageVisibilitySchema).array().optional(),
  not: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => NestedEnumPackageVisibilityWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPackageVisibilityFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPackageVisibilityFilterSchema).optional()
}).strict();

export const PromptVersionNullableRelationFilterSchema: z.ZodType<Prisma.PromptVersionNullableRelationFilter> = z.object({
  is: z.lazy(() => PromptVersionWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PromptVersionWhereInputSchema).optional().nullable()
}).strict();

export const PromptTemplatePromptPackageIdNameCompoundUniqueInputSchema: z.ZodType<Prisma.PromptTemplatePromptPackageIdNameCompoundUniqueInput> = z.object({
  promptPackageId: z.string(),
  name: z.string()
}).strict();

export const PromptTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromptTemplateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  previewVersionId: z.lazy(() => SortOrderSchema).optional(),
  releaseVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromptTemplateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  previewVersionId: z.lazy(() => SortOrderSchema).optional(),
  releaseVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromptTemplateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  previewVersionId: z.lazy(() => SortOrderSchema).optional(),
  releaseVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const PromptTemplateNullableRelationFilterSchema: z.ZodType<Prisma.PromptTemplateNullableRelationFilter> = z.object({
  is: z.lazy(() => PromptTemplateWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PromptTemplateWhereInputSchema).optional().nullable()
}).strict();

export const PromptVersionPromptPackageIdPromptTemplateIdVersionCompoundUniqueInputSchema: z.ZodType<Prisma.PromptVersionPromptPackageIdPromptTemplateIdVersionCompoundUniqueInput> = z.object({
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  version: z.string()
}).strict();

export const PromptVersionCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVersionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  template: z.lazy(() => SortOrderSchema).optional(),
  inputFields: z.lazy(() => SortOrderSchema).optional(),
  templateFields: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  lang: z.lazy(() => SortOrderSchema).optional(),
  changelog: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  outAccuracy: z.lazy(() => SortOrderSchema).optional(),
  outLatency: z.lazy(() => SortOrderSchema).optional(),
  outCost: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVersionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVersionAvgOrderByAggregateInput> = z.object({
  outAccuracy: z.lazy(() => SortOrderSchema).optional(),
  outLatency: z.lazy(() => SortOrderSchema).optional(),
  outCost: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVersionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVersionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  template: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  changelog: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  outAccuracy: z.lazy(() => SortOrderSchema).optional(),
  outLatency: z.lazy(() => SortOrderSchema).optional(),
  outCost: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVersionMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVersionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  template: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  changelog: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  outAccuracy: z.lazy(() => SortOrderSchema).optional(),
  outLatency: z.lazy(() => SortOrderSchema).optional(),
  outCost: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptVersionSumOrderByAggregateInputSchema: z.ZodType<Prisma.PromptVersionSumOrderByAggregateInput> = z.object({
  outAccuracy: z.lazy(() => SortOrderSchema).optional(),
  outLatency: z.lazy(() => SortOrderSchema).optional(),
  outCost: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const PromptPackageListRelationFilterSchema: z.ZodType<Prisma.PromptPackageListRelationFilter> = z.object({
  every: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  some: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  none: z.lazy(() => PromptPackageWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptPackageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PromptPackageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPromptEnvironmentFilterSchema: z.ZodType<Prisma.EnumPromptEnvironmentFilter> = z.object({
  equals: z.lazy(() => PromptEnvironmentSchema).optional(),
  in: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  notIn: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  not: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => NestedEnumPromptEnvironmentFilterSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumLabelledStateFilterSchema: z.ZodType<Prisma.EnumLabelledStateFilter> = z.object({
  equals: z.lazy(() => LabelledStateSchema).optional(),
  in: z.lazy(() => LabelledStateSchema).array().optional(),
  notIn: z.lazy(() => LabelledStateSchema).array().optional(),
  not: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => NestedEnumLabelledStateFilterSchema) ]).optional(),
}).strict();

export const EnumFinetunedStateFilterSchema: z.ZodType<Prisma.EnumFinetunedStateFilter> = z.object({
  equals: z.lazy(() => FinetunedStateSchema).optional(),
  in: z.lazy(() => FinetunedStateSchema).array().optional(),
  notIn: z.lazy(() => FinetunedStateSchema).array().optional(),
  not: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => NestedEnumFinetunedStateFilterSchema) ]).optional(),
}).strict();

export const PromptLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromptLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  inputId: z.lazy(() => SortOrderSchema).optional(),
  environment: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  completion: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  llmConfig: z.lazy(() => SortOrderSchema).optional(),
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional(),
  extras: z.lazy(() => SortOrderSchema).optional(),
  labelledState: z.lazy(() => SortOrderSchema).optional(),
  finetunedState: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PromptLogAvgOrderByAggregateInput> = z.object({
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromptLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  inputId: z.lazy(() => SortOrderSchema).optional(),
  environment: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  completion: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional(),
  labelledState: z.lazy(() => SortOrderSchema).optional(),
  finetunedState: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromptLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  inputId: z.lazy(() => SortOrderSchema).optional(),
  environment: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  completion: z.lazy(() => SortOrderSchema).optional(),
  llmProvider: z.lazy(() => SortOrderSchema).optional(),
  llmModel: z.lazy(() => SortOrderSchema).optional(),
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional(),
  labelledState: z.lazy(() => SortOrderSchema).optional(),
  finetunedState: z.lazy(() => SortOrderSchema).optional(),
  promptPackageId: z.lazy(() => SortOrderSchema).optional(),
  promptTemplateId: z.lazy(() => SortOrderSchema).optional(),
  promptVersionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromptLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.PromptLogSumOrderByAggregateInput> = z.object({
  latency: z.lazy(() => SortOrderSchema).optional(),
  prompt_tokens: z.lazy(() => SortOrderSchema).optional(),
  completion_tokens: z.lazy(() => SortOrderSchema).optional(),
  total_tokens: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPromptEnvironmentWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPromptEnvironmentWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PromptEnvironmentSchema).optional(),
  in: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  notIn: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  not: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => NestedEnumPromptEnvironmentWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPromptEnvironmentFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPromptEnvironmentFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumLabelledStateWithAggregatesFilterSchema: z.ZodType<Prisma.EnumLabelledStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LabelledStateSchema).optional(),
  in: z.lazy(() => LabelledStateSchema).array().optional(),
  notIn: z.lazy(() => LabelledStateSchema).array().optional(),
  not: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => NestedEnumLabelledStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLabelledStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLabelledStateFilterSchema).optional()
}).strict();

export const EnumFinetunedStateWithAggregatesFilterSchema: z.ZodType<Prisma.EnumFinetunedStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FinetunedStateSchema).optional(),
  in: z.lazy(() => FinetunedStateSchema).array().optional(),
  notIn: z.lazy(() => FinetunedStateSchema).array().optional(),
  not: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => NestedEnumFinetunedStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFinetunedStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFinetunedStateFilterSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const PromptPackageCreateNestedOneWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageCreateNestedOneWithoutPromptVariablesInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateCreateNestedOneWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateCreateNestedOneWithoutPromptVariablesInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const PromptVersionCreateNestedOneWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedOneWithoutPromptVariablesInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional()
}).strict();

export const PromptPackageUpdateOneRequiredWithoutPromptVariablesNestedInputSchema: z.ZodType<Prisma.PromptPackageUpdateOneRequiredWithoutPromptVariablesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  upsert: z.lazy(() => PromptPackageUpsertWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptPackageUpdateToOneWithWhereWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVariablesInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUpdateOneRequiredWithoutPromptVariablesNestedInputSchema: z.ZodType<Prisma.PromptTemplateUpdateOneRequiredWithoutPromptVariablesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPromptVariablesInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateOneRequiredWithoutPromptVariablesNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateOneRequiredWithoutPromptVariablesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptVariablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutPromptVariablesInputSchema).optional(),
  upsert: z.lazy(() => PromptVersionUpsertWithoutPromptVariablesInputSchema).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateToOneWithWhereWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptVariablesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPromptPackagesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptPackagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPromptPackagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptTemplateCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptTemplateCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptPackageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumPackageVisibilityFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPackageVisibilityFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PackageVisibilitySchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutPromptPackagesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPromptPackagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptPackagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPromptPackagesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPromptPackagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPromptPackagesInputSchema),z.lazy(() => UserUpdateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptPackagesInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptTemplateUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptTemplateCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptTemplateUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptTemplateScalarWhereInputSchema),z.lazy(() => PromptTemplateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptTemplateCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptTemplateWhereUniqueInputSchema),z.lazy(() => PromptTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptTemplateUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptTemplateScalarWhereInputSchema),z.lazy(() => PromptTemplateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptPackageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptPackageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptPackageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageCreateNestedOneWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageCreateNestedOneWithoutTemplatesInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutTemplatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutTemplatesInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional()
}).strict();

export const PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedOneWithoutPreviewVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional()
}).strict();

export const PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedOneWithoutReleaseVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional()
}).strict();

export const PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesCreateNestedManyWithoutPromptTemplateInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedManyWithoutPromptTemplateInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema: z.ZodType<Prisma.PromptPackageUpdateOneRequiredWithoutTemplatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutTemplatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutTemplatesInputSchema).optional(),
  upsert: z.lazy(() => PromptPackageUpsertWithoutTemplatesInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptPackageUpdateToOneWithWhereWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUpdateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutTemplatesInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateOneWithoutPreviewVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptVersionUpsertWithoutPreviewVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateToOneWithWhereWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPreviewVersionInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateOneWithoutReleaseVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptVersionCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptVersionUpsertWithoutReleaseVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptVersionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptVersionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateToOneWithWhereWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutReleaseVersionInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithoutPromptTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithoutPromptTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyPromptTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutPromptTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionCreateinputFieldsInputSchema: z.ZodType<Prisma.PromptVersionCreateinputFieldsInput> = z.object({
  set: z.string().array()
}).strict();

export const PromptVersionCreatetemplateFieldsInputSchema: z.ZodType<Prisma.PromptVersionCreatetemplateFieldsInput> = z.object({
  set: z.string().array()
}).strict();

export const PromptVersionCreatelangInputSchema: z.ZodType<Prisma.PromptVersionCreatelangInput> = z.object({
  set: z.string().array()
}).strict();

export const PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateNestedOneWithoutPreviewVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateNestedOneWithoutReleaseVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesCreateNestedManyWithoutPromptVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptVersionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageCreateNestedOneWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageCreateNestedOneWithoutPromptVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutPromptVersionInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateCreateNestedOneWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateCreateNestedOneWithoutVersionsInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutVersionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutVersionsInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPromptVersionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPromptVersionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional()
}).strict();

export const PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptVersionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUpdateinputFieldsInputSchema: z.ZodType<Prisma.PromptVersionUpdateinputFieldsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const PromptVersionUpdatetemplateFieldsInputSchema: z.ZodType<Prisma.PromptVersionUpdatetemplateFieldsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const PromptVersionUpdatelangInputSchema: z.ZodType<Prisma.PromptVersionUpdatelangInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema: z.ZodType<Prisma.PromptTemplateUpdateOneWithoutPreviewVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutPreviewVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPreviewVersionInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema: z.ZodType<Prisma.PromptTemplateUpdateOneWithoutReleaseVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutReleaseVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutReleaseVersionInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithoutPromptVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptVersionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptVersionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema: z.ZodType<Prisma.PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptPackageCreateOrConnectWithoutPromptVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptPackageUpsertWithoutPromptVersionInputSchema).optional(),
  connect: z.lazy(() => PromptPackageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptPackageUpdateToOneWithWhereWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUpdateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVersionInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema: z.ZodType<Prisma.PromptTemplateUpdateOneRequiredWithoutVersionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutVersionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutVersionsInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutVersionsInputSchema).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUpdateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutVersionsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPromptVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPromptVersionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPromptVersionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPromptVersionInputSchema),z.lazy(() => UserUpdateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptVersionInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutPreviewVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutPreviewVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPreviewVersionInputSchema) ]).optional(),
}).strict();

export const PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromptTemplateCreateOrConnectWithoutReleaseVersionInputSchema).optional(),
  upsert: z.lazy(() => PromptTemplateUpsertWithoutReleaseVersionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromptTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromptTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromptTemplateUpdateToOneWithWhereWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutReleaseVersionInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema).array(),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVariablesCreateManyPromptVersionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVariablesWhereUniqueInputSchema),z.lazy(() => PromptVariablesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUpdateManyWithWhereWithoutPromptVersionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageCreateWithoutUserInputSchema).array(),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptPackageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionCreateWithoutUserInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageCreateWithoutUserInputSchema).array(),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptPackageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionCreateWithoutUserInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PromptPackageUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageCreateWithoutUserInputSchema).array(),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptPackageUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptPackageUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptPackageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptPackageUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptPackageUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptPackageUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PromptPackageUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptPackageScalarWhereInputSchema),z.lazy(() => PromptPackageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionCreateWithoutUserInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptPackageUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageCreateWithoutUserInputSchema).array(),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptPackageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptPackageUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptPackageUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptPackageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptPackageWhereUniqueInputSchema),z.lazy(() => PromptPackageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptPackageUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptPackageUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptPackageUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PromptPackageUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptPackageScalarWhereInputSchema),z.lazy(() => PromptPackageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionCreateWithoutUserInputSchema).array(),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema),z.lazy(() => PromptVersionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptVersionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PromptVersionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PromptVersionWhereUniqueInputSchema),z.lazy(() => PromptVersionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PromptVersionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PromptVersionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PromptVersionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EnumPromptEnvironmentFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPromptEnvironmentFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PromptEnvironmentSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumLabelledStateFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumLabelledStateFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => LabelledStateSchema).optional()
}).strict();

export const EnumFinetunedStateFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumFinetunedStateFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => FinetunedStateSchema).optional()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValue.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: InputJsonValue.optional()
}).strict();

export const NestedEnumPackageVisibilityFilterSchema: z.ZodType<Prisma.NestedEnumPackageVisibilityFilter> = z.object({
  equals: z.lazy(() => PackageVisibilitySchema).optional(),
  in: z.lazy(() => PackageVisibilitySchema).array().optional(),
  notIn: z.lazy(() => PackageVisibilitySchema).array().optional(),
  not: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => NestedEnumPackageVisibilityFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPackageVisibilityWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPackageVisibilityWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PackageVisibilitySchema).optional(),
  in: z.lazy(() => PackageVisibilitySchema).array().optional(),
  notIn: z.lazy(() => PackageVisibilitySchema).array().optional(),
  not: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => NestedEnumPackageVisibilityWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPackageVisibilityFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPackageVisibilityFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumPromptEnvironmentFilterSchema: z.ZodType<Prisma.NestedEnumPromptEnvironmentFilter> = z.object({
  equals: z.lazy(() => PromptEnvironmentSchema).optional(),
  in: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  notIn: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  not: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => NestedEnumPromptEnvironmentFilterSchema) ]).optional(),
}).strict();

export const NestedEnumLabelledStateFilterSchema: z.ZodType<Prisma.NestedEnumLabelledStateFilter> = z.object({
  equals: z.lazy(() => LabelledStateSchema).optional(),
  in: z.lazy(() => LabelledStateSchema).array().optional(),
  notIn: z.lazy(() => LabelledStateSchema).array().optional(),
  not: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => NestedEnumLabelledStateFilterSchema) ]).optional(),
}).strict();

export const NestedEnumFinetunedStateFilterSchema: z.ZodType<Prisma.NestedEnumFinetunedStateFilter> = z.object({
  equals: z.lazy(() => FinetunedStateSchema).optional(),
  in: z.lazy(() => FinetunedStateSchema).array().optional(),
  notIn: z.lazy(() => FinetunedStateSchema).array().optional(),
  not: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => NestedEnumFinetunedStateFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPromptEnvironmentWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPromptEnvironmentWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PromptEnvironmentSchema).optional(),
  in: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  notIn: z.lazy(() => PromptEnvironmentSchema).array().optional(),
  not: z.union([ z.lazy(() => PromptEnvironmentSchema),z.lazy(() => NestedEnumPromptEnvironmentWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPromptEnvironmentFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPromptEnvironmentFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumLabelledStateWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumLabelledStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LabelledStateSchema).optional(),
  in: z.lazy(() => LabelledStateSchema).array().optional(),
  notIn: z.lazy(() => LabelledStateSchema).array().optional(),
  not: z.union([ z.lazy(() => LabelledStateSchema),z.lazy(() => NestedEnumLabelledStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLabelledStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLabelledStateFilterSchema).optional()
}).strict();

export const NestedEnumFinetunedStateWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumFinetunedStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FinetunedStateSchema).optional(),
  in: z.lazy(() => FinetunedStateSchema).array().optional(),
  notIn: z.lazy(() => FinetunedStateSchema).array().optional(),
  not: z.union([ z.lazy(() => FinetunedStateSchema),z.lazy(() => NestedEnumFinetunedStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFinetunedStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFinetunedStateFilterSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackages: z.lazy(() => PromptPackageCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackages: z.lazy(() => PromptPackageUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const PromptPackageCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPromptPackagesInputSchema),
  templates: z.lazy(() => PromptTemplateCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUncheckedCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  templates: z.lazy(() => PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageCreateOrConnectWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageCreateOrConnectWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptTemplateCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutTemplatesInputSchema),
  previewVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  versions: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  versions: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateCreateOrConnectWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateCreateOrConnectWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptVersionCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutPromptVariablesInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptPackageUpsertWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageUpsertWithoutPromptVariablesInput> = z.object({
  update: z.union([ z.lazy(() => PromptPackageUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVariablesInputSchema) ]),
  where: z.lazy(() => PromptPackageWhereInputSchema).optional()
}).strict();

export const PromptPackageUpdateToOneWithWhereWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageUpdateToOneWithWhereWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptPackageUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptPackageUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPromptPackagesNestedInputSchema).optional(),
  templates: z.lazy(() => PromptTemplateUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptTemplateUpsertWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateUpsertWithoutPromptVariablesInput> = z.object({
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptVariablesInputSchema) ]),
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptTemplateUpdateToOneWithWhereWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateUpdateToOneWithWhereWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptTemplateUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema).optional(),
  previewVersion: z.lazy(() => PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  versions: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptVersionUpsertWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithoutPromptVariablesInput> = z.object({
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptVariablesInputSchema) ]),
  where: z.lazy(() => PromptVersionWhereInputSchema).optional()
}).strict();

export const PromptVersionUpdateToOneWithWhereWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionUpdateToOneWithWhereWithoutPromptVariablesInput> = z.object({
  where: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptVariablesInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptVariablesInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutPromptVariablesInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutPromptVariablesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserCreateWithoutPromptPackagesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPromptPackagesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPromptPackagesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptPackagesInputSchema) ]),
}).strict();

export const PromptTemplateCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateCreateOrConnectWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateCreateOrConnectWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptTemplateCreateManyPromptPackageInputEnvelopeSchema: z.ZodType<Prisma.PromptTemplateCreateManyPromptPackageInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptTemplateCreateManyPromptPackageInputSchema),z.lazy(() => PromptTemplateCreateManyPromptPackageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptVariablesCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutPromptVariablesInputSchema),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPromptVariablesInputSchema)
}).strict();

export const PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesCreateOrConnectWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesCreateOrConnectWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVariablesCreateManyPromptPackageInputEnvelopeSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptPackageInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVariablesCreateManyPromptPackageInputSchema),z.lazy(() => PromptVariablesCreateManyPromptPackageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptVersionCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVersionCreateManyPromptPackageInputEnvelopeSchema: z.ZodType<Prisma.PromptVersionCreateManyPromptPackageInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVersionCreateManyPromptPackageInputSchema),z.lazy(() => PromptVersionCreateManyPromptPackageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserUpsertWithoutPromptPackagesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptPackagesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptPackagesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPromptPackagesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPromptPackagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptPackagesInputSchema) ]),
}).strict();

export const UserUpdateWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserUpdateWithoutPromptPackagesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPromptPackagesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPromptPackagesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUpsertWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPromptPackageInputSchema) ]),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptTemplateUpdateManyWithWhereWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUpdateManyWithWhereWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptTemplateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptTemplateUpdateManyMutationInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateManyWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptTemplateScalarWhereInputSchema: z.ZodType<Prisma.PromptTemplateScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptTemplateScalarWhereInputSchema),z.lazy(() => PromptTemplateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptTemplateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptTemplateScalarWhereInputSchema),z.lazy(() => PromptTemplateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  previewVersionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  releaseVersionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUpsertWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptPackageInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVariablesUpdateManyWithWhereWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithWhereWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVariablesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateManyMutationInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVariablesScalarWhereInputSchema: z.ZodType<Prisma.PromptVariablesScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVariablesScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVariablesScalarWhereInputSchema),z.lazy(() => PromptVariablesScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptVersionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  majorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minorVersion: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  variables: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptPackageInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithWhereUniqueWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptPackageInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVersionUpdateManyWithWhereWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithWhereWithoutPromptPackageInput> = z.object({
  where: z.lazy(() => PromptVersionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateManyMutationInputSchema),z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptPackageInputSchema) ]),
}).strict();

export const PromptVersionScalarWhereInputSchema: z.ZodType<Prisma.PromptVersionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptVersionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptVersionScalarWhereInputSchema),z.lazy(() => PromptVersionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  template: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  templateFields: z.lazy(() => StringNullableListFilterSchema).optional(),
  llmProvider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmModel: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmConfig: z.lazy(() => JsonFilterSchema).optional(),
  lang: z.lazy(() => StringNullableListFilterSchema).optional(),
  changelog: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  outAccuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outLatency: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  outCost: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  promptPackageId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promptTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptPackageCreateWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageCreateWithoutTemplatesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPromptPackagesInputSchema),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUncheckedCreateWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateWithoutTemplatesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageCreateOrConnectWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageCreateOrConnectWithoutTemplatesInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutTemplatesInputSchema) ]),
}).strict();

export const PromptVersionCreateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutPreviewVersionInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutPreviewVersionInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutPreviewVersionInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPreviewVersionInputSchema) ]),
}).strict();

export const PromptVersionCreateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutReleaseVersionInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutReleaseVersionInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutReleaseVersionInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutReleaseVersionInputSchema) ]),
}).strict();

export const PromptVariablesCreateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesCreateWithoutPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVariablesInputSchema),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPromptVariablesInputSchema)
}).strict();

export const PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateWithoutPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesCreateOrConnectWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesCreateOrConnectWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVariablesCreateManyPromptTemplateInputEnvelopeSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptTemplateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVariablesCreateManyPromptTemplateInputSchema),z.lazy(() => PromptVariablesCreateManyPromptTemplateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptVersionCreateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutPromptVersionInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVersionCreateManyPromptTemplateInputEnvelopeSchema: z.ZodType<Prisma.PromptVersionCreateManyPromptTemplateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVersionCreateManyPromptTemplateInputSchema),z.lazy(() => PromptVersionCreateManyPromptTemplateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptPackageUpsertWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageUpsertWithoutTemplatesInput> = z.object({
  update: z.union([ z.lazy(() => PromptPackageUpdateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutTemplatesInputSchema) ]),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutTemplatesInputSchema) ]),
  where: z.lazy(() => PromptPackageWhereInputSchema).optional()
}).strict();

export const PromptPackageUpdateToOneWithWhereWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageUpdateToOneWithWhereWithoutTemplatesInput> = z.object({
  where: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptPackageUpdateWithoutTemplatesInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutTemplatesInputSchema) ]),
}).strict();

export const PromptPackageUpdateWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageUpdateWithoutTemplatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPromptPackagesNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateWithoutTemplatesInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateWithoutTemplatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptVersionUpsertWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithoutPreviewVersionInput> = z.object({
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPreviewVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPreviewVersionInputSchema) ]),
  where: z.lazy(() => PromptVersionWhereInputSchema).optional()
}).strict();

export const PromptVersionUpdateToOneWithWhereWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionUpdateToOneWithWhereWithoutPreviewVersionInput> = z.object({
  where: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPreviewVersionInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutPreviewVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutPreviewVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUpsertWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithoutReleaseVersionInput> = z.object({
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutReleaseVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutReleaseVersionInputSchema) ]),
  where: z.lazy(() => PromptVersionWhereInputSchema).optional()
}).strict();

export const PromptVersionUpdateToOneWithWhereWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionUpdateToOneWithWhereWithoutReleaseVersionInput> = z.object({
  where: z.lazy(() => PromptVersionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutReleaseVersionInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutReleaseVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutReleaseVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUpsertWithWhereUniqueWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptTemplateInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithWhereUniqueWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithWhereWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVariablesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateManyMutationInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithWhereUniqueWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptTemplateInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithWhereUniqueWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutPromptTemplateInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptVersionUpdateManyWithWhereWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithWhereWithoutPromptTemplateInput> = z.object({
  where: z.lazy(() => PromptVersionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateManyMutationInputSchema),z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateInputSchema) ]),
}).strict();

export const PromptTemplateCreateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateWithoutPreviewVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutTemplatesInputSchema),
  releaseVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateWithoutPreviewVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateCreateOrConnectWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateOrConnectWithoutPreviewVersionInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]),
}).strict();

export const PromptTemplateCreateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateWithoutReleaseVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutTemplatesInputSchema),
  previewVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateWithoutReleaseVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateCreateOrConnectWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateCreateOrConnectWithoutReleaseVersionInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]),
}).strict();

export const PromptVariablesCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVariablesInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutPromptVariablesInputSchema)
}).strict();

export const PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesCreateOrConnectWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesCreateOrConnectWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptVariablesCreateManyPromptVersionInputEnvelopeSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptVersionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVariablesCreateManyPromptVersionInputSchema),z.lazy(() => PromptVariablesCreateManyPromptVersionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptPackageCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPromptPackagesInputSchema),
  templates: z.lazy(() => PromptTemplateCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUncheckedCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  templates: z.lazy(() => PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageCreateOrConnectWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageCreateOrConnectWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptTemplateCreateWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateCreateWithoutVersionsInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutTemplatesInputSchema),
  previewVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedCreateWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedCreateWithoutVersionsInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptTemplateInputSchema).optional()
}).strict();

export const PromptTemplateCreateOrConnectWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateCreateOrConnectWithoutVersionsInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutVersionsInputSchema) ]),
}).strict();

export const UserCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptTemplateUpsertWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpsertWithoutPreviewVersionInput> = z.object({
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPreviewVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutPreviewVersionInputSchema) ]),
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptTemplateUpdateToOneWithWhereWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpdateToOneWithWhereWithoutPreviewVersionInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptTemplateUpdateWithoutPreviewVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutPreviewVersionInputSchema) ]),
}).strict();

export const PromptTemplateUpdateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithoutPreviewVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateWithoutPreviewVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateWithoutPreviewVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUpsertWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpsertWithoutReleaseVersionInput> = z.object({
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutReleaseVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutReleaseVersionInputSchema) ]),
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptTemplateUpdateToOneWithWhereWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpdateToOneWithWhereWithoutReleaseVersionInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptTemplateUpdateWithoutReleaseVersionInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutReleaseVersionInputSchema) ]),
}).strict();

export const PromptTemplateUpdateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithoutReleaseVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema).optional(),
  previewVersion: z.lazy(() => PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateWithoutReleaseVersionInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateWithoutReleaseVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUpsertWithWhereUniqueWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVariablesCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedCreateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithWhereUniqueWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptVariablesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateWithoutPromptVersionInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptVariablesUpdateManyWithWhereWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUpdateManyWithWhereWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptVariablesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVariablesUpdateManyMutationInputSchema),z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptPackageUpsertWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageUpsertWithoutPromptVersionInput> = z.object({
  update: z.union([ z.lazy(() => PromptPackageUpdateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVersionInputSchema) ]),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutPromptVersionInputSchema) ]),
  where: z.lazy(() => PromptPackageWhereInputSchema).optional()
}).strict();

export const PromptPackageUpdateToOneWithWhereWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageUpdateToOneWithWhereWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => PromptPackageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptPackageUpdateWithoutPromptVersionInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutPromptVersionInputSchema) ]),
}).strict();

export const PromptPackageUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPromptPackagesNestedInputSchema).optional(),
  templates: z.lazy(() => PromptTemplateUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptTemplateUpsertWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateUpsertWithoutVersionsInput> = z.object({
  update: z.union([ z.lazy(() => PromptTemplateUpdateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutVersionsInputSchema) ]),
  create: z.union([ z.lazy(() => PromptTemplateCreateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedCreateWithoutVersionsInputSchema) ]),
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional()
}).strict();

export const PromptTemplateUpdateToOneWithWhereWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateUpdateToOneWithWhereWithoutVersionsInput> = z.object({
  where: z.lazy(() => PromptTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromptTemplateUpdateWithoutVersionsInputSchema),z.lazy(() => PromptTemplateUncheckedUpdateWithoutVersionsInputSchema) ]),
}).strict();

export const PromptTemplateUpdateWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithoutVersionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutTemplatesNestedInputSchema).optional(),
  previewVersion: z.lazy(() => PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateWithoutVersionsInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateWithoutVersionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserUpsertWithoutPromptVersionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptVersionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedCreateWithoutPromptVersionInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPromptVersionInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPromptVersionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPromptVersionInputSchema) ]),
}).strict();

export const UserUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  promptPackages: z.lazy(() => PromptPackageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptPackageCreateWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  templates: z.lazy(() => PromptTemplateCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  templates: z.lazy(() => PromptTemplateUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedCreateNestedManyWithoutPromptPackageInputSchema).optional()
}).strict();

export const PromptPackageCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PromptPackageCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PromptPackageCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptPackageCreateManyUserInputSchema),z.lazy(() => PromptPackageCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromptVersionCreateWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesCreateNestedManyWithoutPromptVersionInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageCreateNestedOneWithoutPromptVersionInputSchema),
  promptTemplate: z.lazy(() => PromptTemplateCreateNestedOneWithoutVersionsInputSchema)
}).strict();

export const PromptVersionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutPreviewVersionInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedCreateNestedOneWithoutReleaseVersionInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedCreateNestedManyWithoutPromptVersionInputSchema).optional()
}).strict();

export const PromptVersionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PromptVersionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PromptVersionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PromptVersionCreateManyUserInputSchema),z.lazy(() => PromptVersionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptPackageUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptPackageUpdateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PromptPackageCreateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PromptPackageUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PromptPackageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptPackageUpdateWithoutUserInputSchema),z.lazy(() => PromptPackageUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PromptPackageUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PromptPackageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptPackageUpdateManyMutationInputSchema),z.lazy(() => PromptPackageUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const PromptPackageScalarWhereInputSchema: z.ZodType<Prisma.PromptPackageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromptPackageScalarWhereInputSchema),z.lazy(() => PromptPackageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromptPackageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromptPackageScalarWhereInputSchema),z.lazy(() => PromptPackageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  visibility: z.union([ z.lazy(() => EnumPackageVisibilityFilterSchema),z.lazy(() => PackageVisibilitySchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptVersionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PromptVersionUpdateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PromptVersionCreateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PromptVersionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PromptVersionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateWithoutUserInputSchema),z.lazy(() => PromptVersionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PromptVersionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PromptVersionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PromptVersionUpdateManyMutationInputSchema),z.lazy(() => PromptVersionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PromptTemplateCreateManyPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateCreateManyPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  previewVersionId: z.string().optional().nullable(),
  releaseVersionId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesCreateManyPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVersionCreateManyPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionCreateManyPromptPackageInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptTemplateUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptVersionUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptVersionUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional(),
  versions: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptTemplateNestedInputSchema).optional()
}).strict();

export const PromptTemplateUncheckedUpdateManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptTemplateUncheckedUpdateManyWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  releaseVersionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional()
}).strict();

export const PromptVariablesUncheckedUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutPromptPackageInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutPromptPackageInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesCreateManyPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptVersionId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVersionCreateManyPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionCreateManyPromptTemplateInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  userId: z.string(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesUpdateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional()
}).strict();

export const PromptVariablesUncheckedUpdateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptVersionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutPromptTemplateInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutPromptTemplateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesCreateManyPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesCreateManyPromptVersionInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  name: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVariablesUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutPromptVariablesNestedInputSchema).optional()
}).strict();

export const PromptVariablesUncheckedUpdateWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVariablesUncheckedUpdateManyWithoutPromptVersionInputSchema: z.ZodType<Prisma.PromptVariablesUncheckedUpdateManyWithoutPromptVersionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  majorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minorVersion: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  variables: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptPackageCreateManyUserInputSchema: z.ZodType<Prisma.PromptPackageCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  visibility: z.lazy(() => PackageVisibilitySchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PromptVersionCreateManyUserInputSchema: z.ZodType<Prisma.PromptVersionCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  forkedFromId: z.string().optional().nullable(),
  version: z.string(),
  template: z.string(),
  inputFields: z.union([ z.lazy(() => PromptVersionCreateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionCreatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]),
  lang: z.union([ z.lazy(() => PromptVersionCreatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  outAccuracy: z.number().optional().nullable(),
  outLatency: z.number().optional().nullable(),
  outCost: z.number().optional().nullable(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptPackageUpdateWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  templates: z.lazy(() => PromptTemplateUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional(),
  PromptVersion: z.lazy(() => PromptVersionUncheckedUpdateManyWithoutPromptPackageNestedInputSchema).optional()
}).strict();

export const PromptPackageUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PromptPackageUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  visibility: z.union([ z.lazy(() => PackageVisibilitySchema),z.lazy(() => EnumPackageVisibilityFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromptVersionUpdateWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUpdateManyWithoutPromptVersionNestedInputSchema).optional(),
  promptPackage: z.lazy(() => PromptPackageUpdateOneRequiredWithoutPromptVersionNestedInputSchema).optional(),
  promptTemplate: z.lazy(() => PromptTemplateUpdateOneRequiredWithoutVersionsNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  previewVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutPreviewVersionNestedInputSchema).optional(),
  releaseVersion: z.lazy(() => PromptTemplateUncheckedUpdateOneWithoutReleaseVersionNestedInputSchema).optional(),
  PromptVariables: z.lazy(() => PromptVariablesUncheckedUpdateManyWithoutPromptVersionNestedInputSchema).optional()
}).strict();

export const PromptVersionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PromptVersionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  template: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputFields: z.union([ z.lazy(() => PromptVersionUpdateinputFieldsInputSchema),z.string().array() ]).optional(),
  templateFields: z.union([ z.lazy(() => PromptVersionUpdatetemplateFieldsInputSchema),z.string().array() ]).optional(),
  llmProvider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmModel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmConfig: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValue ]).optional(),
  lang: z.union([ z.lazy(() => PromptVersionUpdatelangInputSchema),z.string().array() ]).optional(),
  changelog: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outLatency: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outCost: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promptPackageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promptTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const PromptVariablesFindFirstArgsSchema: z.ZodType<Prisma.PromptVariablesFindFirstArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereInputSchema.optional(),
  orderBy: z.union([ PromptVariablesOrderByWithRelationInputSchema.array(),PromptVariablesOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVariablesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVariablesScalarFieldEnumSchema,PromptVariablesScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVariablesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromptVariablesFindFirstOrThrowArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereInputSchema.optional(),
  orderBy: z.union([ PromptVariablesOrderByWithRelationInputSchema.array(),PromptVariablesOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVariablesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVariablesScalarFieldEnumSchema,PromptVariablesScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVariablesFindManyArgsSchema: z.ZodType<Prisma.PromptVariablesFindManyArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereInputSchema.optional(),
  orderBy: z.union([ PromptVariablesOrderByWithRelationInputSchema.array(),PromptVariablesOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVariablesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVariablesScalarFieldEnumSchema,PromptVariablesScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVariablesAggregateArgsSchema: z.ZodType<Prisma.PromptVariablesAggregateArgs> = z.object({
  where: PromptVariablesWhereInputSchema.optional(),
  orderBy: z.union([ PromptVariablesOrderByWithRelationInputSchema.array(),PromptVariablesOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVariablesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptVariablesGroupByArgsSchema: z.ZodType<Prisma.PromptVariablesGroupByArgs> = z.object({
  where: PromptVariablesWhereInputSchema.optional(),
  orderBy: z.union([ PromptVariablesOrderByWithAggregationInputSchema.array(),PromptVariablesOrderByWithAggregationInputSchema ]).optional(),
  by: PromptVariablesScalarFieldEnumSchema.array(),
  having: PromptVariablesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptVariablesFindUniqueArgsSchema: z.ZodType<Prisma.PromptVariablesFindUniqueArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereUniqueInputSchema,
}).strict()

export const PromptVariablesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromptVariablesFindUniqueOrThrowArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereUniqueInputSchema,
}).strict()

export const PromptPackageFindFirstArgsSchema: z.ZodType<Prisma.PromptPackageFindFirstArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereInputSchema.optional(),
  orderBy: z.union([ PromptPackageOrderByWithRelationInputSchema.array(),PromptPackageOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptPackageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptPackageScalarFieldEnumSchema,PromptPackageScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptPackageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromptPackageFindFirstOrThrowArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereInputSchema.optional(),
  orderBy: z.union([ PromptPackageOrderByWithRelationInputSchema.array(),PromptPackageOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptPackageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptPackageScalarFieldEnumSchema,PromptPackageScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptPackageFindManyArgsSchema: z.ZodType<Prisma.PromptPackageFindManyArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereInputSchema.optional(),
  orderBy: z.union([ PromptPackageOrderByWithRelationInputSchema.array(),PromptPackageOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptPackageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptPackageScalarFieldEnumSchema,PromptPackageScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptPackageAggregateArgsSchema: z.ZodType<Prisma.PromptPackageAggregateArgs> = z.object({
  where: PromptPackageWhereInputSchema.optional(),
  orderBy: z.union([ PromptPackageOrderByWithRelationInputSchema.array(),PromptPackageOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptPackageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptPackageGroupByArgsSchema: z.ZodType<Prisma.PromptPackageGroupByArgs> = z.object({
  where: PromptPackageWhereInputSchema.optional(),
  orderBy: z.union([ PromptPackageOrderByWithAggregationInputSchema.array(),PromptPackageOrderByWithAggregationInputSchema ]).optional(),
  by: PromptPackageScalarFieldEnumSchema.array(),
  having: PromptPackageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptPackageFindUniqueArgsSchema: z.ZodType<Prisma.PromptPackageFindUniqueArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereUniqueInputSchema,
}).strict()

export const PromptPackageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromptPackageFindUniqueOrThrowArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereUniqueInputSchema,
}).strict()

export const PromptTemplateFindFirstArgsSchema: z.ZodType<Prisma.PromptTemplateFindFirstArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereInputSchema.optional(),
  orderBy: z.union([ PromptTemplateOrderByWithRelationInputSchema.array(),PromptTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptTemplateScalarFieldEnumSchema,PromptTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromptTemplateFindFirstOrThrowArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereInputSchema.optional(),
  orderBy: z.union([ PromptTemplateOrderByWithRelationInputSchema.array(),PromptTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptTemplateScalarFieldEnumSchema,PromptTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptTemplateFindManyArgsSchema: z.ZodType<Prisma.PromptTemplateFindManyArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereInputSchema.optional(),
  orderBy: z.union([ PromptTemplateOrderByWithRelationInputSchema.array(),PromptTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptTemplateScalarFieldEnumSchema,PromptTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptTemplateAggregateArgsSchema: z.ZodType<Prisma.PromptTemplateAggregateArgs> = z.object({
  where: PromptTemplateWhereInputSchema.optional(),
  orderBy: z.union([ PromptTemplateOrderByWithRelationInputSchema.array(),PromptTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptTemplateGroupByArgsSchema: z.ZodType<Prisma.PromptTemplateGroupByArgs> = z.object({
  where: PromptTemplateWhereInputSchema.optional(),
  orderBy: z.union([ PromptTemplateOrderByWithAggregationInputSchema.array(),PromptTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: PromptTemplateScalarFieldEnumSchema.array(),
  having: PromptTemplateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptTemplateFindUniqueArgsSchema: z.ZodType<Prisma.PromptTemplateFindUniqueArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereUniqueInputSchema,
}).strict()

export const PromptTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromptTemplateFindUniqueOrThrowArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereUniqueInputSchema,
}).strict()

export const PromptVersionFindFirstArgsSchema: z.ZodType<Prisma.PromptVersionFindFirstArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereInputSchema.optional(),
  orderBy: z.union([ PromptVersionOrderByWithRelationInputSchema.array(),PromptVersionOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVersionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVersionScalarFieldEnumSchema,PromptVersionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVersionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromptVersionFindFirstOrThrowArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereInputSchema.optional(),
  orderBy: z.union([ PromptVersionOrderByWithRelationInputSchema.array(),PromptVersionOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVersionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVersionScalarFieldEnumSchema,PromptVersionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVersionFindManyArgsSchema: z.ZodType<Prisma.PromptVersionFindManyArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereInputSchema.optional(),
  orderBy: z.union([ PromptVersionOrderByWithRelationInputSchema.array(),PromptVersionOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVersionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptVersionScalarFieldEnumSchema,PromptVersionScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptVersionAggregateArgsSchema: z.ZodType<Prisma.PromptVersionAggregateArgs> = z.object({
  where: PromptVersionWhereInputSchema.optional(),
  orderBy: z.union([ PromptVersionOrderByWithRelationInputSchema.array(),PromptVersionOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptVersionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptVersionGroupByArgsSchema: z.ZodType<Prisma.PromptVersionGroupByArgs> = z.object({
  where: PromptVersionWhereInputSchema.optional(),
  orderBy: z.union([ PromptVersionOrderByWithAggregationInputSchema.array(),PromptVersionOrderByWithAggregationInputSchema ]).optional(),
  by: PromptVersionScalarFieldEnumSchema.array(),
  having: PromptVersionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptVersionFindUniqueArgsSchema: z.ZodType<Prisma.PromptVersionFindUniqueArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereUniqueInputSchema,
}).strict()

export const PromptVersionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromptVersionFindUniqueOrThrowArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereUniqueInputSchema,
}).strict()

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict()

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict()

export const PromptLogFindFirstArgsSchema: z.ZodType<Prisma.PromptLogFindFirstArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereInputSchema.optional(),
  orderBy: z.union([ PromptLogOrderByWithRelationInputSchema.array(),PromptLogOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptLogScalarFieldEnumSchema,PromptLogScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromptLogFindFirstOrThrowArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereInputSchema.optional(),
  orderBy: z.union([ PromptLogOrderByWithRelationInputSchema.array(),PromptLogOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptLogScalarFieldEnumSchema,PromptLogScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptLogFindManyArgsSchema: z.ZodType<Prisma.PromptLogFindManyArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereInputSchema.optional(),
  orderBy: z.union([ PromptLogOrderByWithRelationInputSchema.array(),PromptLogOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromptLogScalarFieldEnumSchema,PromptLogScalarFieldEnumSchema.array() ]).optional(),
}).strict()

export const PromptLogAggregateArgsSchema: z.ZodType<Prisma.PromptLogAggregateArgs> = z.object({
  where: PromptLogWhereInputSchema.optional(),
  orderBy: z.union([ PromptLogOrderByWithRelationInputSchema.array(),PromptLogOrderByWithRelationInputSchema ]).optional(),
  cursor: PromptLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptLogGroupByArgsSchema: z.ZodType<Prisma.PromptLogGroupByArgs> = z.object({
  where: PromptLogWhereInputSchema.optional(),
  orderBy: z.union([ PromptLogOrderByWithAggregationInputSchema.array(),PromptLogOrderByWithAggregationInputSchema ]).optional(),
  by: PromptLogScalarFieldEnumSchema.array(),
  having: PromptLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PromptLogFindUniqueArgsSchema: z.ZodType<Prisma.PromptLogFindUniqueArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereUniqueInputSchema,
}).strict()

export const PromptLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromptLogFindUniqueOrThrowArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereUniqueInputSchema,
}).strict()

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict()

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict()

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict()

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict()

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict()

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict()

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict()

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict()

export const PromptVariablesCreateArgsSchema: z.ZodType<Prisma.PromptVariablesCreateArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  data: z.union([ PromptVariablesCreateInputSchema,PromptVariablesUncheckedCreateInputSchema ]),
}).strict()

export const PromptVariablesUpsertArgsSchema: z.ZodType<Prisma.PromptVariablesUpsertArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereUniqueInputSchema,
  create: z.union([ PromptVariablesCreateInputSchema,PromptVariablesUncheckedCreateInputSchema ]),
  update: z.union([ PromptVariablesUpdateInputSchema,PromptVariablesUncheckedUpdateInputSchema ]),
}).strict()

export const PromptVariablesCreateManyArgsSchema: z.ZodType<Prisma.PromptVariablesCreateManyArgs> = z.object({
  data: z.union([ PromptVariablesCreateManyInputSchema,PromptVariablesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PromptVariablesDeleteArgsSchema: z.ZodType<Prisma.PromptVariablesDeleteArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  where: PromptVariablesWhereUniqueInputSchema,
}).strict()

export const PromptVariablesUpdateArgsSchema: z.ZodType<Prisma.PromptVariablesUpdateArgs> = z.object({
  select: PromptVariablesSelectSchema.optional(),
  include: PromptVariablesIncludeSchema.optional(),
  data: z.union([ PromptVariablesUpdateInputSchema,PromptVariablesUncheckedUpdateInputSchema ]),
  where: PromptVariablesWhereUniqueInputSchema,
}).strict()

export const PromptVariablesUpdateManyArgsSchema: z.ZodType<Prisma.PromptVariablesUpdateManyArgs> = z.object({
  data: z.union([ PromptVariablesUpdateManyMutationInputSchema,PromptVariablesUncheckedUpdateManyInputSchema ]),
  where: PromptVariablesWhereInputSchema.optional(),
}).strict()

export const PromptVariablesDeleteManyArgsSchema: z.ZodType<Prisma.PromptVariablesDeleteManyArgs> = z.object({
  where: PromptVariablesWhereInputSchema.optional(),
}).strict()

export const PromptPackageCreateArgsSchema: z.ZodType<Prisma.PromptPackageCreateArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  data: z.union([ PromptPackageCreateInputSchema,PromptPackageUncheckedCreateInputSchema ]),
}).strict()

export const PromptPackageUpsertArgsSchema: z.ZodType<Prisma.PromptPackageUpsertArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereUniqueInputSchema,
  create: z.union([ PromptPackageCreateInputSchema,PromptPackageUncheckedCreateInputSchema ]),
  update: z.union([ PromptPackageUpdateInputSchema,PromptPackageUncheckedUpdateInputSchema ]),
}).strict()

export const PromptPackageCreateManyArgsSchema: z.ZodType<Prisma.PromptPackageCreateManyArgs> = z.object({
  data: z.union([ PromptPackageCreateManyInputSchema,PromptPackageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PromptPackageDeleteArgsSchema: z.ZodType<Prisma.PromptPackageDeleteArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  where: PromptPackageWhereUniqueInputSchema,
}).strict()

export const PromptPackageUpdateArgsSchema: z.ZodType<Prisma.PromptPackageUpdateArgs> = z.object({
  select: PromptPackageSelectSchema.optional(),
  include: PromptPackageIncludeSchema.optional(),
  data: z.union([ PromptPackageUpdateInputSchema,PromptPackageUncheckedUpdateInputSchema ]),
  where: PromptPackageWhereUniqueInputSchema,
}).strict()

export const PromptPackageUpdateManyArgsSchema: z.ZodType<Prisma.PromptPackageUpdateManyArgs> = z.object({
  data: z.union([ PromptPackageUpdateManyMutationInputSchema,PromptPackageUncheckedUpdateManyInputSchema ]),
  where: PromptPackageWhereInputSchema.optional(),
}).strict()

export const PromptPackageDeleteManyArgsSchema: z.ZodType<Prisma.PromptPackageDeleteManyArgs> = z.object({
  where: PromptPackageWhereInputSchema.optional(),
}).strict()

export const PromptTemplateCreateArgsSchema: z.ZodType<Prisma.PromptTemplateCreateArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  data: z.union([ PromptTemplateCreateInputSchema,PromptTemplateUncheckedCreateInputSchema ]),
}).strict()

export const PromptTemplateUpsertArgsSchema: z.ZodType<Prisma.PromptTemplateUpsertArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereUniqueInputSchema,
  create: z.union([ PromptTemplateCreateInputSchema,PromptTemplateUncheckedCreateInputSchema ]),
  update: z.union([ PromptTemplateUpdateInputSchema,PromptTemplateUncheckedUpdateInputSchema ]),
}).strict()

export const PromptTemplateCreateManyArgsSchema: z.ZodType<Prisma.PromptTemplateCreateManyArgs> = z.object({
  data: z.union([ PromptTemplateCreateManyInputSchema,PromptTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PromptTemplateDeleteArgsSchema: z.ZodType<Prisma.PromptTemplateDeleteArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  where: PromptTemplateWhereUniqueInputSchema,
}).strict()

export const PromptTemplateUpdateArgsSchema: z.ZodType<Prisma.PromptTemplateUpdateArgs> = z.object({
  select: PromptTemplateSelectSchema.optional(),
  include: PromptTemplateIncludeSchema.optional(),
  data: z.union([ PromptTemplateUpdateInputSchema,PromptTemplateUncheckedUpdateInputSchema ]),
  where: PromptTemplateWhereUniqueInputSchema,
}).strict()

export const PromptTemplateUpdateManyArgsSchema: z.ZodType<Prisma.PromptTemplateUpdateManyArgs> = z.object({
  data: z.union([ PromptTemplateUpdateManyMutationInputSchema,PromptTemplateUncheckedUpdateManyInputSchema ]),
  where: PromptTemplateWhereInputSchema.optional(),
}).strict()

export const PromptTemplateDeleteManyArgsSchema: z.ZodType<Prisma.PromptTemplateDeleteManyArgs> = z.object({
  where: PromptTemplateWhereInputSchema.optional(),
}).strict()

export const PromptVersionCreateArgsSchema: z.ZodType<Prisma.PromptVersionCreateArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  data: z.union([ PromptVersionCreateInputSchema,PromptVersionUncheckedCreateInputSchema ]),
}).strict()

export const PromptVersionUpsertArgsSchema: z.ZodType<Prisma.PromptVersionUpsertArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereUniqueInputSchema,
  create: z.union([ PromptVersionCreateInputSchema,PromptVersionUncheckedCreateInputSchema ]),
  update: z.union([ PromptVersionUpdateInputSchema,PromptVersionUncheckedUpdateInputSchema ]),
}).strict()

export const PromptVersionCreateManyArgsSchema: z.ZodType<Prisma.PromptVersionCreateManyArgs> = z.object({
  data: z.union([ PromptVersionCreateManyInputSchema,PromptVersionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PromptVersionDeleteArgsSchema: z.ZodType<Prisma.PromptVersionDeleteArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  where: PromptVersionWhereUniqueInputSchema,
}).strict()

export const PromptVersionUpdateArgsSchema: z.ZodType<Prisma.PromptVersionUpdateArgs> = z.object({
  select: PromptVersionSelectSchema.optional(),
  include: PromptVersionIncludeSchema.optional(),
  data: z.union([ PromptVersionUpdateInputSchema,PromptVersionUncheckedUpdateInputSchema ]),
  where: PromptVersionWhereUniqueInputSchema,
}).strict()

export const PromptVersionUpdateManyArgsSchema: z.ZodType<Prisma.PromptVersionUpdateManyArgs> = z.object({
  data: z.union([ PromptVersionUpdateManyMutationInputSchema,PromptVersionUncheckedUpdateManyInputSchema ]),
  where: PromptVersionWhereInputSchema.optional(),
}).strict()

export const PromptVersionDeleteManyArgsSchema: z.ZodType<Prisma.PromptVersionDeleteManyArgs> = z.object({
  where: PromptVersionWhereInputSchema.optional(),
}).strict()

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict()

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict()

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict()

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict()

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
}).strict()

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
}).strict()

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict()

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict()

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
}).strict()

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
}).strict()

export const PromptLogCreateArgsSchema: z.ZodType<Prisma.PromptLogCreateArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  data: z.union([ PromptLogCreateInputSchema,PromptLogUncheckedCreateInputSchema ]),
}).strict()

export const PromptLogUpsertArgsSchema: z.ZodType<Prisma.PromptLogUpsertArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereUniqueInputSchema,
  create: z.union([ PromptLogCreateInputSchema,PromptLogUncheckedCreateInputSchema ]),
  update: z.union([ PromptLogUpdateInputSchema,PromptLogUncheckedUpdateInputSchema ]),
}).strict()

export const PromptLogCreateManyArgsSchema: z.ZodType<Prisma.PromptLogCreateManyArgs> = z.object({
  data: z.union([ PromptLogCreateManyInputSchema,PromptLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PromptLogDeleteArgsSchema: z.ZodType<Prisma.PromptLogDeleteArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  where: PromptLogWhereUniqueInputSchema,
}).strict()

export const PromptLogUpdateArgsSchema: z.ZodType<Prisma.PromptLogUpdateArgs> = z.object({
  select: PromptLogSelectSchema.optional(),
  data: z.union([ PromptLogUpdateInputSchema,PromptLogUncheckedUpdateInputSchema ]),
  where: PromptLogWhereUniqueInputSchema,
}).strict()

export const PromptLogUpdateManyArgsSchema: z.ZodType<Prisma.PromptLogUpdateManyArgs> = z.object({
  data: z.union([ PromptLogUpdateManyMutationInputSchema,PromptLogUncheckedUpdateManyInputSchema ]),
  where: PromptLogWhereInputSchema.optional(),
}).strict()

export const PromptLogDeleteManyArgsSchema: z.ZodType<Prisma.PromptLogDeleteManyArgs> = z.object({
  where: PromptLogWhereInputSchema.optional(),
}).strict()