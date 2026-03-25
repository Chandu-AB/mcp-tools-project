// src/mcp/tools/getUsers.ts

import db from "../../db/knex.js";

export const getUsersTool = {
  name: "getUsers",
  description: "Use this tool to fetch all users from database",

  inputSchema: {
    type: "object",
    properties: {}
  },

  execute: async () => {
    const users = await db("users").select("*");
    return JSON.stringify(users);
  }
};