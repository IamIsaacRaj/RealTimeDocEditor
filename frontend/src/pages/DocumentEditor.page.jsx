import React from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/TextEditor";

const DocumentEditor = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Real-Time Document Editor</h1>
      <p className="mb-4 text-gray-600">Editing Document ID: {id}</p>
      <TextEditor />
    </div>
  );
};

export default DocumentEditor;
