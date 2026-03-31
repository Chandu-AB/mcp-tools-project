// No more @ts-ignore! Just use the .js extension in your imports.
// TypeScript (NodeNext) understands that this refers to your .ts files.

import { getUsersTool } from "./getUsers.js";
import { getStudentsTool } from "./getStudents.js";
import { createPRTool } from "./createPRTool.js";
import { generateCommitTool } from "./generateCommitMessage.js";

// Export as a named constant so server.ts can loop through them
export const tools = [
  getUsersTool,
  getStudentsTool,
  createPRTool,
  generateCommitTool
  //more tools can be added here in the future
];