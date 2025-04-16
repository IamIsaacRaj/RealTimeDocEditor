import Document from "./models/Document.js";

const usersInDocument = {}; // Track connected users per document
// Debounced save map
const saveTimeouts = {};

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
            title: "Untitled Document",
            content: { ops: [] },
            createdBy: userId,
          });
          await document.save();
        }
        socket.emit(
          "load-document",
          document.content,
          document.title
        );
      } catch (error) {
        console.error("Error loading document:", error);
      }
    });

    // Handle text changes
    socket.on("send-changes", async ({ docId, delta }) => {
      try {
        // Emit change to other users
        socket.to(docId).emit("receive-changes", delta);

        // Debounced save logic
        if (saveTimeouts[docId]) {
          clearTimeout(saveTimeouts[docId]);
        }

        saveTimeouts[docId] = setTimeout(async () => {
          try {
            const document = await Document.findOne({ docId });
            if (document) {
              document.content.ops.push(delta); // Or consider replacing with latest full content if needed
              await document.save();
              console.log(`Document ${docId} auto-saved`);
            }
          } catch (err) {
            console.error(`Error during debounced save for ${docId}:`, err);
          }
        }, 2000); // Save after 2 seconds of inactivity
      } catch (error) {
        console.error("Error emitting send-changes:", error);
      }
    });
    // Save document manually
    socket.on("save-document", async ({ docId, content, title, userId }) => {
      try {
        const result = await Document.findOneAndUpdate(
          { docId },
          { 
            content, 
            title: title || "Untitled Document",
            updatedBy: userId 
          },
          { upsert: true, new: true }
        );
        
        // Broadcast title update to all users in the document
        io.to(docId).emit("title-updated", result.title);
        
      } catch (error) {
        console.error("Error saving document:", error);
        socket.emit("save-error", { message: "Failed to save document" });
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      for (let docId in usersInDocument) {
        usersInDocument[docId].delete(socket.id);
        // Optional: clean up debounce timer if no users left in document
        if (usersInDocument[docId].size === 0) {
          clearTimeout(saveTimeouts[docId]);
          delete saveTimeouts[docId];
        }
      }
    });
  });
}
