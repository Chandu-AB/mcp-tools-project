import { createRequire } from "module";

// ✅ Fix for CommonJS (knex) in NodeNext
const require = createRequire(import.meta.url);
const knex = require("knex");

// ✅ DB connection
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "chandu@2003",
    database: process.env.DB_NAME || "api_db"
  },

  // optional logging (safe)
  log: {
    warn(message: string) {},
    error(message: string) {},
    deprecate(message: string) {},
    debug(message: string) {}
  }
});

export default db;