import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Document from "./model/Document.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const usersInDocument = {};

io.on("connection", (socket) => {
  console.log("A User Connected", socket.id);

  // join a document room
  socket.on("join-document", async (docId) => {
    if (!usersInDocument[docId]) {
      usersInDocument[docId] = new Set();
    }

    if (!usersInDocument[docId].has(socket.id)) {
      socket.join(docId);
      usersInDocument[docId].add(socket.id);
      console.log(`User ${socket.id} joined document ${docId}`);
      socket.to(docId).emit("user-joined", socket.id);
    }
    // Load document from MongoDB
    try {
      let document = await Document.findOne({ docId });
      if (!document) {
        document = new Document({ docId, content: "" });
        await document.save();
      }
      socket.emit("load-document", document.content);
    } catch (error) {
      console.error("Error loading document:", error);
    }
  });

  // handle textchanges
  socket.on("send-changes", async ({ docId, delta }) => {
    try {
      const document = await Document.findOne({ docId });
      if (document) {
        document.content += delta;
        await document.save();
      }
      socket.to(docId).emit("receive-changes", delta);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    for (let docId in usersInDocument) {
      usersInDocument[docId].delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
