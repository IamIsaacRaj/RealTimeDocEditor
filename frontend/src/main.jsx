import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import DocumentEditor from "./pages/DocumentEditor.page.jsx";
import { AuthProvider } from "./context/AuthContext";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* ⬅️ Wrap everything in AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/document/:id/:userId" element={<DocumentEditor />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
