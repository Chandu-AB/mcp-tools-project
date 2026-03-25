// src/mcp/tools/generateCommitMessage.ts

import ollama from "ollama";

export const generateCommitTool = {
  name: "generateCommitMessage",
  description: "Use this tool to generate a git commit message from changes",

  inputSchema: {
    type: "object",
    properties: {
      change: { type: "string" }
    },
    required: ["change"]
  },

  execute: async (args: any) => {
    const response = await ollama.chat({
      model: "tinyllama",
      messages: [
        {
          role: "user",
          content: `Write a short git commit message for: ${args.change}`
        }
      ]
    });

    return response.message.content;
  }
};