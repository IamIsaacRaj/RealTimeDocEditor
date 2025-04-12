import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import NewDocumentModal from "./components/newDocmentModal";

function App() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (title) => {
    const docId = title.toLowerCase().replace(/\s+/g, "-");
    const userId = "guest";
    navigate(`/document/${docId}/${userId}`, {
      state: { title }, // pass the real title
    });
  };


  const recentDocuments = [
    { id: "123", title: "Project Plan", lastEdited: "2 hours ago" },
    { id: "456", title: "Meeting Notes", lastEdited: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={18} /> New Document
        </button>
      </div>

      <NewDocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recentDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => navigate(`/document/${doc.id}/guest`)}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-left"
          >
            <h2 className="font-semibold mb-2">{doc.title}</h2>
            <p className="text-sm text-gray-500">
              Last edited: {doc.lastEdited}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
