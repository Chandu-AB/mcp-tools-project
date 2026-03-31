import db from "../../db/knex.js";

/**
 * Tool to fetch all user records.
 */
export const getUsersTool = {
  name: "getUsers",
  description: "Retrieves a list of all registered users from the API database.",

  inputSchema: {
    type: "object",
    properties: {}
  },

  execute: async () => {
    try {
      console.error("🔍 Querying database for users...");
      
      const users = await db("users").select("*");

      return {
        content: [
          {
            type: "text",
            text: users.length > 0 
              ? JSON.stringify(users, null, 2) 
              : "The users table is currently empty."
          }
        ]
      };
    } catch (error: any) {
      console.error("❌ Database Error (getUsers):", error.message);
      return {
        content: [{ type: "text", text: `Error fetching users: ${error.message}` }],
        isError: true
      };
    }
  }
};