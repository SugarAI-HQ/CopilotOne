/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as SugarAiApi from "../../..";

export interface FormGetSubmissionResponse {
  id: string;
  formId: string;
  userId: string;
  clientUserId: string;
  metadata: SugarAiApi.FormGetSubmissionResponseMetadata;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  answers: SugarAiApi.FormGetSubmissionResponseAnswersItem[];
}
