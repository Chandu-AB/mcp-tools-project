// src/mcp/tools/index.ts

import { getUsersTool } from "./getUsers.js";
import { getStudentsTool } from "./getStudents.js";
import { createPRTool } from "./createPRTool.js";
import { generateCommitTool } from "./generateCommitMessage.js";

export const tools = [
  getUsersTool,
  getStudentsTool,
  createPRTool,
  generateCommitTool
];