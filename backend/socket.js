import Document from "./models/Document.js";

const usersInDocument = {}; // Track connected users per document

export default function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);

    // Join a document room
    socket.on("join-document", async (docId, userId) => {
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
          document = new Document({
            docId,
            content: { ops: [] },
            createdBy: userId,
          });
          await document.save();
        }
        socket.emit("load-document", document.content);
      } catch (error) {
        console.error("Error loading document:", error);
      }
    });

    // Handle text changes
    socket.on("send-changes", async ({ docId, delta }) => {
      try {
        const document = await Document.findOne({ docId });
        if (document) {
          document.content.ops.push(delta); // Append delta changes
          await document.save();
        }
        socket.to(docId).emit("receive-changes", delta);
      } catch (error) {
        console.error("Error saving document:", error);
      }
    });

    // Save document manually
    socket.on("save-document", async ({ docId, content }) => {
      try {
        await Document.findOneAndUpdate(
          { docId },
          { content },
          { upsert: true }
        );
      } catch (error) {
        console.error("Error saving document:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      for (let docId in usersInDocument) {
        usersInDocument[docId].delete(socket.id);
      }
    });
  });
}
