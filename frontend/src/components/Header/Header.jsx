import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import profileIcon from "../../assets/profile-icon.svg";
import cartIcon from "../../assets/cart-icon.svg";
import hamburgerIcon from "../../assets/hamburger.svg";
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/login');
    };

    const closeAll = () => {
        setDropdownOpen(false);
        setMenuOpen(false);
    };

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

                    {/* ── Hamburger (mobile only) ── */}
                    <button
                        className={`hamburger ${menuOpen ? "open" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        type="button"
                    >
                        {menuOpen
                            ? <span className="hamburger__close">✕</span>
                            : <img src={hamburgerIcon} alt="Menu" className="hamburger__img" />
                        }
                    </button>

                    {/* ── Left nav links (desktop only) ── */}
                    <ul className="navbar__left">
                        <li><Link to="/sale">FATHERS DAY SALE <span className="save30">SAVE 30%</span></Link></li>
                        <li><Link to="/collection">BLANKETS</Link></li>
                        <li><Link to="/collection">TOWELS</Link></li>
                    </ul>

                    {/* ── Logo (center) ── */}
                    <div className="navbar__center">
                        <Link to="/"><img src={Logo} alt="Company Logo" className="navbar__logo" /></Link>
                    </div>

                    {/* ── Right section ── */}
                    <ul className="navbar__right">

                        {/* Desktop-only nav links */}
                        <li className="desktop-only"><Link to="/FAQ">SUPPORT</Link></li>
                        <li className="desktop-only"><Link to="/FAQ">BLOG</Link></li>
                        <li className="desktop-only">
                            <Link to="/collection" className="btn-shopBlankets">Shop Blankets</Link>
                        </li>

                        {/* Shop Blankets — mobile navbar bar only (replaces profile icon) */}
                        <li className="mobile-only">
                            <Link to="/collection" className="btn-shopBlankets btn-shopBlankets--mobile" onClick={closeAll}>
                                Shop Blankets
                            </Link>
                        </li>

                        {/* Profile dropdown — desktop only */}
                        <li className="navbar__profile desktop-only" ref={dropdownRef}>
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
                                            <Link to="/profile" className="navbar__dropdown-item" onClick={closeAll}>👤 My Profile</Link>
                                            <Link to="/orders" className="navbar__dropdown-item" onClick={closeAll}>📦 My Orders</Link>
                                            <Link to="/cart" className="navbar__dropdown-item" onClick={closeAll}>🛒 My Cart {cartCount > 0 && `(${cartCount})`}</Link>
                                            <div className="navbar__dropdown-divider" />
                                            <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout} type="button">
                                                🚪 Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="navbar__dropdown-header">
                                                <p className="navbar__dropdown-name">Welcome!</p>
                                                <p className="navbar__dropdown-email">Sign in to access your account</p>
                                            </div>
                                            <div className="navbar__dropdown-divider" />
                                            <Link to="/login" className="navbar__dropdown-item navbar__dropdown-auth-btn navbar__dropdown-signin" onClick={closeAll}>
                                                🔑 Sign In
                                            </Link>
                                            <Link to="/signup" className="navbar__dropdown-item navbar__dropdown-auth-btn navbar__dropdown-register" onClick={closeAll}>
                                                ✨ Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>

                        {/* Cart icon — always visible */}
                        <li className="cart-link">
                            <Link to="/cart" className="navbar__cart" onClick={closeAll}>
                                <img src={cartIcon} alt="Cart" className="cart-icon" />
                                {cartCount > 0 && (
                                    <span className="navbar__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ── Mobile slide-down menu ── */}
                {menuOpen && (
                    <div className="mobile-menu">

                        {isAuthenticated ? (
                            <>
                                {/* 1. User info card — top */}
                                <div className="mobile-menu__user">
                                    <div className="mobile-menu__avatar-wrap">
                                        <img src={profileIcon} alt="Profile" className="mobile-menu__avatar" />
                                    </div>
                                    <div>
                                        <p className="mobile-menu__name">{user?.name}</p>
                                        <p className="mobile-menu__email">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="mobile-menu__divider" />

                                {/* 2. Account links */}
                                <ul className="mobile-menu__links">
                                    <li><Link to="/profile" onClick={closeAll}>My Profile</Link></li>
                                    <li><Link to="/orders" onClick={closeAll}>My Orders</Link></li>
                                    <li>
                                        <Link to="/cart" onClick={closeAll}>
                                            My Cart {cartCount > 0 && <span className="mobile-menu__badge">{cartCount}</span>}
                                        </Link>
                                    </li>
                                </ul>

                                <div className="mobile-menu__divider" />

                                {/* 3. Nav links */}
                                <ul className="mobile-menu__links">
                                    <li><Link to="/FAQ" onClick={closeAll}>Support</Link></li>
                                    <li><Link to="/blog" onClick={closeAll}>Blog</Link></li>
                                </ul>

                                <div className="mobile-menu__divider" />

                                {/* 4. Logout */}
                                <button className="mobile-menu__logout" onClick={handleLogout} type="button">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Not logged in — nav links first, then auth */}
                                <ul className="mobile-menu__links">
                                    <li><Link to="/FAQ" onClick={closeAll}>Support</Link></li>
                                    <li><Link to="/blog" onClick={closeAll}>Blog</Link></li>
                                </ul>

                                <div className="mobile-menu__divider" />

                                <div className="mobile-menu__auth">
                                    <p className="mobile-menu__auth-label">Your Account</p>
                                    <Link to="/login" className="mobile-menu__btn mobile-menu__btn--signin" onClick={closeAll}>
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="mobile-menu__btn mobile-menu__btn--register" onClick={closeAll}>
                                        Create Account
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;