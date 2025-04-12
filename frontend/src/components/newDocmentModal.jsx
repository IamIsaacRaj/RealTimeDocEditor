import React, { useState } from "react";

const NewDocumentModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Create New Document</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter document title"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDocumentModal;
