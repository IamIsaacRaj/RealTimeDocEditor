// src/components/SignupModal.jsx
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const SignupModal = ({ isOpen, onClose }) => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Username validation
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/user/register`, form);
      console.log("Signed up successfully");
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.response?.data?.error || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form onSubmit={handleSignup} className="bg-white rounded-md p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          minLength={3}
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          minLength={6}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500 hover:underline"
          disabled={isLoading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default SignupModal;
