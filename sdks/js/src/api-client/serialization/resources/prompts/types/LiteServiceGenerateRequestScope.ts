/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const LiteServiceGenerateRequestScope: core.serialization.ObjectSchema<
  serializers.LiteServiceGenerateRequestScope.Raw,
  SugarAiApi.LiteServiceGenerateRequestScope
> = core.serialization.object({
  clientUserId: core.serialization.string(),
  scope1: core.serialization.string().optional(),
  scope2: core.serialization.string().optional(),
  groupId: core.serialization.string().optional(),
});

export declare namespace LiteServiceGenerateRequestScope {
  interface Raw {
    clientUserId: string;
    scope1?: string | null;
    scope2?: string | null;
    groupId?: string | null;
  }
}
