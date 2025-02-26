import React, { useContext, useState, useRef, useEffect } from 'react';
import './navbar.css';
import cart_icon from '../assets/cart.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
    const [menu, setMenu] = useState("SHOP");
    const { getTotalCartItems } = useContext(ShopContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleMenuItemClick = (menuItem) => {
        setMenu(menuItem);
        setMobileMenuOpen(false); // Close mobile menu after selection
    };

    const handleLogoClick = () => {
        setMenu("SHOP"); // Reset menu to SHOP when logo is clicked
        setMobileMenuOpen(false); // Close mobile menu if open
    };

    return (
        <div className="navbar">
            {/* Logo with Link to homepage */}
            <Link to="/" className="nav-logo-link" onClick={handleLogoClick}>
                <div className="nav-logo">
                    <div className="logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="35" height="30">
                            <path d="M50 10 C30 10 20 30 20 45 C20 65 35 75 40 80 L40 90 L60 90 L60 80 C65 75 80 65 80 45 C80 30 70 10 50 10 Z" fill="#FFA500" />
                            <path d="M40 90 L40 95 L60 95 L60 90" fill="#FFA500" />
                            <path d="M45 95 L45 100 L55 100 L55 95" fill="#FFA500" />
                            <path d="M30 50 L45 65 L55 45 L70 60" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p>SHAMAH</p>
                </div>
            </Link>

            {/* Mobile menu button */}
            <div className="hamburger-menu" onClick={toggleMobileMenu}>
                <div className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {/* Navigation menu - desktop and mobile */}
            <div ref={menuRef} className={`nav-menu-container ${mobileMenuOpen ? 'active' : ''}`}>
                <ul className="nav-menu">
                    <li onClick={() => handleMenuItemClick("SHOP")}>
                        <Link style={{ textDecoration: 'none' }} to='/'>SHOP</Link>
                        {menu === "SHOP" ? <hr /> : <></>}
                    </li>
                    <li onClick={() => handleMenuItemClick("CONSTRUCTION")}>
                        <Link style={{ textDecoration: 'none' }} to='/CONSTRUCTION'>CONSTRUCTION</Link>
                        {menu === "CONSTRUCTION" ? <hr /> : <></>}
                    </li>
                    <li onClick={() => handleMenuItemClick("ELECTRICALS")}>
                        <Link style={{ textDecoration: 'none' }} to='/ELECTRICALS'>ELECTRICALS</Link>
                        {menu === "ELECTRICALS" ? <hr /> : <></>}
                    </li>
                    <li onClick={() => handleMenuItemClick("PLUMBING")}>
                        <Link style={{ textDecoration: 'none' }} to='/PLUMBING'>PLUMBING</Link>
                        {menu === "PLUMBING" ? <hr /> : <></>}
                    </li>
                    <li onClick={() => handleMenuItemClick("FARM TOOLS")}>
                        <Link style={{ textDecoration: 'none' }} to='/FARM TOOLS'>FARM TOOLS</Link>
                        {menu === "FARM TOOLS" ? <hr /> : <></>}
                    </li>
                </ul>
            </div>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                    ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Log Out</button>
                    : <Link to='/login'><button>Login</button></Link>}
                <Link to='/Cart'><img src={cart_icon} alt="Cart" width="40" height="40" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    );
};

export default Navbar;