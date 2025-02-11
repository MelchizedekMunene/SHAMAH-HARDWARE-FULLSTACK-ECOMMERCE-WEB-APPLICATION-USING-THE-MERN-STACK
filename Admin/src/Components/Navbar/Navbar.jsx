import React from 'react'
import './Navbar.css'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="45" height="50">
          <path d="M50 10 C30 10 20 30 20 45 C20 65 35 75 40 80 L40 90 L60 90 L60 80 C65 75 80 65 80 45 C80 30 70 10 50 10 Z" fill="#FFA500" />
          <path d="M40 90 L40 95 L60 95 L60 90" fill="#FFA500" />
          <path d="M45 95 L45 100 L55 100 L55 95" fill="#FFA500" />
          <path d="M30 50 L45 65 L55 45 L70 60" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="logo-text">
          <h1>SHAMAH</h1>
          <span>Admin Panel</span>
        </div>
      </div>
      <img src={navProfile} alt="" />
    </div>
  )
}

export default Navbar