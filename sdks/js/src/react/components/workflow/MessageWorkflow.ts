import React from "react";
import { Semaphore } from "async-mutex"; // Make sure to install async-mutex: npm install async-mutex
import { Streamingi18nTextRef } from "~/react/schema/form";

export class MessageWorkflow {
  private queue: React.RefObject<Streamingi18nTextRef>[];
  private semaphore: Semaphore;

  constructor() {
    this.queue = [];
    this.semaphore = new Semaphore(1);
  }

  addMessage(message: React.RefObject<Streamingi18nTextRef>): void {
    this.queue.push(message);
    this.processQueue();
  }

  private async executeMessage(
    message: React.RefObject<Streamingi18nTextRef>,
  ): Promise<void> {
    if (message.current) {
      await message.current.startStreaming();
    }
  }

  private async processQueue(): Promise<void> {
    const [value, release] = await this.semaphore.acquire();

    const nextMessage = this.queue.shift();
    if (nextMessage) {
      await this.executeMessage(nextMessage);
    }

    release();

    // try {
    //   while (this.queue.length > 0) {
    //     const nextMessage = this.queue.shift();
    //     if (nextMessage) {
    //       await this.executeMessage(nextMessage);
    //     }
    //   }
    // } finally {
    //   release();
    // }
  }

  clearMessages(): void {
    this.queue = [];
  }
}

export default MessageWorkflow;
