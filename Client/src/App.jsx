import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Login Pages
import ForgotPassword from './Components/LoginPages/ForgetPassword';
import LoginPage from './Components/LoginPages/loginPage';
import SignUpPage from './Components/LoginPages/SignupPage';

// Dashboard + Pages
import { Dashboard } from './Dashboard/Dashboard';
import { Landingpage } from './LandingPage/Landingpage';
import PaymentPage from './Dashboard/Payments/PaymentPage.jsx';

// Protected Route Component
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment/:type?" element={<PaymentPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;