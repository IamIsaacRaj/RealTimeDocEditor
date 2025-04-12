import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import DocumentEditor from "./pages/DocumentEditor.page.jsx";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/document/:id/:userId" element={<DocumentEditor />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
