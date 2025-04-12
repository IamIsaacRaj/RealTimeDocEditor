import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import registerSocketEvents from "./socket.js";
import userRoutes from "./routes/userRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/documents", documentsRoutes);
app.use("/api/user", userRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Pass `io` to socket.js
registerSocketEvents(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
