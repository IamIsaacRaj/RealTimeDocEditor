import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

const DocumentEditor = () => {
  const { id } = useParams();
   const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (!hasJoinedRef.current) {
      socket.emit("join-document", id);
      hasJoinedRef.current = true; // Mark as joined
    }

    socket.on("user-joined", (userId) => {
      console.log(`User joined: ${userId}`);
    });

    return () => {
      socket.off("user-joined"); // Cleanup event listeners
    };
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Document Editor</h1>
      <p className="mt-2 text-gray-600">Editing Document ID: {id}</p>
    </div>
  );
};

export default DocumentEditor;
