import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import './App.css';
import ForgotPassword from './Components/LoginPages/ForgetPassword';
import LoginPage from './Components/LoginPages/loginPage';
import SignUpPage from './Components/LoginPages/SignupPage';
import { Dashboard } from './Dashboard/Dashboard';
import { Landingpage } from './LandingPage/Landingpage';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            isUserLoggedIn ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;