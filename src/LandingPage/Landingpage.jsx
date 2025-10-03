// src/LandingPage/Landingpage.jsx

import React from 'react';
// Corrected import path
import { Header } from '../components/Header/Header';
import './Landingpage.css';

export const Landingpage = () => {
  return (
    <div className='landingpage'>
      {/* Pass props to show the logged-out version */}
      <Header isLoggedIn={false} />
      {/* You can add the rest of your landing page content here */}
    </div>
  );
};