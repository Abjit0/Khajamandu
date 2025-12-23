import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Keep your existing imports
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import KhajamanduHome from "./Pages/KhajamanduHome";
import Admin from "./AdminPannel/Admin";
// Make sure this path matches where you saved the file
import RestaurantMenu from "./Menu/RestaurantMenu"; 

function App() {
  // 1. Create state to track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. Function to update state when user logs in
  const handleLogin = () => setIsAuthenticated(true);

  // 3. Function to update state when user logs out
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />

        {/* 4. Pass 'isAuthenticated' and 'onLogout' to Home */}
        <Route 
          path="/" 
          element={
            <KhajamanduHome 
              isAuthenticated={isAuthenticated} 
              onLogout={handleLogout} 
            />
          } 
        />

        {/* 5. Pass 'onLogin' function to Login and Signup */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/signup" 
          element={<Signup onLogin={handleLogin} />} 
        />

        {/* 6. NEW: Add the Restaurant Menu Route */}
        {/* The :id allows you to load dynamic menus later (e.g., restaurant/1, restaurant/2) */}
        <Route 
          path="/restaurant/:id" 
          element={<RestaurantMenu />} 
        />
       
      </Routes>
    </Router>
  );
}

export default App;