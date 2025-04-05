import { useEffect, useRef } from "react";
import socket from "../utils/socketClient";


const useDocumentSocket = ({ docId, userId, quillRef, setContent }) => {
  const hasJoinedRef = useRef(false);

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
  });
};

export default useDocumentSocket