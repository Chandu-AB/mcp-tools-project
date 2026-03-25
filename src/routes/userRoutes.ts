import express from "express";
import db from "../db/knex.js";
import { z } from "zod";

const router = express.Router();

// Zod schema for validation
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

// GET all users
router.get("/", async (req, res) => {
  const users = await db("users").select("*");
  res.json(users);
});

// POST create user
router.post("/", async (req, res) => {
  const validated = userSchema.parse(req.body);
  const [id] = await db("users").insert(validated);
  res.status(201).json({ id, ...validated });
});
// PUT update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const validated = userSchema.parse(req.body);

  await db("users")
    .where({ id })
    .update(validated);

  res.json({ message: "User updated successfully" });
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await db("users")
    .where({ id })
    .del();

  res.json({ message: "User deleted successfully" });
});

export default router;