import { useEffect } from 'react';
import { Search, User, ChevronDown, LogOut, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ setSearchQuery, showProfileMenu, setShowProfileMenu, setShowLogin, setShowSignup }) => {
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

  return (
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
  );
};

export default Header; 