import express from "express";
import mongoose from "mongoose";
import { requireAuth } from "./auth.js";
import { login, register } from "./users.js";
import notes from "./notes.js";
import { Note } from "./models.js";

const app = express();
app.use(express.json());

app.post("/api/login", login);
app.post("/api/register", register);

// Every route in notes.js is behind requireAuth.
app.use("/api/notes", requireAuth, notes);

// Shared notes, added later, straight on the app: nothing checks who's calling.
app.delete("/api/shared/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post("/api/import", async (req, res) => {
  const items = JSON.parse(req.body.data);
  await Note.insertMany(items);
  res.json({ imported: items.length });
});

mongoose.connect(process.env.MONGO_URL).then(() => app.listen(3000));
