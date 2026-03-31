import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// ✅ 1. Absolute Path Setup for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

// ✅ 2. Load Environment Variables
dotenv.config({ path: envPath, quiet: true });

// ✅ 3. Prevent JSON-RPC crashes by redirecting logs to stderr
console.log = (...args) => {
  console.error("📢 [LOG]:", ...args);
};

// Import tools AFTER dotenv.config
import { tools } from "./tools/index.js";

// ✅ 4. Define the Tool Interface clearly for TypeScript
interface McpTool {
  name: string;
  description: string;
  inputSchema: any; // This is your Zod object
  execute: (args: any) => Promise<any>;
}

const server = new McpServer({
  name: "api-tools",
  version: "1.0.0",
});

// ✅ 5. Corrected Registration Loop
// Note the 4 arguments: name, description, schema, callback
for (const tool of (tools as McpTool[])) {
  try {
    server.tool(
      tool.name,          // Argument 1: string
      tool.description,   // Argument 2: string
      tool.inputSchema,    // Argument 3: Zod object
      async (args:any) => {   // Argument 4: Handler function
        console.error(`⚡ AI invoked: ${tool.name}`);
        return await tool.execute(args);
      }
    );
    console.error(`🔧 Registered: ${tool.name}`);
  } catch (error) {
    console.error(`❌ Registration Error for ${tool.name}:`, error);
  }
}

// ✅ 6. Debugging Check
console.error("--- 🚀 MCP STARTUP ---");
console.error("📂 .env Path:", envPath);
console.error("📦 PROJECT_PATH:", process.env.PROJECT_PATH || "❌ NOT FOUND");
console.error("-----------------------");

// ✅ 7. Start the Server
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ MCP SERVER ONLINE");
  } catch (error) {
    console.error("❌ Transport Error:", error);
    process.exit(1);
  }
}

startServer();