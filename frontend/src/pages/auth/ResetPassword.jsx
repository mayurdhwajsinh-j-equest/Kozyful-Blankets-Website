import React from 'react';
import './ResetPassword.css';
import Logo from "../../assets/logo.png";

function ResetPassword() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reset password logic here
  };

  return (
    <section className="reset-section">

      <div className="reset-logo">
        <img src={Logo} alt="kozyful logo" />
      </div>

      <div className="reset-card">
        <div className="reset-form-wrapper">
          <p className="reset-title">Reset your password</p>
          <p className="reset-description">
            We will send you an email to reset your password
          </p>

          <form className="reset-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                placeholder="Enter your Email"
                className="reset-input"
              />
            </div>

            <button type="submit" className="reset-btn">Submit</button>
          </form>
        </div>
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

export default ResetPassword;
