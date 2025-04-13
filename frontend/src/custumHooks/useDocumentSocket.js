import { useEffect, useRef } from "react";
import socket from "../utils/socketClient";

const useDocumentSocket = ({
  docId,
  userId,
  quillRef,
  setContent,
  setTitle, // ✅ Accept this too
  initialContent = { ops: [] },
}) => {
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (!hasJoinedRef.current) {
      socket.emit("join-document", docId, userId);
      hasJoinedRef.current = true;
    }

    socket.on("user-joined", (userId) => {
      console.log(`User joined: ${userId}`);
    });

    socket.on("load-document", (documentContent, documentTitle) => {
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const contentToLoad =
        documentContent?.ops?.length > 0 ? documentContent : initialContent;

      editor.setContents(contentToLoad);
      setContent(contentToLoad);
      if (setTitle) setTitle(documentTitle || "Untitled Document");
    });

    socket.on("receive-changes", (delta) => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.updateContents(delta);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, [docId, userId, quillRef, setContent, initialContent, setTitle]);
};

export default useDocumentSocket;
