import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    docId: { type: String, required: true, unique: true },
    content: { type: Object, default: {} }, // Storing document content
    createdBy: { type: String, required: false }, // User who created the document
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
