// Importing each tool with .js extension for ESM compatibility
import { createPRTool } from "./createPRTool.js";
import { generateCommitMessageTool } from "./generateCommitMessage.js";
import { getStudentsTool } from "./getStudents.js";
import { getUsersTool } from "./getUsers.js";

// Exporting a central tools array
export const tools = [
  createPRTool,
  generateCommitMessageTool,
  getStudentsTool,
  getUsersTool
];