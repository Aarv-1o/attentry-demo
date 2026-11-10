import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "./auth.js";
import { User } from "./models.js";

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ error: "Wrong email or password" });
  }
  res.json({ token: jwt.sign({ id: user.id }, SECRET) });
}

export async function register(req, res) {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password });
  res.status(201).json({ id: user.id });
}
