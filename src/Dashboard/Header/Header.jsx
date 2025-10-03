import React from 'react'
import './Header.css'

export const Header = () => {
  return (
    <div className='header'>
        <div className="name">
            <div className="logo"></div>
            <div className="id">hordhik.reddy@ybl</div>
        </div>
        <div className="menu">
          <div className="menu-option active">Home</div>
            <div className="menu-option">Accounts</div>
            <div className="menu-option">Credit Card</div>
            <div className="menu-option">Transfer Funds</div>
            <div className="menu-option">Loans</div>
            <div className="menu-option">Offers</div>
            </div>
        <div className="logout">
            <div className="menu-option">Raise disputes</div>
            <div className="menu-option logout">Log Out</div>
        </div>
    </div>
  )
}
