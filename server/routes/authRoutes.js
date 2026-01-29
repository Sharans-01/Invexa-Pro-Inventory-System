import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;
 // move to .env later

// 🔹 Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "User not found" });

    const user = data[0];
    const isPasswordValid = password === user.password; // (temporary, later we hash with bcrypt)

    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      name: user.name
    });
  });
});

export default router;
