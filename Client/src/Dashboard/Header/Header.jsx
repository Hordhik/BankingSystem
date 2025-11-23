import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearCurrentUser } from '../../Components/Auth/userStore'
import './Header.css'

export const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearCurrentUser()
    navigate('/login')
  }

  return (
    <div className='header'>
      <div className="name">
        <div className="logo"></div>
        <div className="id">{localStorage.getItem('email') || localStorage.getItem('username') || 'user'}</div>
      </div>
      <div className="menu">
        <div className="menu-option active">Accounts</div>
        <div className="menu-option">Credit Card</div>
        <div className="menu-option">Transfer Funds</div>
        <div className="menu-option">Loans</div>
        <div className="menu-option">Offers</div>
      </div>
      <div className="logout">
        <div className="menu-option">Raise disputes</div>
        <div onClick={handleLogout} className="menu-option logout">Log Out</div>
      </div>
    </div>
  )
}
