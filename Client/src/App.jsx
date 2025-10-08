import React, { useState } from 'react';
// Make sure to import Navigate for redirection
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import './App.css';
import ForgotPassword from './Components/LoginPages/ForgetPassword';
import LoginPage from './Components/LoginPages/loginPage';
import SignUpPage from './Components/LoginPages/SignupPage';
import { Dashboard } from './Dashboard/Dashboard';
import { Landingpage } from './LandingPage/Landingpage'; // Import the Landingpage

function App() {
  // This state now controls access to the dashboard
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Landingpage />} /> {/* Landingpage is now the homepage */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* --- Protected Route (Inline Method) --- */}
        <Route
          path="/dashboard"
          element={
            // If user is logged in, show Dashboard. If not, redirect to /login.
            isUserLoggedIn ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;