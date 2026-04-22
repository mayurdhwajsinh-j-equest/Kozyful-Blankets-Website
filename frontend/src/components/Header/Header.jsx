import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import profileIcon from "../../assets/profile-icon.svg";
import cartIcon from "../../assets/cart-icon.svg";
import "./Header.css";
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Only close if click is truly outside the dropdown container
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        // Use mousedown on document but with capture=false so dropdown links fire first
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    const closeDropdown = () => setDropdownOpen(false);

    return (
        <header className="navbar-wrapper">
            <div className="top-bar-content">
                <span>
                    Free shipping on orders £35.00+ |
                    <Link to="/shop" className='shop-now'> SHOP NOW</Link>
                </span>
            </div>

            <nav className="navbar">
                <div className="container">
                    <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    {/* Left nav links */}
                    <ul className="navbar__left">
                        <li><Link to="/sale">FATHERS DAY SALE <span className="save30">SAVE 30%</span></Link></li>
                        <li><Link to="/collection">BLANKETS</Link></li>
                        <li><Link to="/collection">TOWELS</Link></li>
                    </ul>

                    <div className="navbar__center">
                        <Link to="/"><img src={Logo} alt="Company Logo" className="navbar__logo" /></Link>
                    </div>

                    <ul className={`navbar__right ${menuOpen ? "active" : ""}`}>
                        <li className="support-link"><Link to="/FAQ" onClick={() => setMenuOpen(false)}>SUPPORT</Link></li>
                        <li className="blog-link"><Link to="/FAQ" onClick={() => setMenuOpen(false)}>BLOG</Link></li>
                        <li className="shop-blankets-link">
                            <Link to="/collection" className="btn-shopBlankets" onClick={() => setMenuOpen(false)}>
                                Shop Blankets
                            </Link>
                        </li>

                        {/* ── Profile with dropdown ── */}
                        <li className="navbar__profile" ref={dropdownRef}>
                            <button
                                className="navbar__profile-btn"
                                onClick={() => setDropdownOpen(prev => !prev)}
                                type="button"
                            >
                                <img src={profileIcon} alt="User Profile" className="profile-icon" />
                                {isAuthenticated && user?.name && (
                                    <span className="navbar__username">{user.name.split(' ')[0]}</span>
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="navbar__dropdown" onMouseDown={(e) => e.stopPropagation()}>
                                    {isAuthenticated ? (
                                        <>
                                            <div className="navbar__dropdown-header">
                                                <p className="navbar__dropdown-name">{user?.name}</p>
                                                <p className="navbar__dropdown-email">{user?.email}</p>
                                            </div>
                                            <div className="navbar__dropdown-divider" />
                                            <Link to="/profile" className="navbar__dropdown-item" onClick={closeDropdown}>
                                                👤 My Profile
                                            </Link>
                                            <Link to="/orders" className="navbar__dropdown-item" onClick={closeDropdown}>
                                                📦 My Orders
                                            </Link>
                                            <Link to="/cart" className="navbar__dropdown-item" onClick={closeDropdown}>
                                                🛒 My Cart {cartCount > 0 && `(${cartCount})`}
                                            </Link>
                                            <div className="navbar__dropdown-divider" />
                                            <button
                                                className="navbar__dropdown-item navbar__dropdown-logout"
                                                onClick={handleLogout}
                                                type="button"
                                            >
                                                🚪 Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="navbar__dropdown-item" onClick={closeDropdown}>
                                                Sign In
                                            </Link>
                                            <Link to="/signup" className="navbar__dropdown-item" onClick={closeDropdown}>
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>

                        {/* Cart icon with badge */}
                        <li className="cart-link">
                            <Link to="/cart" className="navbar__cart" onClick={() => setMenuOpen(false)}>
                                <img src={cartIcon} alt="Cart" className="cart-icon" />
                                {cartCount > 0 && (
                                    <span className="navbar__cart-badge">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;