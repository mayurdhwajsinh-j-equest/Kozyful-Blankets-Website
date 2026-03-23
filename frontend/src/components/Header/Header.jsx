import React from 'react';
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import profileIcon from "../../assets/profile-icon.svg";
import cartIcon from "../../assets/cart-icon.svg";
import "./Header.css";

function Header() {
    return (
        <header className="navbar-wrapper">
            <div className="top-bar-content">
                <span>
                    Free shipping on orders £35.00+   |  
                    <Link to="/shop" className='shop-now'>SHOP NOW</Link>
                </span>
            </div>


            <nav className="navbar">
                <div className="container">
                    <ul className="navbar__left">
                        <li>
                            <Link to="/sale">FATHERS DAY SALE <span className='save30'>SAVE 30%</span></Link>
                        </li>
                        <li><Link to="/blankets">BLANKETS</Link></li>
                        <li><Link to="/towels">TOWELS</Link></li>
                    </ul>

                    <div className="navbar__center">
                        <Link to="/" className="navbar__logo">
                            <img src={Logo} alt="Company Logo" className="navbar__logo" /> 
                        </Link>
                    </div>

                    <ul className="navbar__right">
                        <li><Link to="/support">SUPPORT</Link></li>
                        <li><Link to="/blog">BLOG</Link></li>
                        <li><Link to="/blankets" className='btn-shopBlankets'>Shop Blankets</Link></li>
                        <li>
                            <Link to="/profile">
                                <img src={profileIcon} alt="User Profile" className='profile-icon'/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" aria-label="Shopping Cart">
                                <img src={cartIcon} alt="Shopping Cart" className='cart-icon'/>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;