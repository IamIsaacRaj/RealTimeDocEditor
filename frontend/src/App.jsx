import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
import Header from "./components/Header";
import ActionBar from "./components/ActionBar";
import DocumentControls from "./components/DocumentControls";
import DocumentGrid from "./components/DocumentGrid";
import TextEditor from "./components/TextEditor";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import NewDocumentModal from "./components/newDocumentModal";
import { useAuth } from "./context/AuthContext";

const socket = io("http://localhost:5000");

function App() {
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents
    .filter((doc) => {
      if (filter === "owned") return doc.creator === user?.id;
      if (filter === "shared") return doc.isShared;
      return true;
    })
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        setSearchQuery={setSearchQuery}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        setShowLogin={setShowLogin}
        setShowSignup={setShowSignup}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ActionBar setShowModal={setShowModal} user={user} />
                <DocumentControls
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  filter={filter}
                  setFilter={setFilter}
                  user={user}
                />
                <DocumentGrid documents={filteredDocuments} user={user} />
              </>
            }
          />
          <Route
            path="/document/:id/:userId"
            element={<TextEditor socket={socket} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      {showModal && <NewDocumentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
