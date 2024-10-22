/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "./environments";
import * as core from "./core";
import { Packages } from "./api/resources/packages/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Embedding } from "./api/resources/embedding/client/Client";
import { Chat } from "./api/resources/chat/client/Client";
import { ChatHistory } from "./api/resources/chatHistory/client/Client";
import { Message } from "./api/resources/message/client/Client";

export declare namespace SugarAiApiClient {
  interface Options {
    environment?: core.Supplier<environments.SugarAiApiEnvironment | string>;
    token?: core.Supplier<core.BearerToken | undefined>;
  }

  interface RequestOptions {
    timeoutInSeconds?: number;
    maxRetries?: number;
  }
}

export class SugarAiApiClient {
  constructor(protected readonly _options: SugarAiApiClient.Options = {}) {}

  protected _packages: Packages | undefined;

  public get packages(): Packages {
    return (this._packages ??= new Packages(this._options));
  }

  protected _prompts: Prompts | undefined;

  public get prompts(): Prompts {
    return (this._prompts ??= new Prompts(this._options));
  }

  protected _embedding: Embedding | undefined;

  public get embedding(): Embedding {
    return (this._embedding ??= new Embedding(this._options));
  }

  protected _chat: Chat | undefined;

  public get chat(): Chat {
    return (this._chat ??= new Chat(this._options));
  }

  protected _chatHistory: ChatHistory | undefined;

  public get chatHistory(): ChatHistory {
    return (this._chatHistory ??= new ChatHistory(this._options));
  }

  protected _message: Message | undefined;

  public get message(): Message {
    return (this._message ??= new Message(this._options));
  }
}
