// src/Dashboard/Dashboard.jsx

import React from 'react';
import './Dashboard.css';
// Corrected import path
import { Header } from '../components/Header/Header';

export const Dashboard = () => {
  return (
    <div className='dashboard'>
      {/* Pass props to show the logged-in version */}
      <Header isLoggedIn={true} userName="hordhik.reddy@ybl" />
      {/* You can add the rest of your dashboard content here */}
    </div>
  );
};