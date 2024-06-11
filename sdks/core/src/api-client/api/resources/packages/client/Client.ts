/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as SugarAiApi from "../../..";
import { urlJoin } from "url-join-ts";
import * as serializers from "../../../../serialization";
import * as errors from "../../../../errors";

export declare namespace Packages {
  interface Options {
    environment?: core.Supplier<environments.SugarAiApiEnvironment | string>;
    token?: core.Supplier<core.BearerToken | undefined>;
  }

  interface RequestOptions {
    timeoutInSeconds?: number;
    maxRetries?: number;
  }
}

export class Packages {
  constructor(protected readonly _options: Packages.Options = {}) {}

  public async promptGetPackages(
    request: SugarAiApi.PromptGetPackagesRequest = {},
    requestOptions?: Packages.RequestOptions,
  ): Promise<SugarAiApi.PromptGetPackagesResponseItem[]> {
    const { userId, visibility } = request;
    const _queryParams: Record<string, string | string[]> = {};
    if (userId != null) {
      _queryParams["userId"] = userId;
    }

    if (visibility != null) {
      _queryParams["visibility"] = visibility;
    }

    const _response = await core.fetcher({
      url: urlJoin(
        (await core.Supplier.get(this._options.environment)) ??
          environments.SugarAiApiEnvironment.Default,
        "packages",
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        "X-Fern-Language": "JavaScript",
      },
      contentType: "application/json",
      queryParameters: _queryParams,
      timeoutMs:
        requestOptions?.timeoutInSeconds != null
          ? requestOptions.timeoutInSeconds * 1000
          : 60000,
      maxRetries: requestOptions?.maxRetries,
    });
    if (_response.ok) {
      return await serializers.packages.promptGetPackages.Response.parseOrThrow(
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