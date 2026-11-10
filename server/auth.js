import jwt from "jsonwebtoken";

export const SECRET = process.env.JWT_SECRET || "superSecret";

export function requireAuth(req, res, next) {
  try {
    req.user = jwt.verify(req.headers.authorization?.replace("Bearer ", ""), SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Log in first" });
  }
}
