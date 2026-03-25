// src/mcp/tools/getStudents.ts

import db from "../../db/knex.js";

export const getStudentsTool = {
  name: "getStudents",
  description: "Use this tool to fetch all students from database",

  inputSchema: {
    type: "object",
    properties: {}
  },

  execute: async () => {
    const students = await db("students").select("*");
    return JSON.stringify(students);
  }
};