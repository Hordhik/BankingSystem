import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header = ({ isLoggedIn, userName }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    // Add any logout logic here
    navigate('/login');
  };

  return (
    <div className='header'>
      {isLoggedIn ? (
        <>
          <div className="name">
            <div className="logo"></div>
            <div className="id">{userName}</div>
          </div>
        </>
      ) : (
        <>
          <div className='fluit_logo'>FLUIT</div>
        </>
      )}

      <div className="menu">
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
        {isLoggedIn ? (
          <>
            <div className="menu-option">Raise disputes</div>
            <div className="menu-option logout" onClick={handleLogout}>Log Out</div>
          </>
        ) : (
          <>
            <div className="menu-option" onClick={handleSignUp}>Sign Up</div>
            <div className="menu-option logout" onClick={handleLogin}>Log In</div>
          </>
        )}
      </div>
    </div>
  );
};