import React, { useState } from 'react';
import './Login.css';
import Logo from "../../assets/logo.png";
import openEye from "../../assets/eye.svg";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="signin-section">

      <div className="signin-logo">
        <img src={Logo} alt="kozyful logo" />
      </div>

      <div className="signin-card">
        <p className="signin-title">Sign In</p>
        <p className="signin-description">
          Sign in to view open orders, update billing information and view past order details.
        </p>

        <form className="signin-form" onSubmit={(e) => e.preventDefault()}>

          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              placeholder="Enter your Email"
              className="signin-input"
            />
          </div>

          <div className="form-group">
            <div className="password-row">
              <label className="form-label" htmlFor="signin-password">Password</label>
              <a href="/forgot-password" className="forgot-link">Forgot Your Password?</a>
            </div>
            <div className="password-wrapper">
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="signin-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <img src={openEye} alt="Hide password" /> : <img src={openEye} alt="Show password" />}
              </button>
            </div>
          </div>

          <button type="submit" className="signin-btn">Sign in</button>
        </form>

        <p className="signin-footer">
          Haven't shopped with us before?{' '}
          <a href="/signup">Create an Account</a>
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

export default Login;
