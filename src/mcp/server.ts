// src/mcp/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools/index.js";

// create server
const server = new Server(
  { name: "api-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// list tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema
  }))
}));

// call tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(t => t.name === request.params.name);

  if (!tool) throw new Error("Tool not found");

const args = request.params.arguments as { message: string };
const result = await tool.execute(args);
  return {
    content: [
      {
        type: "text",
        text: typeof result === "string" ? result : JSON.stringify(result)
      }
    ]
  };
});

// start server
const transport = new StdioServerTransport();
await server.connect(transport);
process.stdin.resume();