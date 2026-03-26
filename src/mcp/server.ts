import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// @ts-ignore
import { tools } from "./tools/index.js";

// 1. Tool యొక్క ఆకృతిని (Type) నిర్వచించడం
// దీనివల్ల tool.schema లేదా tool.execute దగ్గర TypeScript ఎర్రర్స్ రావు
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
 * 2. టూల్స్ ని రిజిస్టర్ చేయడం
 * 'tools as McpTool[]' అని చెప్పడం ద్వారా TypeScript కి 
 * ఈ ఆబ్జెక్ట్‌లలో schema, execute ఉంటాయని అర్థమవుతుంది.
 */
try {
  for (const tool of (tools as McpTool[])) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      async (args: any) => {
        // ఇక్కడ ప్రతి టూల్ లోని execute ఫంక్షన్ రన్ అవుతుంది
        return await tool.execute(args);
      }
    );
  }
} catch (error) {
  console.error("టూల్స్ రిజిస్ట్రేషన్ లో పొరపాటు జరిగింది:", error);
}

// 3. సర్వర్ ని స్టార్ట్ చేయడం
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // గమనిక: stdout ని వాడకూడదు, కేవలం stderr లోనే లాగ్స్ ఉండాలి
  console.error("MCP Server (Stdio) విజయవంతంగా రన్ అవుతోంది...");
}

startServer().catch((error) => {
  console.error("సర్వర్ స్టార్ట్ చేయడంలో క్రిటికల్ ఎర్రర్:", error);
  process.exit(1);
});