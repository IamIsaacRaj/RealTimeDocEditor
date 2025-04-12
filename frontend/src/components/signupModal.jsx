// src/components/SignupModal.jsx
import React, { useState } from "react";
import axios from "axios";

const SignupModal = ({ isOpen, onClose }) => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/register`, form);
      console.log("Signed up:", res.data);
      onClose();
    } catch (error) {
      console.log("Error signing up:", error);
      setError("User already exists or invalid data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Sign Up
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SignupModal;
