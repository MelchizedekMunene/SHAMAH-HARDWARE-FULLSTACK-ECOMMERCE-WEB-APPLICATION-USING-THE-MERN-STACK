import React from 'react'
import './Footer.css'
import instagram_icon from '../assets/instagram_icon.png'
import whatsapp_icon from '../assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="35" height="30">
            <path d="M50 10 C30 10 20 30 20 45 C20 65 35 75 40 80 L40 90 L60 90 L60 80 C65 75 80 65 80 45 C80 30 70 10 50 10 Z" fill="#FFA500" />
            <path d="M40 90 L40 95 L60 95 L60 90" fill="#FFA500" />
            <path d="M45 95 L45 100 L55 100 L55 95" fill="#FFA500" />
            <path d="M30 50 L45 65 L55 45 L70 60" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>SHAMAH HARDWARE & ELECTRICALS LIMITED</p>
      </div>
      <ul className='footer-links'>
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
            <img src={whatsapp_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - <i>Shamah Hardware & ELectricals Limited</i></p>
      </div>
    </div>
  )
}

export default Footer
