import React, { useContext , useState } from 'react';
import './navbar.css';
import cart_icon from '../assets/cart.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {

    const [menu,setMenu] = useState("SHOP");
    const {getTotalCartItems} = useContext(ShopContext);

  return (
    <div className="navbar">
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
      <ul className="nav-menu">
        <li onClick={()=>{setMenu("SHOP")}}><Link style={{ textDecoration: 'none'}} to='/'>SHOP</Link>{menu=== "SHOP"?<hr />:<></>}</li>
        <li onClick={()=>{setMenu("CONSTRUCTION")}}><Link style={{ textDecoration: 'none'}} to='/CONSTRUCTION'>CONSTRUCTION</Link>{menu=== "CONSTRUCTION"?<hr />:<></>}</li>
        <li onClick={()=>{setMenu("ELECTRICALS")}}><Link style={{ textDecoration: 'none'}} to='/ELECTRICALS'>ELECTRICALS</Link>{menu=== "ELECTRICALS"?<hr />:<></>}</li>
        <li onClick={()=>{setMenu("PLUMBING")}}><Link style={{ textDecoration: 'none'}} to='/PLUMBING'>PLUMBING</Link>{menu=== "PLUMBING"?<hr />:<></>}</li>
        <li onClick={()=>{setMenu("FARM TOOLS")}}><Link style={{ textDecoration: 'none'}} to='/FARM TOOLS'>FARM TOOLS</Link>{menu=== "FARM TOOLS"?<hr />:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to='/Login'><button>Log In</button></Link>
        <Link to='/Cart'><img src={cart_icon} alt="Cart" width="40" height="40"/></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
