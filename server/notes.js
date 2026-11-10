import { Router } from "express";
import { Note } from "./models.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await Note.find({ owner: req.user.id }));
});

router.post("/", async (req, res) => {
  res.status(201).json(await Note.create({ ...req.body, owner: req.user.id }));
});

// Logged in, but any logged-in user can read anyone's note by changing the id.
router.get("/:id", async (req, res) => {
  res.json(await Note.findById(req.params.id));
});

router.put("/:id", async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).end();
  Object.assign(note, req.body);
  res.json(await note.save());
});

export default router;
