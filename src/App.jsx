import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./AdminPannel/Admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin panel route */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;