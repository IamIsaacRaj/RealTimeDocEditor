import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus } from "lucide-react";
import NewDocumentModal from "./components/newDocmentModal";
import LoginModal from "./components/loginModal";
import SignupModal from "./components/signupModal";
import { useAuth } from "./context/AuthContext";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { user } = useAuth();
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleCreate = (title) => {
    const docId = title.toLowerCase().replace(/\s+/g, "-");
    const userId = user ? user._id : "guest";
    navigate(`/document/${docId}/${userId}`, {
      state: { title }, // pass the real title
    });
  };

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/documents");
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents", err);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = documents
    .filter((doc) =>
      doc.docId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortOption === "oldest") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

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
      {/* Dashboard Tools */}
      <div className="mt-10">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search documents..."
            className="px-4 py-2 border rounded-md w-full md:w-1/2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Sort Dropdown */}
          <select
            className="px-4 py-2 border rounded-md"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="latest">Latest Edited</option>
            <option value="oldest">Oldest Edited</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <button
            key={doc.docId}
            onClick={() => navigate(`/document/${doc.docId}/guest`)}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-left"
          >
            <h2 className="font-semibold mb-2">{doc.docId}</h2>
            <p className="text-sm text-gray-500">
              Last edited: {new Date(doc.updatedAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
      {/* Sticky Bottom Navbar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md py-3 px-6 flex justify-between items-center z-50">
        <div className="text-sm text-gray-600">
          You're logged in as <strong>{user?.username || "Guest"}</strong>
        </div>
        <div className="space-x-4 text-sm">
          {!user ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload(); // or use logout from context if available
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={login}
        />
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSignup={login}
        />
      </footer>
    </div>
  );
}

export default App;
