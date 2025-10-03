import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './Components/LoginPages/loginPage'
import SignUpPage from './Components/LoginPages/SignupPage'
import { Dashboard } from './Dashboard/Dashboard'
import ForgotPassword from './Components/LoginPages/ForgetPassword'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
