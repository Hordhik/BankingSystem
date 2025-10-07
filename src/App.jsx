// src/App.jsx

import './App.css';
import { Dashboard } from './Dashboard/Dashboard';
import { Landingpage } from './LandingPage/Landingpage';
import React, { useState } from 'react'; // Import useState

function App() {
  // Example: Use state to simulate login
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return (
    <>
      {/* This will show the Landingpage if not logged in, 
          and the Dashboard if they are. You can change 
          useState(false) to useState(true) to test it. */}
      {isUserLoggedIn ? <Dashboard /> : <Landingpage />}
    </>
  );
}

export default App;