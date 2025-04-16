import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Search, FileUp, Grid, List, ChevronDown, User, LogOut, LogIn, UserPlus } from "lucide-react";
import mammoth from "mammoth";
import { marked } from 'marked';
import { Delta } from 'quill-delta';
import NewDocumentModal from "./components/newDocmentModal";
import LoginModal from "./components/loginModal";
import SignupModal from "./components/signupModal";
import { useAuth } from "./context/AuthContext";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleCreate = (title) => {
    const docId = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const userId = user ? user.id : "guest";
    navigate(`/document/${docId}/${userId}`, {
      state: { title },
    });
  };

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/documents");
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = documents
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleImport = async (e) => {
    const userId = user ? user.id : "guest";
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const docId = `imported-${Date.now()}`;

    reader.onerror = () => {
      alert("Error reading file");
    };

    try {
      switch (file.name.split('.').pop().toLowerCase()) {
        case 'txt':
          reader.onload = () => {
            const content = reader.result;
            navigate(`/document/${docId}/${userId}`, {
              state: {
                title: file.name,
                content: { ops: [{ insert: content }] },
              },
            });
          };
          reader.readAsText(file);
          break;

        case 'json':
          reader.onload = () => {
            try {
              const delta = JSON.parse(reader.result);
              navigate(`/document/${docId}/${userId}`, {
                state: { 
                  title: file.name, 
                  content: delta 
                },
              });
            } catch (error) {
              alert("Invalid JSON format! The file must contain valid Quill Delta format.");
            }
          };
          reader.readAsText(file);
          break;

        case 'docx':
          reader.onload = async () => {
            try {
              const arrayBuffer = reader.result;
              const result = await mammoth.convertToHtml({ arrayBuffer });
              // Convert the HTML to a proper Quill Delta format
              const delta = {
                ops: [
                  {
                    insert: result.value,
                    attributes: { renderAsHTML: true }
                  }
                ]
              };
              
              navigate(`/document/${docId}/${userId}`, {
                state: {
                  title: file.name,
                  content: delta,
                },
              });
            } catch (error) {
              console.error("Word conversion error:", error);
              alert("Error converting Word document. Please make sure it's a valid .docx file.");
            }
          };
          reader.readAsArrayBuffer(file);
          break;

        case 'md':
          reader.onload = () => {
            const markdown = reader.result;
            const html = marked(markdown);
            // Convert markdown HTML to Delta format
            const delta = {
              ops: [
                {
                  insert: html,
                  attributes: { renderAsHTML: true }
                }
              ]
            };
            navigate(`/document/${docId}/${userId}`, {
              state: {
                title: file.name,
                content: delta,
              },
            });
          };
          reader.readAsText(file);
          break;

        case 'html':
          reader.onload = () => {
            const html = reader.result;
            // Convert HTML to Delta format
            const delta = {
              ops: [
                {
                  insert: html,
                  attributes: { renderAsHTML: true }
                }
              ]
            };
            navigate(`/document/${docId}/${userId}`, {
              state: {
                title: file.name,
                content: delta,
              },
            });
          };
          reader.readAsText(file);
          break;

        case 'rtf':
          reader.onload = () => {
            // Convert RTF to plain text for now
            // You might want to use a proper RTF parser library for better conversion
            const content = reader.result;
            navigate(`/document/${docId}/${userId}`, {
              state: {
                title: file.name,
                content: { ops: [{ insert: content }] },
              },
            });
          };
          reader.readAsText(file);
          break;

        default:
          alert("Unsupported file type. Please use .txt, .json, .docx, .md, .html, or .rtf files.");
          return;
      }
    } catch (error) {
      console.error("Error importing document:", error);
      alert("Error importing document. Please try again.");
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">DocEditor</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Profile Menu */}
            <div className="relative profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-sm text-gray-600">{user?.username || "Guest"}</span>
                <User className="h-5 w-5 text-gray-600" />
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                  {!user ? (
                    <>
                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowSignup(true);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>New Document</span>
            </button>
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
              <FileUp className="h-5 w-5" />
              <span>Import</span>
              <input
                type="file"
                accept=".txt,.json,.docx,.md,.html,.rtf"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="text-sm border-0 bg-transparent focus:ring-0"
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
              >
                <option value="latest">Last edited</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredDocs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <button
                key={doc.docId}
                onClick={() => navigate(`/document/${doc.docId}/${user ? user.id : "guest"}`)}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="font-medium text-gray-900 mb-2">{doc.title || "Untitled"}</h2>
                    <p className="text-sm text-gray-500">Last edited: {formatTimeAgo(doc.updatedAt)}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{doc.createdBy ? "Shared" : "Only you"}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      <NewDocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
      />
    </div>
  );
}

export default App;
