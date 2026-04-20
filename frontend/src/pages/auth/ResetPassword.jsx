import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import Logo from "../../assets/logo.png";
import { authAPI } from '../../services/api';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.resetPassword({ 
        email, 
        newPassword 
      });
      
      if (response.data.success) {
        setSuccess(true);
        setEmail('');
        setNewPassword('');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Enter your email and new password to reset your account
          </p>

          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: '15px' }}>Password reset successfully! Redirecting to login...</div>}

          <form className="reset-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                placeholder="Enter your Email"
                className="reset-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reset-password">New Password</label>
              <input
                id="reset-password"
                type="password"
                placeholder="Enter your New Password"
                className="reset-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Submit'}
            </button>
          </form>

          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Back to Login</a>
          </p>
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
