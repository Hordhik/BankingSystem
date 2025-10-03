// src/components/Header/Header.jsx

import React from 'react';
import './Header.css';

// Accept `isLoggedIn` and `userName` as props
export const Header = ({ isLoggedIn, userName }) => {
  return (
    <div className='header'>
      <div className="name">
        <div className="logo"></div>
        {/* Only show the user ID if they are logged in */}
        {isLoggedIn && <div className="id">{userName}</div>}
      </div>

      <div className="menu">
        {/* Show different menu items based on login status */}
        {isLoggedIn ? (
          <>
            <div className="menu-option active">Accounts</div>
            <div className="menu-option">Credit Card</div>
            <div className="menu-option">Transfer Funds</div>
            <div className="menu-option">Loans</div>
            <div className="menu-option">Offers</div>
          </>
        ) : (
          <>
            <div className="menu-option active">Home</div>
            <div className="menu-option">Cards</div>
            <div className="menu-option">Transfer Funds</div>
            <div className="menu-option">Loans</div>
            <div className="menu-option">Offers</div>
          </>
        )}
      </div>

      <div className="logout">
        {/* Show "Log Out" or "Log In" based on login status */}
        {isLoggedIn ? (
          <>
            <div className="menu-option">Raise disputes</div>
            <div className="menu-option logout">Log Out</div>
          </>
        ) : (
          <>
            <div className="menu-option">Sign Up</div>
            <div className="menu-option logout">Log In</div>
          </>
        )}
      </div>
    </div>
  );
};