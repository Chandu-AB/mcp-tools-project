// ✅ Load env safely (NO logs → MCP safe)
import "dotenv/config";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// ✅ Start server function
async function startServer() {
  // ✅ Dynamically import tools (NodeNext compatible)
  const { tools } = await import("./tools/index.js");

  const server = new McpServer({
    name: "api-tools-node-server",
    version: "1.0.0",
  });

  // ✅ Register tools
  for (const tool of tools as any[]) {
    let schema = {};

    try {
      // ✅ Convert Zod → JSON
      if (tool.schema) {
        schema = zodToJsonSchema(tool.schema);
      }
      // ✅ Already JSON schema
      else if (tool.inputSchema) {
        schema = tool.inputSchema;
      }
    } catch (err) {
      console.error("Schema conversion error:", err);
    }

    server.tool(
      tool.name,
      tool.description,
      schema, // ✅ MUST be full JSON schema
      async (args: any) => {
        try {
          console.error(`⚡ Executing Tool: ${tool.name}`);
          return await tool.execute(args);
        } catch (error: any) {
          console.error("Tool execution error:", error);

          return {
            content: [
              {
                type: "text",
                text: `❌ Tool error: ${error.message}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  // ✅ Connect MCP transport (REQUIRED)
  await server.connect(new StdioServerTransport());

  // ⚠️ Use ONLY stderr
  console.error("🔥 MCP Server Running...");
}

// ✅ Start server
startServer().catch((err) => {
  console.error("❌ Server failed to start:", err);
});