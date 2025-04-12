// routes/documents.js
import express from "express";
import Document from "../models/Document.js";

const router = express.Router();

// GET all saved documents
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find().sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

export default router;
