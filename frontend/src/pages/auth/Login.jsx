import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from "../../assets/logo.png";
import openEye from "../../assets/eye.svg";
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        await login(response.data.data);
        // Redirect based on role
        if (response.data.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              placeholder="Enter your Email"
              className="signin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-row">
              <label className="form-label" htmlFor="signin-password">Password</label>
              <a href="/reset-password" className="forgot-link">Forgot Your Password?</a>
            </div>
            <div className="password-wrapper">
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="signin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={openEye} alt={showPassword ? 'Hide password' : 'Show password'} />
              </button>
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
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