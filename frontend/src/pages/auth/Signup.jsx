import React, { useState } from 'react';
import './Signup.css';
import Logo from "../../assets/logo.png";
import openEye from "../../assets/eye.svg";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <section className="signup-section">

      <div className="signup-logo">
        <img src={Logo} alt="kozyful logo" />
      </div>

      <div className="signup-card">
        <p className="signup-title">Create an Account</p>
        <p className="signup-description">
          Enter your email and we'll send you a create an account code
        </p>

        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Enter your Name"
              className="signup-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your Email"
              className="signup-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="signup-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <img src={openEye} alt="Hide password" /> : <img src={openEye} alt="Show password" /> }
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-repassword">Re-enter password</label>
            <div className="password-wrapper">
              <input
                id="signup-repassword"
                type={showRePassword ? 'text' : 'password'}
                placeholder="Re-enter your Password"
                className="signup-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowRePassword(!showRePassword)}
              >
                {showRePassword ? <img src={openEye} alt="Hide password" /> : <img src={openEye} alt="Show password" /> }
              </button>
            </div>
          </div>

          <button type="submit" className="signup-btn">Create an Account</button>
        </form>

        <p className="signup-footer">
          Already have an account?{' '}
          <a href="/login">Sign In</a>
        </p>
      </div>

      <div className="page-footer-wrapper">
        <div className="page-footer">
          <a href="/support">SUPPORT</a>
          <span className="divider">|</span>
          <a href="/terms">TERMS AND CONDITIONS</a>
        </div>
        <p className="copyright">©2024 | All right reserved</p>
      </div>

    </section>
  );
}

export default Signup;
