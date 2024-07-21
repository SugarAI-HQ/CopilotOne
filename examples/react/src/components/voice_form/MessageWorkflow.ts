import React from "react";
import { Streamingi18TextRef } from "@/schema/voiceFormSchema";

class MessageWorkflow {
  private messages: React.RefObject<Streamingi18TextRef>[];

  constructor() {
    this.messages = [];
  }

  addMessage(message: React.RefObject<Streamingi18TextRef>): void {
    this.messages.push(message);
  }

  removeMessage(index: number): void {
    if (index >= 0 && index < this.messages.length) {
      this.messages.splice(index, 1);
    }
  }

  clearMessages(): void {
    this.messages = [];
  }

  async run(): Promise<void> {
    console.log("Running workflow");
    for (let i = 0; i < this.messages.length; i++) {
      const optionRef = this.messages[i];
      if (optionRef.current) {
        await optionRef.current.startStreaming();
      }
    }
  }
}

export default MessageWorkflow;
