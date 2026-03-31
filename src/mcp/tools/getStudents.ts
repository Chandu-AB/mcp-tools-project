import db from "../../db/knex.js";

/**
 * Tool to fetch all student records.
 * Uses the centralized Knex instance for DB connection.
 */
export const getStudentsTool = {
  name: "getStudents",
  description: "Fetches all student records from the database for administrative review.",

  inputSchema: {
    type: "object",
    properties: {} // No input arguments needed for a 'get all' request
  },

  execute: async () => {
    try {
      console.error("🔍 Querying database for students...");
      
      // Fetch data using Knex
      const students = await db("students").select("*");

      // ✅ Proper MCP response format
      return {
        content: [
          {
            type: "text",
            text: students.length > 0 
              ? JSON.stringify(students, null, 2) 
              : "No student records found in the database."
          }
        ]
      };
    } catch (error: any) {
      console.error("❌ Database Error (getStudents):", error.message);
      return {
        content: [{ type: "text", text: `Error fetching students: ${error.message}` }],
        isError: true
      };
    }
  }
};