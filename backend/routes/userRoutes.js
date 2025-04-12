// backend/routes/user.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { username, email } = req.body;
  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Server error while registering" });
  }
});

// Login (very basic)
router.post("/login", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // In real app, you would verify password and issue a token or session
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout (placeholder)
router.post("/logout", (req, res) => {
  // In real app, you'd clear cookie/session/token
  res.json({ message: "Logged out successfully" });
});

export default router;
