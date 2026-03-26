// @ts-ignore (NodeNext compatibility)
import { getUsersTool } from "./getUsers.js";
// @ts-ignore
import { getStudentsTool } from "./getStudents.js";
// @ts-ignore
import { createPRTool } from "./createPRTool.js";
// @ts-ignore
import { generateCommitTool } from "./generateCommitMessage.js";

export const tools = [
  getUsersTool,
  getStudentsTool,
  createPRTool,
  generateCommitTool
];