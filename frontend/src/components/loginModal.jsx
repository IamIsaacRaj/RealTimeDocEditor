import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleLogin = async () => {
    // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/user/login`, form);
      login(res.data.user, res.data.token);
      onClose();
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    handleLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

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
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Logging in...
            </>
          ) : (
            "Login"
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

export default LoginModal;