import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// @ts-ignore
import { tools } from "./tools/index.js";

// 1. Defining the Tool Structure (Type)
// This prevents TypeScript errors on tool.schema or tool.execute
interface McpTool {
  name: string;
  description: string;
  schema: any; 
  execute: (args: any) => Promise<any>;
}

const server = new McpServer({
  name: "my-mcp-api-server",
  version: "1.0.0",
});

/**
 * 2. Registering the Tools
 * Using 'tools as McpTool[]' tells TypeScript that 
 * these objects will definitely have schema and execute properties.
 */
try {
  for (const tool of (tools as McpTool[])) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      async (args: any) => {
        // This triggers the execute function for each specific tool
        return await tool.execute(args);
      }
    );
  }
} catch (error) {
  console.error("An error occurred during tool registration:", error);
}

// 3. Starting the Server
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Note: Do not use stdout for logs; only use stderr for MCP stability.
  console.error("MCP Server (Stdio) is running successfully...");
}

startServer().catch((error) => {
  console.error("Critical error while starting the server:", error);
  process.exit(1);
});