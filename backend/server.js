const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

require("dotenv").config();

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

const documents = {};
const usersInDocument = {};

io.on("connection", (socket) => {
  console.log("A User Connected", socket.id);

  // join a document room
  socket.on("join-document", (docId) => {
    if (!usersInDocument[docId]) {
      usersInDocument[docId] = new Set();
    }

    if (!usersInDocument[docId].has(socket.id)) {
      socket.join(docId);
      usersInDocument[docId].add(socket.id);
      console.log(`User ${socket.id} joined document ${docId}`);
      socket.to(docId).emit("user-joined", socket.id);
    }

    if (documents[docId]) {
      socket.emit("load-document", documents[docId]);
    }
  });

  // handle textchanges
  socket.on("send-changes", ({ docId, delta }) => {
    documents[docId] = delta; // store document data
    socket.to(docId).emit("receive-changes", delta);
  });

  socket.on("disconnected", () => {
    console.log("User disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
