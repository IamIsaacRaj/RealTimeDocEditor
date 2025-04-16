import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useLocation } from "react-router-dom";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import CustomToolbar from "./customToolbar";
import EditorHeader from "./EditorHeader";
import EditorStatusBar from "./EditorStatusBar";
import socket from "../utils/socketClient";
import useDocumentSocket from "../custumHooks/useDocumentSocket";

const TextEditor = () => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const saveTimeoutRef = useRef(null);

  const location = useLocation();
  const { id: docId, userId } = useParams();
  const [title, setTitle] = useState("Untitled Document");

  const quillRef = useRef(null);
  const initialContent = location.state?.content || { ops: [] };

  useEffect(() => {
    // Listen for title updates from other users
    socket.on("title-updated", (newTitle) => {
      setTitle(newTitle);
      localStorage.setItem(`doc_title_${docId}`, newTitle);
    });

    // Listen for save errors
    socket.on("save-error", (error) => {
      setSaveError(true);
      setSaveMessage(error.message);
      setTimeout(() => setSaveMessage(""), 3000);
    });

    return () => {
      socket.off("title-updated");
      socket.off("save-error");
    };
  }, [docId]);

  // Load saved title from localStorage on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem(`doc_title_${docId}`);
    if (savedTitle) {
      setTitle(savedTitle);
    } else if (location.state?.title) {
      setTitle(location.state.title);
      localStorage.setItem(`doc_title_${docId}`, location.state.title);
    }
  }, [docId, location.state?.title]);

  useDocumentSocket({
    docId,
    userId,
    quillRef,
    initialContent,
    setContent,
    setTitle,
  });

  const handleChanges = (value, delta, source) => {
    if (source === "user") {
      socket.emit("send-changes", { docId, delta });
    }
    setContent(quillRef.current.getEditor().getContents());
    
    // Auto-save after changes
    if (autoSave) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }
  };

  // Update title in localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`doc_title_${docId}`, title);
  }, [title, docId]);

  const handleAutoSave = async () => {
    if (!autoSave) return;
    setSaveError(false);
    
    try {
      socket.emit("save-document", { docId, content, title });
      setLastSaved(new Date());
      setSaveMessage("Auto-saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveError(true);
      setSaveMessage("Error auto-saving document");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSave = async () => {
    setSaveError(false);
    
    try {
      socket.emit("save-document", { docId, content, title });
      setLastSaved(new Date());
      setSaveMessage("Document saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveError(true);
      setSaveMessage("Error saving document");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: "#toolbar-container",
    },
    history: {
      delay: 2000,
      maxStack: 500,
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

  return (
    <div className="flex flex-col h-screen bg-[#0F172A]">
      <EditorHeader
        title={title}
        setTitle={setTitle}
        autoSave={autoSave}
        setAutoSave={setAutoSave}
        onSave={handleSave}
        saving={saving}
        lastSaved={lastSaved}
        saveError={saveError}
        saveMessage={saveMessage}
      />
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CustomToolbar />
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="h-full">
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={handleChanges}
              modules={modules}
              formats={formats}
              placeholder="Start typing your awesome content here..."
              className="h-full [&_.ql-editor]:min-h-[calc(100vh-15rem)] [&_.ql-editor]:text-lg [&_.ql-editor]:leading-relaxed"
              theme="snow"
            />
          </div>
        </div>
      </div>

      <EditorStatusBar content={content} />
    </div>
  );
};

export default TextEditor;
