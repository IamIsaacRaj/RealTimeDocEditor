import Document from "./models/Document.js";
import User from "./models/User.js";

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
            updatedBy: userId
          });
          await document.save();
        }

        // Fetch user information
        const creator = await User.findById(document.createdBy);
        const editor = document.updatedBy !== document.createdBy ? await User.findById(document.updatedBy) : null;

        socket.emit(
          "load-document",
          document.content,
          document.title,
          creator ? creator.username : document.createdBy,
          editor ? editor.username : document.updatedBy
        );
      } catch (error) {
        console.error("Error loading document:", error);
      }
    });

    // Handle text changes
    socket.on("send-changes", async ({ docId, delta, userId }) => {
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
              document.content.ops.push(delta);
              document.updatedBy = userId; // Add updatedBy field
              await document.save();

              // Fetch updated user information
              const editor = await User.findById(userId);
              io.to(docId).emit("document-updated", {
                updatedBy: editor ? editor.username : userId,
                updatedAt: document.updatedAt
              });

              console.log(`Document ${docId} auto-saved by user ${userId}`);
            }
          } catch (err) {
            console.error(`Error during debounced save for ${docId}:`, err);
          }
        }, 2000);
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
        
        // Fetch user information
        const editor = await User.findById(userId);
        
        // Broadcast updates to all users in the document
        io.to(docId).emit("title-updated", result.title);
        io.to(docId).emit("document-updated", {
          updatedBy: editor ? editor.username : userId,
          updatedAt: result.updatedAt
        });
        
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
        if (usersInDocument[docId].size === 0) {
          clearTimeout(saveTimeouts[docId]);
          delete saveTimeouts[docId];
        }
      }
    });
  });
}
