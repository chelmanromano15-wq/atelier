import { Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const r = Router();

// înregistrare
r.post("/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(400).json(e.array());

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "exists" });

    const u = await User.create({ name, email, password });
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 864e5 });
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role });
  });

// login
r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ error: "bad" });
  const ok = await u.compare(password);
  if (!ok) return res.status(401).json({ error: "bad" });
  const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 864e5 });
  res.json({ id: u._id, name: u.name, email: u.email, role: u.role });
});

// logout
r.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default r;
