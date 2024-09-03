/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import { urlJoin } from "url-join-ts";
import * as errors from "../../../../errors";
import * as SugarAiApi from "../../..";
import * as serializers from "../../../../serialization";

export declare namespace VoiceForm {
  interface Options {
    environment?: core.Supplier<environments.SugarAiApiEnvironment | string>;
    token?: core.Supplier<core.BearerToken | undefined>;
  }

  interface RequestOptions {
    timeoutInSeconds?: number;
    maxRetries?: number;
  }
}

export class VoiceForm {
  constructor(protected readonly _options: VoiceForm.Options = {}) {}

  public async formGetSubmissions(
    formId: string,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<unknown> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}/submissions`,
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return _response.body;
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  public async formGetSubmission(
    formId: string,
    submissionId: string,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<SugarAiApi.FormGetSubmissionResponse> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}/submission/${submissionId}`,
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return await serializers.FormGetSubmissionResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true,
          breadcrumbsPrefix: ["response"],
        },
      );
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  public async formSubmissionGetForm(
    formId: string,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<unknown> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}`,
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return _response.body;
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  public async formSubmissionCreateSubmission(
    formId: string,
    request: SugarAiApi.FormSubmissionCreateSubmissionRequest,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<SugarAiApi.FormSubmissionCreateSubmissionResponse> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}/submission`,
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      body: await serializers.FormSubmissionCreateSubmissionRequest.jsonOrThrow(
        request,
        {
          unrecognizedObjectKeys: "strip",
        },
      ),
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return await serializers.FormSubmissionCreateSubmissionResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true,
          breadcrumbsPrefix: ["response"],
        },
      );
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  public async formSubmissionSubmitAnswer(
    formId: string,
    submissionId: string,
    questionId: string,
    request: SugarAiApi.FormSubmissionSubmitAnswerRequest,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<SugarAiApi.FormSubmissionSubmitAnswerResponse> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}/submission/${submissionId}/questions/${questionId}/answer`,
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      body: await serializers.FormSubmissionSubmitAnswerRequest.jsonOrThrow(
        request,
        {
          unrecognizedObjectKeys: "strip",
        },
      ),
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return await serializers.FormSubmissionSubmitAnswerResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true,
          breadcrumbsPrefix: ["response"],
        },
      );
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  public async formSubmissionCompleteSubmission(
    formId: string,
    submissionId: string,
    requestOptions?: VoiceForm.RequestOptions,
  ): Promise<SugarAiApi.FormSubmissionCompleteSubmissionResponse> {
    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        `voice-forms/${formId}/submission/${submissionId}/complete`,
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return await serializers.FormSubmissionCompleteSubmissionResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true,
          breadcrumbsPrefix: ["response"],
        },
      );
    }

    if (_response.error.reason === "status-code") {
      throw new errors.SugarAiApiError({
        statusCode: _response.error.statusCode,
        body: _response.error.body,
      });
    }

    switch (_response.error.reason) {
      case "non-json":
        throw new errors.SugarAiApiError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
        });
      case "timeout":
        throw new errors.SugarAiApiTimeoutError();
      case "unknown":
        throw new errors.SugarAiApiError({
          message: _response.error.errorMessage,
        });
    }
  }

  protected async _getAuthorizationHeader() {
    const bearer = await core.Supplier.get(this._options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }

    return undefined;
  }
}
