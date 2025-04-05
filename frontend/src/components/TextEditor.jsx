import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { Save, Loader2 } from "lucide-react";
import CustomToolbar from "./customToolbar";
import socket from "../utils/socketClient";
import useDocumentSocket from "../custumHooks/useDocumentSocket";

const TextEditor = () => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [title, setTitle] = useState("Untitled Document");

  const quillRef = useRef(null);
  const { id: docId, userId } = useParams();

  useDocumentSocket({ docId, userId, quillRef, setContent });

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

  const modules = {
    toolbar: {
      container: "#toolbar-container",
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "formula",
    "clean",
  ];

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    const toolbar = quill?.getModule("toolbar");

    toolbar.addHandler("undo", () => {
      quill.history.undo();
    });

    toolbar.addHandler("redo", () => {
      quill.history.redo();
    });
  }, []);

  return (
    <>
      {/* Top Header */}
      <div className="w-full sticky top-0 px-6 py-2 flex justify-between items-center">
        <input
          className="text-lg font-semibold text-center flex-1 outline-none border-none bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Toolbar */}
      <div className="w-full sticky top-12 z-10 bg-white px-6 py-2 border-b shadow-sm flex items-center gap-4">
        <label className="flex items-center ml-4 text-sm">
          <input
            type="checkbox"
            className="mr-2"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          Auto-Save
        </label>

        <button
          className={`ml-auto px-3 py-1.5 rounded-md flex items-center gap-2 text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className="text-green-600 text-center font-medium my-2">
          {saveMessage}
        </div>
      )}

      {/* Text-Editor */}
      <div className="w-full max-w-5xl mx-auto mt-2 p-4">
        <CustomToolbar />
        <ReactQuill
          ref={(el) => {
            quillRef.current = el;
            if (el) {
              window.quill = el.getEditor(); // 🔥 attach to window
            }
          }}
          value={content}
          onChange={handleChanges}
          theme="snow"
          modules={modules}
          formats={formats}
        />
      </div>
    </>
  );
};

export default TextEditor;
