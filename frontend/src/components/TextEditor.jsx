import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000", { autoConnect: false });

const TextEditor = () => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");


  const quillRef = useRef(null);
  const hasJoinedRef = useRef(false);

  const { id: docId, userId } = useParams();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (!hasJoinedRef.current) {
      console.log("Joining document:", docId); // ✅ Log joining
      socket.emit("join-document", docId, userId);
      hasJoinedRef.current = true; // Mark as joined
    }

    socket.on("user-joined", (userId) => {
      console.log(`User joined: ${userId}`);
    });

    socket.on("load-document", (documentContent) => {
      console.log("Loaded Document Content:", documentContent); // ✅ Debugging Log
      if (!quillRef.current) {
        console.warn("Quill is not ready yet!");
        return;
      }

      const editor = quillRef.current.getEditor();
      if (!editor) return;

      editor.setContents(documentContent || { ops: [] }); // ✅ Ensure valid content
      setContent(documentContent || { ops: [] });
    });

    socket.on("receive-changes", (delta) => {
      console.log("Received Changes:", delta); // ✅ Debugging Log
      if (quillRef.current) {
        quillRef.current.getEditor().updateContents(delta);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, [docId]);

  const handleChanges = (value, delta, source) => {
    if (source === "user") {
      socket.emit("send-changes", { docId, delta });
    }
    setContent(quillRef.current.getEditor().getContents()); // ✅ Ensure it stores Delta format
  };

  const handleSave = () => {
    setSaving(true);
    socket.emit("save-document", { docId, content });

    setTimeout(() => {
      setSaving(false);
      setSaveMessage("Document saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 1000); // simulate delay
  };


  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md p-4">
        {saveMessage && (
          <div className="mb-4 text-green-600 font-semibold text-center">
            {saveMessage}
          </div>
        )}
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleChanges}
          theme="snow"
        />
      </div>

      {/* Save Button */}
      <div className="text-center mt-4">
        <button
          className={`px-4 py-2 rounded-md text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Document"}
        </button>
      </div>
    </>
  );
};

export default TextEditor;
