import { createRequire } from "module";

// ✅ 1. Fix for CommonJS compatibility in NodeNext environment
// Using createRequire allows us to import 'knex' which is a CommonJS module
const require = createRequire(import.meta.url);
const knex = require("knex");

/**
 * ✅ 2. Database Connection Configuration
 * We use process.env to keep sensitive credentials out of the source code.
 * Make sure these variables are defined in your root .env file.
 */
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD, // 🔐 Removed hardcoded password for security
    database: process.env.DB_NAME,     // 📂 Removed hardcoded DB name
    port: Number(process.env.DB_PORT) || 3306
  },

  /**
   * ✅ 3. Connection Pooling
   * Essential for API performance. It manages multiple connections 
   * so your getStudents tool doesn't crash under load.
   */
  pool: {
    min: 2,
    max: 10
  }
});

// Export the db instance for use in getStudents.ts and getUsers.ts
export default db;