import React from "react";
import { useParams } from "react-router-dom";

const DocumentEditor = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Document Editor</h1>
      <p className="mt-2 text-gray-600">Editing Document ID: {id}</p>
    </div>
  );
};

export default DocumentEditor;
